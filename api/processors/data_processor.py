# data_processor.py

import pandas as pd
import numpy as np
from typing import Dict, Any, List, Union, Tuple
import logging
import re
from decimal import Decimal
import scipy.stats as stats

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self):
        self.overall_data = None
        self.transaction_data = None
        
    def clean_revenue(self, value: str) -> float:
        """Nettoie et convertit les valeurs de revenus en float."""
        if pd.isna(value) or value == '':
            return 0.0
        
        if isinstance(value, (int, float)):
            return float(value)
        
        # Supprime tous les symboles monétaires et caractères non numériques sauf . et -
        cleaned = re.sub(r'[^\d.-]', '', str(value))
        try:
            return float(cleaned)
        except ValueError:
            return 0.0

    def clean_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Nettoie et prépare le dataframe."""
        try:
            # Copie pour éviter de modifier l'original
            df = df.copy()
            
            # Convertit les colonnes de revenus si elles existent
            revenue_columns = [col for col in df.columns if 'revenue' in str(col).lower()]
            for col in revenue_columns:
                df[col] = df[col].apply(self.clean_revenue)
                
            # Remplace les valeurs nulles par des valeurs appropriées selon le type
            for column in df.columns:
                if df[column].dtype == 'object':
                    df[column] = df[column].fillna('')
                else:
                    df[column] = df[column].fillna(0)
                    
            return df
        except Exception as e:
            logger.error(f"Erreur lors du nettoyage du DataFrame: {str(e)}")
            raise

    def process_data(self, overall_data: List[Dict[str, Any]], transaction_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Traite les données des deux fichiers."""
        try:
            # Vérification des données
            if not overall_data:
                raise ValueError("Les données overall_data sont vides")
            
            # Conversion en DataFrames
            overall_df = pd.DataFrame(overall_data)
            transaction_df = pd.DataFrame(transaction_data if transaction_data else [])
            
            logger.info("Colonnes overall: %s", overall_df.columns.tolist())
            logger.info("Types de données overall: %s", overall_df.dtypes.to_dict())
            
            # Nettoyage des données
            overall_df = self.clean_dataframe(overall_df)
            if not transaction_df.empty:
                transaction_df = self.clean_dataframe(transaction_df)
            
            # Stockage des données traitées
            self.overall_data = overall_df
            self.transaction_data = transaction_df
            
            # Préparation de la réponse
            response = {
                'raw_data': {
                    'overall': overall_df.to_dict('records'),
                    'transaction': transaction_df.to_dict('records') if not transaction_df.empty else []
                },
                'summary': {
                    'overall_rows': len(overall_df),
                    'transaction_rows': len(transaction_df),
                    'columns_overall': list(overall_df.columns),
                    'columns_transaction': list(transaction_df.columns) if not transaction_df.empty else []
                }
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Erreur lors du traitement des données: {str(e)}")
            raise

    def aggregate_transactions(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Agrège les données de transaction par transaction_id.
        Groupe et concatène toutes les informations des colonnes tout en sommant les valeurs numériques.
        """
        try:
            # Conversion en DataFrame
            df = pd.DataFrame(data)
            if df.empty:
                logger.warning("Aucune donnée à agréger")
                return []

            # Obtenir la liste des colonnes disponibles
            columns = df.columns.tolist()
            
            # Définir les colonnes numériques
            numeric_columns = ['quantity', 'revenue']
            # Définir les colonnes à garder la première valeur
            first_value_columns = ['variation', 'device_category']
            # Définir les colonnes à concaténer
            concat_columns = ['item_category2', 'item_name', 'item_bundle', 'item_name_simple']
            
            # Créer le dictionnaire d'agrégation dynamiquement
            agg_dict = {}
            
            # Pour chaque colonne, déterminer la méthode d'agrégation
            for col in columns:
                if col == 'transaction_id':
                    continue
                elif col in numeric_columns:
                    agg_dict[col] = 'sum'
                elif col in first_value_columns:
                    agg_dict[col] = 'first'
                elif col in concat_columns:
                    agg_dict[col] = lambda x: ' | '.join(sorted(set(str(i) for i in x if pd.notna(i) and str(i).strip())))
                else:
                    # Pour toute autre colonne, garder la première valeur
                    agg_dict[col] = 'first'

            # Grouper les transactions
            grouped = df.groupby('transaction_id').agg(agg_dict).reset_index()

            # Nettoyage des valeurs numériques
            for col in numeric_columns:
                if col in grouped.columns:
                    grouped[col] = pd.to_numeric(grouped[col], errors='coerce').fillna(0).round(2)

            # Log des résultats pour debugging
            logger.info(f"Nombre d'enregistrements avant agrégation: {len(df)}")
            logger.info(f"Nombre d'enregistrements après agrégation: {len(grouped)}")
            logger.info(f"Colonnes agrégées: {list(agg_dict.keys())}")

            # Afficher un exemple de résultat pour debugging
            if not grouped.empty:
                logger.info("Premier enregistrement agrégé :")
                logger.info(grouped.iloc[0].to_dict())

            return grouped.to_dict('records')

        except Exception as e:
            logger.error(f"Erreur lors de l'agrégation des transactions: {str(e)}", exc_info=True)
            raise

    def calculate_uplift_and_confidence(
        self, 
        control_data: List[float], 
        variation_data: List[float],
        metric_type: str = 'normal'
    ) -> Tuple[float, float]:
        """
        Calcule l'uplift et le niveau de confiance pour une variation vs contrôle.
        
        Args:
            control_data: Données du groupe contrôle
            variation_data: Données de la variation
            metric_type: Type de métrique ('normal' ou 'revenue')
            
        Returns:
            Tuple[float, float]: (uplift en pourcentage, niveau de confiance)
        """
        if not control_data or not variation_data:
            return 0.0, 0.0

        # Calcul de l'uplift
        control_mean = np.mean(control_data)
        variation_mean = np.mean(variation_data)
        
        uplift = ((variation_mean - control_mean) / control_mean) * 100 if control_mean != 0 else 0

        # Calcul du niveau de confiance
        if metric_type == 'revenue':
            # Test de Mann-Whitney U pour les revenus
            _, p_value = stats.mannwhitneyu(
                variation_data, 
                control_data, 
                alternative='two-sided'
            )
        else:
            # Test t pour les métriques normales
            _, p_value = stats.ttest_ind(
                variation_data,
                control_data,
                equal_var=False  # Test de Welch pour variance inégale
            )

        confidence = (1 - p_value) * 100
        
        return round(uplift, 2), round(confidence, 2)

    def calculate_overview_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calcule les métriques d'overview pour toutes les variations."""
        try:
            logger.info("Starting overview metrics calculation")
            
            # Séparer les données overall et transaction
            overall_data = data.get('overall', [])
            transaction_data = data.get('transaction', [])
            
            logger.info(f"Overall data records: {len(overall_data)}")
            logger.info(f"Transaction data records: {len(transaction_data)}")
            
            if not overall_data:
                raise ValueError("Overall data is required")
            
            # Conversion en DataFrames avec validation
            try:
                overall_df = pd.DataFrame(overall_data)
                logger.info(f"Overall columns: {overall_df.columns.tolist()}")
                
                # Vérifier les colonnes requises
                required_columns = ['variation', 'users', 'sessions', 'user_add_to_carts']
                missing_columns = [col for col in required_columns if col not in overall_df.columns]
                if missing_columns:
                    raise ValueError(f"Missing required columns in overall data: {missing_columns}")
                    
                # Vérifier les types de données
                for col in ['users', 'sessions', 'user_add_to_carts']:
                    overall_df[col] = pd.to_numeric(overall_df[col], errors='coerce')
                    
            except Exception as e:
                raise ValueError(f"Error processing overall data: {str(e)}")
                
            try:
                transaction_df = pd.DataFrame(transaction_data) if transaction_data else pd.DataFrame()
                if not transaction_df.empty:
                    logger.info(f"Transaction columns: {transaction_df.columns.tolist()}")
                    if 'revenue' in transaction_df.columns:
                        transaction_df['revenue'] = pd.to_numeric(transaction_df['revenue'], errors='coerce')
            except Exception as e:
                raise ValueError(f"Error processing transaction data: {str(e)}")
            
            # Identifier le contrôle et les variations
            variations = overall_df['variation'].unique()
            # Modification ici pour une meilleure détection du contrôle
            control_variations = [v for v in variations if 'control' in v.lower()]
            if not control_variations:
                raise ValueError("No control variation found")
            control_variation = control_variations[0]
            logger.info(f"Control variation identified: {control_variation}")
            
            # Métriques à analyser avec leur source
            metrics = {
                'users': {
                    'type': 'normal',
                    'column': 'users',
                    'source': 'overall'
                },
                'sessions': {
                    'type': 'normal',
                    'column': 'sessions',
                    'source': 'overall'
                },
                'conversion': {
                    'type': 'normal',
                    'column': 'user_add_to_carts',
                    'source': 'overall'
                },
                'revenue': {
                    'type': 'revenue',
                    'column': 'revenue',
                    'source': 'transaction'
                }
            }
            
            results = {}
            
            # Traiter chaque variation sauf le contrôle
            for variation in variations:
                if variation == control_variation:
                    continue
                    
                variation_metrics = {}
                
                for metric_name, metric_info in metrics.items():
                    source_df = transaction_df if metric_info['source'] == 'transaction' else overall_df
                    
                    if source_df.empty and metric_info['source'] == 'transaction':
                        continue
                    
                    # Filtrer les données pour le contrôle et la variation
                    control_mask = (source_df['variation'] == control_variation)
                    variation_mask = (source_df['variation'] == variation)
                    
                    control_data = source_df[control_mask][metric_info['column']].values
                    variation_data = source_df[variation_mask][metric_info['column']].values
                    
                    if len(control_data) == 0 or len(variation_data) == 0:
                        logger.warning(f"No data for {metric_name} in variation {variation}")
                        continue
                    
                    uplift, confidence = self.calculate_uplift_and_confidence(
                        control_data,
                        variation_data,
                        metric_info['type']
                    )
                    
                    variation_metrics[metric_name] = {
                        'uplift': uplift,
                        'confidence': confidence,
                        'value': float(np.mean(variation_data)),
                        'control_value': float(np.mean(control_data))
                    }
                
                results[variation] = variation_metrics
            
            logger.info(f"Results calculated successfully: {results}")
            return {
                'success': True,
                'data': results,
                'control': control_variation
            }
            
        except Exception as e:
            logger.error(f"Error calculating overview metrics: {str(e)}", exc_info=True)
            return {
                'success': False,
                'error': str(e)
            }