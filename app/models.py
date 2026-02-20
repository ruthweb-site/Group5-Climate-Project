from pydantic import BaseModel
from typing import Dict, List, Optional

class ActivityInput(BaseModel):
    category: str # energy, transportation, waste
    type: str     # electricity, petrol_car, etc.
    value: float  # kWh, km, kg, etc.

class CalculationResponse(BaseModel):
    unit: str
    co2e: float # Total kg CO2e

class SummaryResponse(BaseModel):
    total_emissions: float
    breakdown: Dict[str, float]
    recommendations: List[str]

class SimulationInput(BaseModel):
    reductions: Dict[str, float] # e.g. {"energy": 20, "transport": 10}

class SimulationResponse(BaseModel):
    potential_savings: float
