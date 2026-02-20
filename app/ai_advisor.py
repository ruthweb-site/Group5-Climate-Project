class AI_PolicyAdvisor:
    """
    Analyzes the "Emission Gap" and suggests optimized sectoral targets.
    """
    
    def get_advice(self, current_sources, current_sinks, target_temp=1.5):
        """
        Calculates required reductions to reach the target temperature.
        """
        gross = sum(current_sources.values())
        removals = sum(current_sinks.values())
        net = gross - removals
        
        # Heuristic-based logic for "AI" advice
        suggestions = []
        
        # Priority 1: Energy (Largest Source)
        if current_sources.get('energy', 0) > 5:
            suggestions.append({
                "sector": "Energy",
                "action": "Transition to Renewables",
                "impact": "High",
                "suggestion": "Reduce Energy emissions by an additional 20% to bridge the gap."
            })
            
        # Priority 2: Reforestation (Most Cost-Effective Sink)
        if current_sinks.get('forest', 0) < 10:
            suggestions.append({
                "sector": "Forests",
                "action": "Massive Reforestation",
                "impact": "Medium",
                "suggestion": "Increase Forest sink capacity to 4x baseline for nature-positive cooling."
            })

        # Priority 3: Industry
        if current_sources.get('industry', 0) > 3:
            suggestions.append({
                "sector": "Industry",
                "action": "Green Hydrogen / Carbon Capture",
                "impact": "Medium",
                "suggestion": "Decarbonize steel and cement through CCS deployment."
            })

        gap_status = "Critical" if net > 20 else "On Track" if net < 5 else "Moderate"
        
        return {
            "gap_status": gap_status,
            "target_equilibrium": f"{target_temp}°C",
            "recommendations": suggestions[:3],
            "ai_summary": f"To hit {target_temp}°C, current net emissions ({net:.1f} Gt) must drop below 5 Gt/year by 2050."
        }

ai_advisor = AI_PolicyAdvisor()
