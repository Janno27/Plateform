# main.py

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from api.processors.data_processor import DataProcessor
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Filter(BaseModel):
    device_category: List[str] = Field(default_factory=list)
    item_category2: List[str] = Field(default_factory=list)

class AnalysisRequest(BaseModel):
    overall_data: List[Dict[str, Any]] = Field(..., description="Données globales du test")
    transaction_data: List[Dict[str, Any]] = Field(default_factory=list, description="Données de transaction")
    currency: str = Field(..., description="Code de la devise")
    filters: Optional[Filter] = Field(default_factory=Filter)

    class Config:
        schema_extra = {
            "example": {
                "overall_data": [{"column1": "value1"}],
                "transaction_data": [{"column1": "value1"}],
                "currency": "EUR",
                "filters": {
                    "device_category": [],
                    "item_category2": []
                }
            }
        }

@app.post("/analyze")
async def analyze_data(request: AnalysisRequest):
    try:
        logger.info("Réception d'une demande d'analyse")
        logger.debug("Données reçues: %s", jsonable_encoder(request))
        
        if not request.overall_data:
            raise HTTPException(
                status_code=422,
                detail="Les données globales (overall_data) sont requises"
            )

        processor = DataProcessor()
        
        result = processor.process_data(
            request.overall_data,
            request.transaction_data
        )
        
        logger.info("Analyse terminée avec succès")
        return JSONResponse(content=jsonable_encoder(result))
        
    except Exception as e:
        logger.error(f"Erreur lors de l'analyse: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'analyse des données: {str(e)}"
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.exception_handler(422)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Erreur de validation des données",
            "errors": exc.errors() if hasattr(exc, 'errors') else str(exc)
        }
    )

@app.post("/aggregate-transactions")
async def aggregate_transactions(data: List[Dict[str, Any]]):
    try:
        logger.info(f"Réception de la demande d'agrégation avec {len(data)} enregistrements")

        # Validation des données
        if not data:
            raise HTTPException(
                status_code=400,
                detail="Aucune donnée fournie pour l'agrégation"
            )

        # Vérification des champs requis
        required_fields = ['transaction_id', 'item_category2']
        if not all(field in data[0] for field in required_fields):
            raise HTTPException(
                status_code=400,
                detail=f"Champs requis manquants. Requis: {required_fields}"
            )

        processor = DataProcessor()
        result = processor.aggregate_transactions(data)

        logger.info(f"Agrégation réussie. {len(result)} enregistrements agrégés")
        
        return {
            "success": True,
            "data": result,
            "meta": {
                "input_records": len(data),
                "output_records": len(result)
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de l'agrégation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'agrégation: {str(e)}"
        )

@app.post("/test-aggregation")
async def test_aggregation():
    """Route de test pour vérifier l'agrégation"""
    test_data = [
        {
            "transaction_id": "0012-9TUZ3B",
            "variation": "Control",
            "device_category": "mobile",
            "item_category2": "Beds",
            "item_name": "Product 1",
            "quantity": 1,
            "revenue": 100.0
        },
        {
            "transaction_id": "0012-9TUZ3B",
            "variation": "Control",
            "device_category": "mobile",
            "item_category2": "Pillows",
            "item_name": "Product 2",
            "quantity": 2,
            "revenue": 50.0
        }
    ]

    try:
        processor = DataProcessor()
        result = processor.aggregate_transactions(test_data)
        return {
            "success": True,
            "test_data": test_data,
            "result": result
        }
    except Exception as e:
        logger.error(f"Erreur lors du test d'agrégation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du test d'agrégation: {str(e)}"
        )

class OverviewRequest(BaseModel):
    overall: List[Dict[str, Any]]
    transaction: Optional[List[Dict[str, Any]]] = []

@app.post("/calculate-overview")
async def calculate_overview(data: OverviewRequest):
    try:
        logger.info("Received overview calculation request")
        logger.info(f"Overall data length: {len(data.overall)}")
        logger.info(f"Transaction data length: {len(data.transaction)}")
        
        # Log d'un échantillon des données
        if data.overall:
            logger.info(f"Sample overall data: {data.overall[0]}")
        if data.transaction:
            logger.info(f"Sample transaction data: {data.transaction[0]}")
        
        if not data.overall:
            raise HTTPException(
                status_code=400,
                detail="Overall data is required"
            )
        
        processor = DataProcessor()
        try:
            result = processor.calculate_overview_metrics({
                'overall': data.overall,
                'transaction': data.transaction
            })
            
            if result['success']:
                logger.info("Overview calculation successful")
                return result
            else:
                logger.error(f"Overview calculation failed: {result.get('error')}")
                raise HTTPException(
                    status_code=500,
                    detail=result.get('error', 'Unknown error occurred')
                )
                
        except Exception as e:
            logger.error(f"Processor error: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"Error processing data: {str(e)}"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in calculate_overview: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))