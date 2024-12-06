# data_processor.py

import pandas as pd
import numpy as np
from typing import Dict, Any, List, Union, Tuple, Optional
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
            numeric_columns = ['users', 'user_add_to_carts', 'user_purchases', 'revenue']
            for col in numeric_columns:
                if col in overall_df.columns:
                    overall_df[col] = pd.to_numeric(overall_df[col], errors='coerce')
            
            if not transaction_df.empty:
                transaction_df['revenue'] = pd.to_numeric(transaction_df['revenue'], errors='coerce')
            
            # Identifier le contrôle
            control_mask = overall_df['variation'].str.contains('control', case=False, na=False)
            if not control_mask.any():
                raise ValueError("No control variation found")
            control_variation = overall_df[control_mask]['variation'].iloc[0]

            # Récupérer les données du contrôle
            ctrl_overall = overall_df[overall_df['variation'] == control_variation].iloc[0]

            results = {}
            variations = overall_df['variation'].unique()

            for variation in variations:
                if variation == control_variation:
                    continue

                # Récupérer les données de la variation
                var_overall = overall_df[overall_df['variation'] == variation].iloc[0]
                metrics = {}

                # Users
                var_users = var_overall['users']
                ctrl_users = ctrl_overall['users']
                metrics['users'] = self._calculate_metric_stats(
                    var_users,
                    ctrl_users,
                    'users',
                    [var_users],
                    [ctrl_users]
                )

                # Add to Cart Rate
                var_atc = var_overall['user_add_to_carts']
                ctrl_atc = ctrl_overall['user_add_to_carts']
                var_atc_rate = (var_atc / var_users) * 100
                ctrl_atc_rate = (ctrl_atc / ctrl_users) * 100
                
                metrics['add_to_cart_rate'] = self._calculate_metric_stats(
                    var_atc_rate,
                    ctrl_atc_rate,
                    'rate',
                    [var_atc, var_users],
                    [ctrl_atc, ctrl_users]
                )

                # Transaction Rate
                var_trans = var_overall['user_purchases']
                ctrl_trans = ctrl_overall['user_purchases']
                var_trans_rate = (var_trans / var_users) * 100
                ctrl_trans_rate = (ctrl_trans / ctrl_users) * 100
                
                metrics['transaction_rate'] = self._calculate_metric_stats(
                    var_trans_rate,
                    ctrl_trans_rate,
                    'rate',
                    [var_trans, var_users],
                    [ctrl_trans, ctrl_users]
                )

                # Revenue
                var_revenue = var_overall['revenue']
                ctrl_revenue = ctrl_overall['revenue']
                
                # Pour le revenue, utiliser les données de transaction pour l'intervalle de confiance
                var_trans_revenue = transaction_df[transaction_df['variation'] == variation]['revenue'].values
                ctrl_trans_revenue = transaction_df[transaction_df['variation'] == control_variation]['revenue'].values
                
                metrics['revenue'] = self._calculate_metric_stats(
                    var_revenue,
                    ctrl_revenue,
                    'revenue',
                    var_trans_revenue,
                    ctrl_trans_revenue
                )

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

    def calculate_revenue_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calcule les métriques de revenu avec optimisation des performances."""
        try:
            # 1. Préparation efficace des DataFrames
            dtypes = {
                'users': 'float64',
                'revenue': 'float64',
                'quantity': 'float64',
                'user_add_to_carts': 'float64',
                'user_begin_checkouts': 'float64',
                'user_purchases': 'float64',
                'purchases': 'float64',
                'sessions': 'float64',
            }

            # Convertir directement les données avec les types appropriés
            overall_df = pd.DataFrame(data.get('overall', []))
            transaction_df = pd.DataFrame(data.get('transaction', []))

            # 2. Conversion optimisée des types
            for col in overall_df.columns:
                if col in dtypes:
                    overall_df[col] = pd.to_numeric(overall_df[col], errors='coerce')

            for col in transaction_df.columns:
                if col in dtypes:
                    transaction_df[col] = pd.to_numeric(transaction_df[col], errors='coerce')

            # 3. Vérification rapide des données requises
            if overall_df.empty or transaction_df.empty:
                raise ValueError("Both overall and transaction data are required")

            # 4. Identification optimisée du contrôle
            control_variation = overall_df[
                overall_df['variation'].str.contains('control', case=False, na=False)
            ]['variation'].iloc[0]

            # 5. Pré-calcul des métriques communes
            transaction_metrics = (transaction_df.groupby('variation')
                .agg({
                    'transaction_id': 'nunique',
                    'revenue': 'sum',
                    'quantity': 'sum'
                })
                .rename(columns={
                    'transaction_id': 'transactions',
                    'revenue': 'total_revenue',
                    'quantity': 'total_quantity'
                }))

            # 6. Traitement par variation avec calculs vectorisés
            results = {}
            variations = overall_df['variation'].unique()
            
            # Traiter d'abord le contrôle
            control_metrics = {}
            ctrl_overall = overall_df[overall_df['variation'] == control_variation].iloc[0]
            ctrl_metrics = transaction_metrics.loc[control_variation]
            ctrl_trans = transaction_df[transaction_df['variation'] == control_variation]

            # Calculer les métriques pour le contrôle
            for metric_key, calc_func in self._get_metric_calculators().items():
                control_metrics[metric_key] = calc_func(
                    ctrl_overall, ctrl_metrics, ctrl_trans,
                    ctrl_overall, ctrl_metrics, ctrl_trans  # Mêmes données pour le contrôle
                )

            results[control_variation] = control_metrics
            
            # Puis traiter toutes les autres variations
            for variation in variations:
                if variation == control_variation:
                    continue

                var_metrics = {}
                var_overall = overall_df[overall_df['variation'] == variation].iloc[0]
                var_trans_metrics = transaction_metrics.loc[variation]
                var_trans = transaction_df[transaction_df['variation'] == variation]

                # Calculer toutes les métriques pour cette variation
                for metric_key, calc_func in self._get_metric_calculators().items():
                    var_metrics[metric_key] = calc_func(
                        var_overall, var_trans_metrics, var_trans,
                        ctrl_overall, ctrl_metrics, ctrl_trans
                    )

                results[variation] = var_metrics

            return {
                'success': True,
                'data': results,
                'control': control_variation
            }

        except Exception as e:
            logger.error(f"Error calculating revenue metrics: {str(e)}", exc_info=True)
            return {
                'success': False,
                'error': str(e)
            }

    def _get_metric_calculators(self):
        """Retourne un dictionnaire des fonctions de calcul pour chaque métrique."""
        return {
            'users': self._calculate_users_metric,
            'transaction_rate': self._calculate_transaction_rate,
            'aov': self._calculate_aov,
            'avg_products': self._calculate_avg_products,
            'total_revenue': self._calculate_total_revenue,
            'arpu': self._calculate_arpu
        }

    def _calculate_confidence_interval(
        self,
        var_data: np.ndarray,
        ctrl_data: np.ndarray,
        metric_type: str,
        confidence_level: float = 0.95
    ) -> Tuple[float, float]:
        """Calcule l'intervalle de confiance pour une métrique donnée."""
        try:
            if metric_type == 'rate':
                # Pour les taux, utiliser la méthode de Wilson
                var_success = var_data[0]
                var_total = var_data[1]
                ctrl_success = ctrl_data[0]
                ctrl_total = ctrl_data[1]
                
                var_rate = var_success / var_total if var_total > 0 else 0
                ctrl_rate = ctrl_success / ctrl_total if ctrl_total > 0 else 0
                
                # Calcul de l'erreur standard
                var_se = np.sqrt((var_rate * (1 - var_rate)) / var_total) if var_total > 0 else 0
                ctrl_se = np.sqrt((ctrl_rate * (1 - ctrl_rate)) / ctrl_total) if ctrl_total > 0 else 0
                
                # Erreur standard de la différence
                se_diff = np.sqrt(var_se**2 + ctrl_se**2)
                
                # Calcul de l'intervalle
                z_score = stats.norm.ppf((1 + confidence_level) / 2)
                diff = var_rate - ctrl_rate
                margin = z_score * se_diff
                
                return (diff - margin) * 100, (diff + margin) * 100
                
            elif metric_type in ['revenue', 'average']:
                # Pour les métriques continues, utiliser bootstrap
                n_bootstrap = 10000
                diffs = []
                
                for _ in range(n_bootstrap):
                    var_sample = np.random.choice(var_data, size=len(var_data), replace=True)
                    ctrl_sample = np.random.choice(ctrl_data, size=len(ctrl_data), replace=True)
                    diff = np.mean(var_sample) - np.mean(ctrl_sample)
                    diffs.append(diff)
                
                lower_percentile = ((1 - confidence_level) / 2) * 100
                upper_percentile = (1 - (1 - confidence_level) / 2) * 100
                
                ci_lower = np.percentile(diffs, lower_percentile)
                ci_upper = np.percentile(diffs, upper_percentile)
                
                return (ci_lower / np.mean(ctrl_data) * 100, ci_upper / np.mean(ctrl_data) * 100)
                
            return 0.0, 0.0
            
        except Exception as e:
            logger.error(f"Error calculating confidence interval: {str(e)}")
            return 0.0, 0.0

    def _calculate_metric_stats(
        self,
        var_value: float,
        ctrl_value: float,
        metric_type: str,
        var_data: Optional[Union[List, np.ndarray]] = None,
        ctrl_data: Optional[Union[List, np.ndarray]] = None
    ) -> Dict[str, Any]:
        """Calcule les statistiques pour une métrique donnée."""
        try:
            # Vérification et nettoyage des données
            if var_data is not None:
                var_data = np.array(var_data, dtype=float)
                var_data = var_data[~np.isnan(var_data)]  # Supprime les NaN
                var_data = var_data[~np.isinf(var_data)]  # Supprime les infinis
            
            if ctrl_data is not None:
                ctrl_data = np.array(ctrl_data, dtype=float)
                ctrl_data = ctrl_data[~np.isnan(ctrl_data)]  # Supprime les NaN
                ctrl_data = ctrl_data[~np.isinf(ctrl_data)]  # Supprime les infinis

            # Calcul de l'uplift avec vérification
            uplift = ((var_value - ctrl_value) / ctrl_value * 100) if ctrl_value != 0 else 0
            
            # Calcul de la confiance selon le type de métrique
            confidence = 0
            
            if metric_type == 'rate' and var_data is not None and ctrl_data is not None:
                # Vérification des données pour le test de Fisher
                if len(var_data) >= 2 and len(ctrl_data) >= 2:
                    try:
                        contingency_table = [
                            [int(var_data[0]), int(var_data[1] - var_data[0])],
                            [int(ctrl_data[0]), int(ctrl_data[1] - ctrl_data[0])]
                        ]
                        if all(all(x >= 0 for x in row) for row in contingency_table):
                            _, confidence = stats.fisher_exact(contingency_table)
                            confidence = (1 - confidence) * 100
                    except Exception:
                        confidence = 0
                        
            elif metric_type in ['revenue', 'average'] and var_data is not None and ctrl_data is not None:
                # Vérification pour Mann-Whitney
                if len(var_data) > 0 and len(ctrl_data) > 0:
                    try:
                        # Suppression des valeurs nulles ou négatives pour les revenus
                        var_data = var_data[var_data > 0]
                        ctrl_data = ctrl_data[ctrl_data > 0]
                        
                        if len(var_data) > 0 and len(ctrl_data) > 0:
                            _, confidence = stats.mannwhitneyu(
                                var_data,
                                ctrl_data,
                                alternative='two-sided'
                            )
                            confidence = (1 - confidence) * 100
                    except Exception:
                        confidence = 0
                        
            elif metric_type == 'users' and var_data is not None and ctrl_data is not None:
                # Vérification pour t-test
                try:
                    if len(var_data) > 0 and len(ctrl_data) > 0:
                        _, confidence = stats.ttest_ind(
                            np.array([float(var_value)]),
                            np.array([float(ctrl_value)]),
                            equal_var=False
                        )
                        confidence = (1 - confidence) * 100 if not np.isnan(confidence) else 0
                except Exception:
                    confidence = 0

            # Calcul de l'intervalle de confiance avec vérification
            confidence_interval = {'lower': 0.0, 'upper': 0.0}
            if var_data is not None and ctrl_data is not None:
                if len(var_data) > 0 and len(ctrl_data) > 0:
                    ci_lower, ci_upper = self._calculate_confidence_interval(
                        var_data,
                        ctrl_data,
                        metric_type
                    )
                    confidence_interval = {
                        'lower': round(ci_lower, 2),
                        'upper': round(ci_upper, 2)
                    }

            return {
                'value': round(float(var_value), 2),
                'control_value': round(float(ctrl_value), 2),
                'uplift': round(float(uplift), 2),
                'confidence': round(float(confidence), 2),
                'confidence_interval': confidence_interval
            }
            
        except Exception as e:
            logger.error(f"Error in _calculate_metric_stats: {str(e)}")
            return {
                'value': round(float(var_value), 2),
                'control_value': round(float(ctrl_value), 2),
                'uplift': 0,
                'confidence': 0,
                'confidence_interval': {'lower': 0.0, 'upper': 0.0}
            }

    def _calculate_users_metric(self, var_overall, var_metrics, var_trans, ctrl_overall, ctrl_metrics, ctrl_trans):
        """Calcule les statistiques pour la métrique Users."""
        return self._calculate_metric_stats(
            var_overall['users'],
            ctrl_overall['users'],
            'users',
            [var_overall['users']],
            [ctrl_overall['users']]
        )

    def _calculate_transaction_rate(self, var_overall, var_metrics, var_trans, ctrl_overall, ctrl_metrics, ctrl_trans):
        """Calcule les statistiques pour le taux de transaction."""
        var_trans_rate = (var_metrics['transactions'] / var_overall['users']) * 100
        ctrl_trans_rate = (ctrl_metrics['transactions'] / ctrl_overall['users']) * 100
        
        return self._calculate_metric_stats(
            var_trans_rate,
            ctrl_trans_rate,
            'rate',
            [var_metrics['transactions'], var_overall['users']],
            [ctrl_metrics['transactions'], ctrl_overall['users']]
        )

    def _calculate_aov(self, var_overall, var_metrics, var_trans, ctrl_overall, ctrl_metrics, ctrl_trans):
        """Calcule les statistiques pour l'AOV (Average Order Value)."""
        var_aov = var_metrics['total_revenue'] / var_metrics['transactions']
        ctrl_aov = ctrl_metrics['total_revenue'] / ctrl_metrics['transactions']
        
        return self._calculate_metric_stats(
            var_aov,
            ctrl_aov,
            'revenue',
            var_trans['revenue'].values,
            ctrl_trans['revenue'].values
        )

    def _calculate_avg_products(self, var_overall, var_metrics, var_trans, ctrl_overall, ctrl_metrics, ctrl_trans):
        """Calcule les statistiques pour la moyenne des produits par commande."""
        var_avg_products = var_metrics['total_quantity'] / var_metrics['transactions']
        ctrl_avg_products = ctrl_metrics['total_quantity'] / ctrl_metrics['transactions']
        
        return self._calculate_metric_stats(
            var_avg_products,
            ctrl_avg_products,
            'average',
            var_trans['quantity'].values,
            ctrl_trans['quantity'].values
        )

    def _calculate_total_revenue(self, var_overall, var_metrics, var_trans, ctrl_overall, ctrl_metrics, ctrl_trans):
        """Calcule les statistiques pour le revenu total."""
        return self._calculate_metric_stats(
            var_metrics['total_revenue'],
            ctrl_metrics['total_revenue'],
            'revenue',
            var_trans['revenue'].values,
            ctrl_trans['revenue'].values
        )

    def _calculate_arpu(self, var_overall, var_metrics, var_trans, ctrl_overall, ctrl_metrics, ctrl_trans):
        """Calcule les statistiques pour l'ARPU (Average Revenue Per User)."""
        var_arpu = var_metrics['total_revenue'] / var_overall['users']
        ctrl_arpu = ctrl_metrics['total_revenue'] / ctrl_overall['users']
        
        # Création des arrays pour ARPU
        var_arpu_array = np.repeat(var_metrics['total_revenue'] / var_overall['users'], var_overall['users'])
        ctrl_arpu_array = np.repeat(ctrl_metrics['total_revenue'] / ctrl_overall['users'], ctrl_overall['users'])
        
        return self._calculate_metric_stats(
            var_arpu,
            ctrl_arpu,
            'revenue',
            var_arpu_array,
            ctrl_arpu_array
        )