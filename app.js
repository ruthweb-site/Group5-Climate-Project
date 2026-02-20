// ==========================================
// ThermoCity Scientific Logic & UI Core
// ==========================================

// Constants for IPCC AR6 TCRE-based model
const TCRE = 0.45;           // °C per 1000 Gt CO₂
const CURRENT_WARMING = 1.1;  // °C above pre-industrial (2024)
const YEAR_NOW = 2024;
const YEAR_END = 2100;
const YEARS_SPAN = YEAR_END - YEAR_NOW;

// Baseline emissions (Gt CO₂e/yr) - approximations from IPCC 2022
const sourceBaseline = {
    energy: 15.83,
    transport: 7.26,
    industry: 5.89,
    buildings: 2.94,
    agriculture: 5.66,
    waste: 1.58
};

const sinkBaseline = {
    forest: 3.1,
    ocean: 2.5,
    ccs: 0.04,
    dac: 0.01
};

// Application State
let chart = null;
let currentSliderValues = {
    // Sources (%)
    energy: 100, transport: 100, industry: 100,
    buildings: 100, agriculture: 100, waste: 100,
    // Sinks (%)
    forest: 100, ocean: 100, ccs: 100, dac: 100
};

// UI Elements
const loggerModal = document.getElementById('logger-modal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    setupEventHandlers();
    updateScience();
    initLogger(); // legacy feature
});

function initChart() {
    const years = [2024, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];
    const ctx = document.getElementById('tempChart').getContext('2d');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Projected Temperature (°C)',
                    data: years.map(() => CURRENT_WARMING),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                },
                {
                    label: '1.5°C Paris Target',
                    data: years.map(() => 1.5),
                    borderColor: '#f59e0b',
                    borderWidth: 2,
                    borderDash: [8, 4],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#64748b' } }
            },
            scales: {
                y: {
                    title: { display: true, text: 'Temperature Change (°C)' },
                    suggestedMin: 0,
                    suggestedMax: 4.5
                }
            }
        }
    });
}

function setupEventHandlers() {
    // Sliders
    const allSliders = [
        'energy', 'transport', 'industry', 'buildings', 'agriculture', 'waste',
        'forest', 'ocean', 'ccs', 'dac'
    ];

    allSliders.forEach(id => {
        const slider = document.getElementById(id + '-slider');
        slider.addEventListener('input', (e) => {
            currentSliderValues[id] = parseFloat(e.target.value);
            document.getElementById(id + '-pct').textContent = e.target.value + '%';
            updateScience();
        });
    });

    // Buttons
    document.getElementById('resetBtn').addEventListener('click', () => {
        allSliders.forEach(id => {
            const slider = document.getElementById(id + '-slider');
            slider.value = 100;
            currentSliderValues[id] = 100;
            document.getElementById(id + '-pct').textContent = '100%';
        });
        updateScience();
    });

    document.getElementById('maxGreenBtn').addEventListener('click', () => {
        const sources = ['energy', 'transport', 'industry', 'buildings', 'agriculture', 'waste'];
        const sinks = ['forest', 'ocean', 'ccs', 'dac'];

        sources.forEach(id => {
            const slider = document.getElementById(id + '-slider');
            slider.value = 0;
            currentSliderValues[id] = 0;
            document.getElementById(id + '-pct').textContent = '0%';
        });

        sinks.forEach(id => {
            const slider = document.getElementById(id + '-slider');
            slider.value = slider.max;
            currentSliderValues[id] = parseFloat(slider.max);
            document.getElementById(id + '-pct').textContent = slider.max + '%';
        });

        updateScience();
    });

    // AI Advisor Handler
    document.getElementById('getAiAdviceBtn').addEventListener('click', async () => {
        const statusEl = document.getElementById('ai-status');
        const suggestionsEl = document.getElementById('ai-suggestions');

        statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI is calculating optimal pathways...';

        try {
            // Calculate current sources/sinks for advisor
            const sources = {};
            ['energy', 'transport', 'industry', 'buildings', 'agriculture', 'waste'].forEach(id => {
                sources[id] = sourceBaseline[id] * (currentSliderValues[id] / 100);
            });
            const sinks = {};
            ['forest', 'ocean', 'ccs', 'dac'].forEach(id => {
                sinks[id] = sinkBaseline[id] * (currentSliderValues[id] / 100);
            });

            const response = await fetch('/api/ai/advise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sources, sinks })
            });

            const advice = await response.json();

            statusEl.textContent = advice.ai_summary;
            suggestionsEl.innerHTML = advice.recommendations.map(rec => `
                <div style="background: white; padding: 0.75rem; border-radius: 8px; border-left: 4px solid #059669; font-size: 0.8rem;">
                    <strong>[${rec.sector}] ${rec.action}</strong><br>
                    <span style="color: #64748b;">${rec.suggestion}</span>
                </div>
            `).join('');

        } catch (err) {
            statusEl.textContent = "AI Assistant offline. Ensure backend is running.";
            console.error(err);
        }
    });

    // Modal
    document.getElementById('logActivityBtn').addEventListener('click', () => loggerModal.style.display = 'flex');
    document.getElementById('closeLogger').addEventListener('click', () => loggerModal.style.display = 'none');
}

function updateScience() {
    let grossEmissions = 0;
    let totalRemoval = 0;

    // Calculate Source Totals
    ['energy', 'transport', 'industry', 'buildings', 'agriculture', 'waste'].forEach(id => {
        const val = sourceBaseline[id] * (currentSliderValues[id] / 100);
        grossEmissions += val;
        document.getElementById(id + '-emission').textContent = val.toFixed(1) + ' Gt';
    });

    // Calculate Sink Totals
    ['forest', 'ocean', 'ccs', 'dac'].forEach(id => {
        const val = sinkBaseline[id] * (currentSliderValues[id] / 100);
        totalRemoval += val;
        document.getElementById(id + '-removal').textContent = '−' + val.toFixed(2) + ' Gt';
    });

    const netEmissions = grossEmissions - totalRemoval;
    const yearEndTemp = CURRENT_WARMING + ((netEmissions * YEARS_SPAN) * TCRE / 1000);

    // Update UI Cards
    document.getElementById('grossEmissions').textContent = grossEmissions.toFixed(1);
    document.getElementById('totalSinks').textContent = totalRemoval.toFixed(1);
    document.getElementById('tempChange').textContent = (yearEndTemp >= 0 ? '+' : '') + yearEndTemp.toFixed(2);

    // Update Card Borders/Status
    const tempCard = document.getElementById('tempCard');
    const tempStatus = document.getElementById('tempStatus');
    if (yearEndTemp <= 1.5) {
        tempCard.style.borderTopColor = '#10b981';
        tempStatus.textContent = "✅ Safe (1.5°C Goal)";
        tempStatus.className = "metric-status good";
    } else if (yearEndTemp <= 2.0) {
        tempCard.style.borderTopColor = '#f59e0b';
        tempStatus.textContent = "⚠️ Warning (Paris Limit)";
        tempStatus.className = "metric-status bad";
    } else {
        tempCard.style.borderTopColor = '#dc2626';
        tempStatus.textContent = "🔥 Dangerous level";
        tempStatus.className = "metric-status bad";
    }

    // Trigger AI Forecast overlay update (throttled)
    updateAiForecastOverlay(netEmissions);

    // Update Chart
    if (chart) {
        const years = [2024, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];
        const temps = years.map(yr => {
            const dt = yr - YEAR_NOW;
            return CURRENT_WARMING + ((netEmissions * dt) * TCRE / 1000);
        });
        chart.data.datasets[0].data = temps;

        // Color update
        const endTemp = temps[temps.length - 1];
        if (endTemp > 2) chart.data.datasets[0].borderColor = '#dc2626';
        else if (endTemp > 1.5) chart.data.datasets[0].borderColor = '#f59e0b';
        else chart.data.datasets[0].borderColor = '#10b981';

        chart.update('none');
    }
}

// ==========================================
// AI FORECASTING OVERLAY
// ==========================================
let forecastThrottle = null;

async function updateAiForecastOverlay(currentNet) {
    if (forecastThrottle) return;
    forecastThrottle = setTimeout(() => forecastThrottle = null, 5000); // 5s throttle

    try {
        const logs = JSON.parse(localStorage.getItem('calculationLogs') || '[]');
        if (logs.length < 2) return;

        const response = await fetch(`/api/ai/forecast?current_net=${currentNet}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logs)
        });

        const forecast = await response.json();

        // In a real app, we'd add another dataset to the chart
        // For now, we update the AI status with velocity
        const statusEl = document.getElementById('ai-status');
        if (forecast.velocity < 0) {
            statusEl.innerHTML += `<br><span style="color: #059669; font-weight: 700;">📉 AI Trend: Emissions dropping by ${Math.abs(forecast.velocity)} Gt per cycle.</span>`;
        } else if (forecast.velocity > 0) {
            statusEl.innerHTML += `<br><span style="color: #dc2626; font-weight: 700;">📈 AI Trend: Emissions rising. Urgent policy action needed!</span>`;
        }
    } catch (err) {
        console.error("Forecasting failed:", err);
    }
}

// ==========================================
// LEGACY INTEGRATION: Activity Logger (API)
// ==========================================
function initLogger() {
    const activityForm = document.getElementById('activity-form');
    const categorySelect = document.getElementById('category');
    const typeSelect = document.getElementById('type');

    const ACTIVITY_TYPES = {
        energy: ['electricity', 'natural_gas', 'heating_oil', 'coal'],
        transportation: ['petrol_car', 'diesel_car', 'electric_car', 'flight_short', 'flight_long', 'bus', 'train'],
        waste: ['general_waste', 'recycling', 'compost']
    };

    function updateOptions() {
        typeSelect.innerHTML = '';
        ACTIVITY_TYPES[categorySelect.value].forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type.replace('_', ' ').toUpperCase();
            typeSelect.appendChild(opt);
        });
    }

    categorySelect.onchange = updateOptions;
    updateOptions();

    activityForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            category: categorySelect.value,
            type: typeSelect.value,
            value: parseFloat(document.getElementById('value').value)
        };

        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            // Persist for AI Forecasting
            const logs = JSON.parse(localStorage.getItem('calculationLogs') || '[]');
            logs.push({ co2e: result.co2e, timestamp: new Date().toISOString() });
            localStorage.setItem('calculationLogs', JSON.stringify(logs.slice(-10))); // Keep last 10

            alert(`Logged! Impact: ${result.co2e} kg CO2e added to your footprint.`);
            loggerModal.style.display = 'none';
        } catch (err) {
            console.error(err);
            alert("API Connection failed. Ensure backend is running.");
        }
    };
}
