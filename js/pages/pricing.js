// ============================================
// OPTISENSE AI — Dynamic Pricing Engine
// AI-powered demand-based pricing dashboard
// ============================================

import { pricingData, chartData, formatCurrency } from '../data/mock-data.js';
import { createLineChart, createBarChart, colors } from '../components/charts.js';

// Local state
let zonesState = [...pricingData.zones];
let alertsState = [...pricingData.alerts];
let isOptimizing = false;
let sensitivityMultiplier = 1.0;

// Zone color mapping
const zoneColors = {
  'Lot A': { color: colors.blue, fill: 'blue', border: 'var(--blue-500)', bg: 'var(--blue-50)' },
  'Lot B': { color: colors.green, fill: 'green', border: 'var(--green-500)', bg: 'var(--green-50)' },
  'Lot C': { color: colors.amber, fill: 'amber', border: 'var(--amber-500)', bg: 'var(--amber-50)' },
  'Lot D': { color: colors.purple, fill: 'purple', border: 'var(--purple-500)', bg: 'var(--purple-50)' },
};

function getDemandBadge(demand) {
  const map = {
    'Low': 'badge-green',
    'Moderate': 'badge-blue',
    'High': 'badge-amber',
    'Very High': 'badge-red',
  };
  return map[demand] || 'badge-slate';
}

function getAlertIcon(type) {
  const map = {
    'surge': { cls: 'alert', icon: '⚡' },
    'capacity': { cls: 'warning', icon: '📊' },
    'redirect': { cls: 'exit', icon: '🔀' },
    'forecast': { cls: 'info', icon: '📈' },
  };
  return map[type] || { cls: 'info', icon: 'ℹ️' };
}

function getOccupancyFillColor(occupancy) {
  if (occupancy >= 85) return 'red';
  if (occupancy >= 65) return 'amber';
  return 'green';
}

// Simulated Pricing Engine algorithm update
window.runPricingOptimization = function() {
  if (isOptimizing) return;
  isOptimizing = true;
  
  const btn = document.getElementById('run-optimizer-btn');
  if (btn) {
    btn.innerHTML = `<span class="status-dot blue" style="animation:pulse-glow 1s infinite"></span> Optimizing Pricing Rules...`;
    btn.disabled = true;
  }

  setTimeout(() => {
    // Modify current pricing based on sensitivity multiplier
    zonesState = zonesState.map(z => {
      const adjustment = Math.round((Math.random() * 5 + 2) * sensitivityMultiplier);
      const newPrice = Math.min(z.peakPrice, z.currentPrice + (Math.random() > 0.4 ? adjustment : -adjustment));
      return {
        ...z,
        currentPrice: Math.max(z.currentPrice - 5, newPrice)
      };
    });

    // Add a new alert entry to alerts queue
    const timestamp = 'Just now';
    alertsState.unshift({
      type: 'surge',
      message: `AI Optimizer updated tariffs: Lot B student base fee adjusted to ₹${zonesState[1].currentPrice}/hr`,
      time: timestamp
    });

    isOptimizing = false;
    alert('✓ AI Tariffs recalibration completed across all 4 zones. Dispatching new rates to campus signage displays.');
    
    // Re-render
    const container = document.getElementById('dashboard-content');
    renderPricing(container);
  }, 1200);
};

window.adjustSensitivity = function(val) {
  sensitivityMultiplier = parseFloat(val);
  const label = document.getElementById('sensitivity-label');
  if (label) label.textContent = `${val}x`;
};

// ---- Main Render ----

export function renderPricing(container) {
  const role = window.currentRole;

  if (role !== 'admin') {
    container.innerHTML = `
      <div style="background:white;border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:60px;text-align:center;max-width:500px;margin:40px auto">
        <span style="font-size:48px">🔒</span>
        <h2 style="font-weight:700;margin-top:16px">Access Restricted</h2>
        <p class="text-sm text-secondary" style="margin-top:8px">Your current profile (${role}) does not have permission to view or manage pricing engine parameters.</p>
      </div>
    `;
    return;
  }

  const { recommendation } = pricingData;

  container.innerHTML = `
    <!-- Page Header with Surge Alert -->
    <div class="page-header animate-fade-in-up" style="display:flex; align-items:flex-start; justify-content:space-between;">
      <div>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:4px;">
          <h1>Dynamic Pricing Engine</h1>
          <span class="surge-badge">
            <span style="display:inline-block; width:6px; height:6px; background:var(--red-500); border-radius:50%; animation: pulse-glow 1.5s ease-in-out infinite;"></span>
            SURGE ACTIVE
          </span>
        </div>
        <p>Real-time demand tariff recalibration & queue redirections</p>
      </div>
      <div>
        <button id="run-optimizer-btn" class="btn btn-primary" onclick="runPricingOptimization()">⚡ Run AI Price Optimization</button>
      </div>
    </div>

    <!-- Pricing parameters controls -->
    <div class="grid grid-3 gap-6" style="margin-bottom:var(--space-6)">
      <!-- Configuration Controls -->
      <div class="card-section" style="grid-column: span 1">
        <div class="card-section-header">
          <h3>Surge Sensitivities</h3>
        </div>
        <div class="card-section-body">
          <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:6px">DEMAND SENSITIVITY: <span id="sensitivity-label" class="font-semibold text-primary">${sensitivityMultiplier.toFixed(1)}x</span></label>
          <input type="range" min="0.5" max="2.0" step="0.1" value="${sensitivityMultiplier}" style="width:100%;margin-bottom:16px" oninput="adjustSensitivity(this.value)">
          <div style="font-size:11px;color:var(--text-tertiary);line-height:1.4">Adjusts how aggressively the pricing engine scales fees in response to congestion checks.</div>
        </div>
      </div>

      <!-- Recommendation card -->
      <div class="card animate-fade-in-up" style="grid-column: span 2; background:var(--blue-50); border-color:var(--blue-200); padding:var(--space-5) var(--space-6); display:flex; gap:var(--space-4); margin-bottom:0">
        <div style="width:40px; height:40px; border-radius:var(--radius-lg); background:var(--blue-100); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:20px;">
          💡
        </div>
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <h3 style="font-size:var(--text-base); font-weight:600; color:var(--blue-900);">Smart Routing Recommendation</h3>
            <span class="badge badge-blue" style="font-size:10px;">Active redirection</span>
          </div>
          <p style="font-size:var(--text-sm); color:var(--blue-800); line-height:1.5; margin-bottom:10px;">
            <strong>${recommendation.reason}.</strong>
            Routing student traffic to ${recommendation.to} (Visitor Overflow) saves <strong>${recommendation.timeSaved}</strong> and <strong>${formatCurrency(recommendation.savings)}/hr</strong>.
          </p>
          <div style="display:flex; gap:var(--space-3)">
            <button class="btn btn-primary btn-sm" onclick="alert('Digital signs updated. Student traffic redirected.')">Apply Signage Routing</button>
            <button class="btn btn-secondary btn-sm" onclick="alert('Dismissed recommendation')">Dismiss</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Zone Cards -->
    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:var(--space-4); margin-bottom:var(--space-6);" class="stagger">
      ${zonesState.map(z => {
        const zc = zoneColors[z.zone] || { color: '#000', border: '#ccc' };
        const fillColor = getOccupancyFillColor(z.occupancy);
        return `
        <div class="pricing-zone-card card-hover" style="border-top:3px solid ${zc.border};">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-3);">
            <div>
              <div style="font-weight:600; font-size:var(--text-base);">${z.zone}</div>
              <div style="font-size:var(--text-xs); color:var(--text-tertiary);">${z.label}</div>
            </div>
            <span class="badge ${getDemandBadge(z.demand)}">${z.demand}</span>
          </div>

          <div class="pricing-current">
            <span class="pricing-amount" style="color:${zc.color};">₹${z.currentPrice}</span>
            <span class="pricing-unit">/hr</span>
          </div>
          <div style="font-size:var(--text-xs); color:var(--text-tertiary); margin-top:2px;">
            Peak Cap: ₹${z.peakPrice}/hr &nbsp;·&nbsp; Forecast: ₹${z.forecastPrice}/hr
          </div>

          <div style="margin-top:var(--space-4);">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="font-size:var(--text-xs); color:var(--text-tertiary);">Occupancy</span>
              <span style="font-size:var(--text-xs); font-weight:600;">${z.occupancy}%</span>
            </div>
            <div class="progress-bar">
              <div class="fill ${fillColor}" style="width:${z.occupancy}%;"></div>
            </div>
          </div>

          <div style="margin-top:var(--space-4); display:flex; flex-direction:column; gap:6px;">
            <div style="display:flex; align-items:center; gap:6px; font-size:var(--text-xs);">
              <span style="color:var(--green-600);">↓</span>
              <span style="color:var(--text-secondary);">${z.discount}</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px; font-size:var(--text-xs);">
              <span style="color:var(--red-500);">↑</span>
              <span style="color:var(--text-secondary);">${z.surcharge}</span>
            </div>
          </div>
        </div>
        `;
      }).join('')}
    </div>

    <!-- Two Column: Charts -->
    <div class="dashboard-grid two-col" style="margin-bottom:var(--space-6);">
      <!-- Pricing Trends Chart -->
      <div class="card-section animate-fade-in-up">
        <div class="card-section-header">
          <h3>Pricing Trends (Today)</h3>
          <span style="font-size:var(--text-xs); color:var(--text-tertiary);">₹/hr across zones</span>
        </div>
        <div class="card-section-body">
          <div class="chart-container">
            <canvas id="pricing-trend-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- Revenue Forecast Chart -->
      <div class="card-section animate-fade-in-up">
        <div class="card-section-header">
          <h3>Weekly Revenue</h3>
          <span style="font-size:var(--text-xs); color:var(--text-tertiary);">This week · All zones</span>
        </div>
        <div class="card-section-body">
          <div class="chart-container">
            <canvas id="revenue-forecast-chart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Alerts Feed -->
    <div class="card-section animate-fade-in-up" style="margin-bottom:var(--space-6);">
      <div class="card-section-header">
        <h3>Tariff Engine Alerts History</h3>
        <span class="badge badge-red">${alertsState.length} alerts</span>
      </div>
      <div class="card-section-body no-pad">
        <div class="feed-list">
          ${alertsState.map(a => {
            const ai = getAlertIcon(a.type);
            return `
            <div class="feed-item">
              <div class="feed-icon ${ai.cls}">${ai.icon}</div>
              <div class="feed-content">
                <div class="feed-title">${a.message}</div>
                <div class="feed-desc">${a.type.charAt(0).toUpperCase() + a.type.slice(1)} event · Auto-managed by pricing engine</div>
              </div>
              <span class="feed-time">${a.time}</span>
            </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // ---- Initialize Charts ----
  setTimeout(() => {
    const pricingCanvas = container.querySelector('#pricing-trend-chart');
    if (pricingCanvas) {
      createLineChart(
        pricingCanvas,
        chartData.pricingTrend.labels,
        [
          {
            label: 'Lot A (Faculty)',
            data: chartData.pricingTrend.lotA,
            borderColor: colors.blue,
            backgroundColor: 'rgba(59, 130, 246, 0.02)',
            fill: true,
          },
          {
            label: 'Lot B (Student)',
            data: chartData.pricingTrend.lotB,
            borderColor: colors.green,
            backgroundColor: 'rgba(34, 197, 94, 0.02)',
            fill: true,
          },
          {
            label: 'Lot C (Visitor)',
            data: chartData.pricingTrend.lotC,
            borderColor: colors.amber,
            backgroundColor: 'rgba(245, 158, 11, 0.02)',
            fill: true,
          },
        ],
        {
          scales: {
            y: {
              ticks: { callback: (v) => '₹' + v }
            }
          }
        }
      );
    }

    const revenueCanvas = container.querySelector('#revenue-forecast-chart');
    if (revenueCanvas) {
      createBarChart(
        revenueCanvas,
        chartData.revenueWeekly.labels,
        [
          {
            label: 'Revenue',
            data: chartData.revenueWeekly.data,
            backgroundColor: '#3b82f6',
            borderRadius: 4,
            barThickness: 24,
          },
        ],
        {
          scales: {
            y: {
              ticks: { callback: (v) => '₹' + (v / 1000).toFixed(0) + 'K' }
            }
          }
        }
      );
    }
  }, 0);
}
