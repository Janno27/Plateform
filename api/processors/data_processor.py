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
        try:
            overall_df = pd.DataFrame(data.get('overall', []))
            transaction_df = pd.DataFrame(data.get('transaction', []))
            
            if overall_df.empty:
                raise ValueError("Overall data is required")

            # Conversion des colonnes numériques
            overall_df['users'] = pd.to_numeric(overall_df['users'], errors='coerce')
            overall_df['user_add_to_carts'] = pd.to_numeric(overall_df['user_add_to_carts'], errors='coerce')
            
            if not transaction_df.empty:
                transaction_df['revenue'] = pd.to_numeric(transaction_df['revenue'], errors='coerce')
            
            # Identifier le contrôle
            control_mask = overall_df['variation'].str.contains('control', case=False, na=False)
            if not control_mask.any():
                raise ValueError("No control variation found")
            control_variation = overall_df[control_mask]['variation'].iloc[0]

            results = {}
            variations = overall_df['variation'].unique()

            for variation in variations:
                if variation == control_variation:
                    continue

                metrics = {}

                # Données de la variation et du contrôle
                var_overall = overall_df[overall_df['variation'] == variation]
                ctrl_overall = overall_df[overall_df['variation'] == control_variation]
                var_transactions = transaction_df[transaction_df['variation'] == variation]
                ctrl_transactions = transaction_df[transaction_df['variation'] == control_variation]

                # 1. Users
                var_users = float(var_overall['users'].iloc[0])
                ctrl_users = float(ctrl_overall['users'].iloc[0])
                users_uplift = ((var_users - ctrl_users) / ctrl_users) * 100 if ctrl_users > 0 else 0
                # Calcul de la confiance pour users
                _, users_confidence = stats.ttest_ind(
                    [var_users], [ctrl_users],
                    equal_var=False
                )
                users_confidence = (1 - users_confidence) * 100 if not np.isnan(users_confidence) else 0

                # 2. Add to Cart Rate
                var_atc = float(var_overall['user_add_to_carts'].iloc[0])
                ctrl_atc = float(ctrl_overall['user_add_to_carts'].iloc[0])
                var_atc_rate = (var_atc / var_users) * 100 if var_users > 0 else 0
                ctrl_atc_rate = (ctrl_atc / ctrl_users) * 100 if ctrl_users > 0 else 0
                atc_uplift = ((var_atc_rate - ctrl_atc_rate) / ctrl_atc_rate) * 100 if ctrl_atc_rate > 0 else 0
                # Calcul de la confiance pour Add to Cart
                ctrl_atc_dist = np.repeat([0, 1], [ctrl_users - ctrl_atc, ctrl_atc])
                var_atc_dist = np.repeat([0, 1], [var_users - var_atc, var_atc])
                _, atc_confidence = stats.fisher_exact([
                    [ctrl_atc, ctrl_users - ctrl_atc],
                    [var_atc, var_users - var_atc]
                ])
                atc_confidence = (1 - atc_confidence) * 100

                # 3. Transaction Rate
                var_trans_count = len(var_transactions['transaction_id'].unique())
                ctrl_trans_count = len(ctrl_transactions['transaction_id'].unique())
                var_trans_rate = (var_trans_count / var_users) * 100 if var_users > 0 else 0
                ctrl_trans_rate = (ctrl_trans_count / ctrl_users) * 100 if ctrl_users > 0 else 0
                trans_uplift = ((var_trans_rate - ctrl_trans_rate) / ctrl_trans_rate) * 100 if ctrl_trans_rate > 0 else 0
                # Calcul de la confiance pour Transaction Rate
                _, trans_confidence = stats.fisher_exact([
                    [ctrl_trans_count, ctrl_users - ctrl_trans_count],
                    [var_trans_count, var_users - var_trans_count]
                ])
                trans_confidence = (1 - trans_confidence) * 100

                # 4. Revenue
                var_revenue = float(var_transactions['revenue'].sum())
                ctrl_revenue = float(ctrl_transactions['revenue'].sum())
                revenue_uplift = ((var_revenue - ctrl_revenue) / ctrl_revenue) * 100 if ctrl_revenue > 0 else 0
                # Calcul de la confiance pour Revenue avec Mann-Whitney
                var_revenues = var_transactions['revenue'].values
                ctrl_revenues = ctrl_transactions['revenue'].values
                if len(var_revenues) > 0 and len(ctrl_revenues) > 0:
                    _, revenue_confidence = stats.mannwhitneyu(
                        var_revenues,
                        ctrl_revenues,
                        alternative='two-sided'
                    )
                    revenue_confidence = (1 - revenue_confidence) * 100
                else:
                    revenue_confidence = 0

                # Stocker les résultats avec les confiances
                metrics['users'] = {
                    'value': var_users,
                    'control_value': ctrl_users,
                    'uplift': round(users_uplift, 2),
                    'confidence': round(users_confidence, 2)
                }
                
                metrics['add_to_cart_rate'] = {
                    'value': round(var_atc_rate, 2),
                    'control_value': round(ctrl_atc_rate, 2),
                    'uplift': round(atc_uplift, 2),
                    'confidence': round(atc_confidence, 2)
                }
                
                metrics['transaction_rate'] = {
                    'value': round(var_trans_rate, 2),
                    'control_value': round(ctrl_trans_rate, 2),
                    'uplift': round(trans_uplift, 2),
                    'confidence': round(trans_confidence, 2)
                }
                
                metrics['revenue'] = {
                    'value': round(var_revenue, 2),
                    'control_value': round(ctrl_revenue, 2),
                    'uplift': round(revenue_uplift, 2),
                    'confidence': round(revenue_confidence, 2)
                }

                results[variation] = metrics

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

    def calculate_confidence(self, control_data: np.array, variation_data: np.array, metric_type: str = 'normal') -> float:
        """
        Calcule le niveau de confiance statistique.
        
        Args:
            control_data: Données du groupe contrôle
            variation_data: Données de la variation
            metric_type: 'normal' pour test t, 'revenue' pour Mann-Whitney U
            
        Returns:
            float: Niveau de confiance en pourcentage
        """
        try:
            if len(control_data) < 2 or len(variation_data) < 2:
                return 0.0
            
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
            return round(confidence, 2)
            
        except Exception as e:
            logger.error(f"Error calculating confidence: {str(e)}")
            return 0.0