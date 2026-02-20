import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime

class AI_ForecastingEngine:
    """
    Simulated AI engine that uses Linear Regression to forecast 
    potential emission trends based on historical 'snapshots'.
    """
    
    def __init__(self):
        self.model = LinearRegression()

    def forecast_emissions(self, current_net_emissions, logs):
        """
        Predicts future emissions based on historical logging velocity.
        Accepts: 
          - current_net_emissions (float): The current simulation state.
          - logs (list): Array of historical calculation results.
        Returns:
          - Dict containing projected value for 2030, 2050.
        """
        # If no logs, assume baseline (no progress)
        if not logs or len(logs) < 2:
            return {
                "velocity": 0,
                "projection_2030": current_net_emissions,
                "projection_2050": current_net_emissions,
                "confidence": "Low (Insufficient Data)"
            }

        # Simplified feature extraction: [index, value]
        # In a real app, this would use timestamps and precise diffs
        X = np.array(range(len(logs))).reshape(-1, 1)
        y = np.array([log.get('co2e', 0) for log in logs])

        self.model.fit(X, y)
        
        # Calculate velocity (slope)
        velocity = self.model.coef_[0]
        
        # Projections (simplified extrapolation)
        # Assuming logs represent past 1 year of data
        proj_2030 = current_net_emissions + (velocity * 6)  # 6 units ahead
        proj_2050 = current_net_emissions + (velocity * 26) # 26 units ahead

        return {
            "velocity": round(float(velocity), 2),
            "projection_2030": round(float(max(0, proj_2030)), 2),
            "projection_2050": round(float(max(0, proj_2050)), 2),
            "confidence": "Medium (Trend Extrapolation)"
        }

ai_forecaster = AI_ForecastingEngine()
