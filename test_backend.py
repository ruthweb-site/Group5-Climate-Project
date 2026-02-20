import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_calculation():
    payload = {
        "category": "energy",
        "type": "electricity",
        "value": 100
    }
    response = requests.post(f"{BASE_URL}/calculate", json=payload)
    print(f"Calculation Test: {response.json()}")
    assert response.status_code == 200
    assert "co2e" in response.json()

def test_ai_forecast():
    current_net = 35.5
    logs = [
        {"co2e": 40.0, "timestamp": "2024-01-01T00:00:00Z"},
        {"co2e": 38.0, "timestamp": "2024-01-02T00:00:00Z"}
    ]
    response = requests.post(f"{BASE_URL}/ai/forecast?current_net={current_net}", json=logs)
    print(f"AI Forecast Test: {response.json()}")
    assert response.status_code == 200
    assert "projection_2030" in response.json()

def test_ai_advise():
    payload = {
        "sources": {"energy": 15.8, "transport": 7.3},
        "sinks": {"forest": 3.1, "ocean": 2.5}
    }
    response = requests.post(f"{BASE_URL}/ai/advise", json=payload)
    print(f"AI Advice Test: {response.json()}")
    assert response.status_code == 200
    assert "ai_summary" in response.json()

if __name__ == "__main__":
    try:
        test_calculation()
        test_ai_forecast()
        test_ai_advise()
        print("\nAll backend AI and core tests passed successfully!")
    except Exception as e:
        print(f"\nTests failed: {e}")
        import traceback
        traceback.print_exc()
