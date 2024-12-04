# data_processor.py

import pandas as pd
import numpy as np
from typing import Dict, Any, List, Union
import logging
import re
from decimal import Decimal

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

        # Grouper les transactions
        grouped = df.groupby('transaction_id').agg({
            # Colonnes à garder la première valeur
            'variation': 'first',
            'device_category': 'first',
            # Colonnes à concaténer (après suppression des doublons)
            'item_category2': lambda x: ' | '.join(sorted(set(str(i) for i in x if pd.notna(i)))),
            'item_name': lambda x: ' | '.join(sorted(set(str(i) for i in x if pd.notna(i)))),
            'item_bundle': lambda x: ' | '.join(sorted(set(str(i) for i in x if pd.notna(i)))),
            'item_name_simple': lambda x: ' | '.join(sorted(set(str(i) for i in x if pd.notna(i)))),
            # Colonnes numériques à sommer
            'quantity': 'sum',
            'revenue': 'sum'
        }).reset_index()

        # Nettoyage des valeurs numériques
        numeric_columns = ['quantity', 'revenue']
        for col in numeric_columns:
            if col in grouped.columns:
                grouped[col] = pd.to_numeric(grouped[col], errors='coerce').fillna(0).round(2)

        # Log des résultats pour debugging
        logger.info(f"Nombre d'enregistrements avant agrégation: {len(df)}")
        logger.info(f"Nombre d'enregistrements après agrégation: {len(grouped)}")
        
        # Pour le transaction_id 0012-9TUZ3B, afficher le résultat
        example = grouped[grouped['transaction_id'] == '0012-9TUZ3B']
        if not example.empty:
            logger.info("Exemple d'agrégation pour 0012-9TUZ3B:")
            logger.info(example.to_dict('records')[0])

        return grouped.to_dict('records')

    except Exception as e:
        logger.error(f"Erreur lors de l'agrégation des transactions: {str(e)}", exc_info=True)
        raise