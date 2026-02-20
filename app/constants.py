# Standard Emission Factors (kg CO2e per unit)
# Sources based on approximate global/regional standards (IEA, IPCC)

EMISSION_FACTORS = {
    "energy": {
        "electricity": 0.475,  # kg per kWh
        "natural_gas": 1.93,   # kg per m3
        "heating_oil": 2.68,   # kg per liter
        "coal": 2.42           # kg per kg
    },
    "transportation": {
        "petrol_car": 0.17,    # kg per km
        "diesel_car": 0.171,   # kg per km
        "electric_car": 0.05,  # kg per km (depends on grid, low est)
        "flight_short": 0.15,  # kg per km
        "flight_long": 0.11,   # kg per km
        "bus": 0.089,          # kg per km
        "train": 0.035         # kg per km
    },
    "waste": {
        "general_waste": 0.45, # kg per kg
        "recycling": 0.021,    # kg per kg
        "compost": 0.10        # kg per kg
    }
}

SECTOR_RECOMMENDATIONS = {
    "energy": [
        "Switch to LED bulbs to reduce electricity consumption by up to 80%.",
        "Install a programmable thermostat to optimize heating and cooling.",
        "Consider installing solar panels to generate renewable energy.",
        "Improve home insulation to reduce heating and cooling loss."
    ],
    "transportation": [
        "Use public transport, bike, or walk for short trips.",
        "Consider switching to an electric vehicle for your next car.",
        "Practice eco-driving techniques (smooth acceleration, steady speed).",
        "Reduce air travel by choosing local vacation spots or using video calls."
    ],
    "waste": [
        "Compost organic waste to reduce methane emissions from landfills.",
        "Maximize recycling of paper, plastic, and metal.",
        "Avoid single-use plastics and opt for reusable alternatives.",
        "Reduce food waste through better meal planning."
    ]
}
