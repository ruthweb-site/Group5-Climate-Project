from fastapi import APIRouter, HTTPException
from app.models import ActivityInput, CalculationResponse, SimulationInput, SimulationResponse
from app.constants import EMISSION_FACTORS, SECTOR_RECOMMENDATIONS
from app.ai_engine import ai_forecaster
from app.ai_advisor import ai_advisor

router = APIRouter()

@router.post("/calculate", response_model=CalculationResponse)
async def calculate_emissions(data: ActivityInput):
    # Get factor for the specific type within the category
    category_factors = EMISSION_FACTORS.get(data.category, {})
    factor = category_factors.get(data.type, 0)
    
    if factor == 0:
        raise HTTPException(status_code=400, detail="Invalid category or activity type")
    
    co2e = round(data.value * factor, 2)
    return CalculationResponse(co2e=co2e, unit="kg CO2e")

@router.get("/factors")
async def get_factors():
    return EMISSION_FACTORS

@router.get("/recommendations")
async def get_recommendations(sector: str):
    return SECTOR_RECOMMENDATIONS.get(sector.lower(), ["No specific recommendations for this sector."])

@router.post("/simulate", response_model=SimulationResponse)
async def simulate_reduction(data: SimulationInput):
    total_savings = 0
    # Dummy simulation logic using baseline approximations
    for sector, pct in data.reductions.items():
        baseline = 5000 # dummy baseline
        total_savings += baseline * (pct / 100)
    return SimulationResponse(potential_savings=round(total_savings, 2))

# AI Endpoints
@router.post("/ai/forecast")
async def get_ai_forecast(current_net: float, logs: list):
    """
    Returns AI-driven emission projections using Linear Regression.
    """
    return ai_forecaster.forecast_emissions(current_net, logs)

@router.post("/ai/advise")
async def get_ai_advice(sources: dict, sinks: dict):
    """
    Returns AI-optimized policy suggestions based on the emission gap.
    """
    return ai_advisor.get_advice(sources, sinks)
