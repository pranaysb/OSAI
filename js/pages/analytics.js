// ============================================
// OPTISENSE AI — Analytics Dashboard
// Executive overview of infrastructure intelligence
// ============================================

import { analyticsKPIs, chartData } from '../data/mock-data.js';

// ---- Heatmap color helper ----
function heatmapColor(value) {
  if (value <= 15) return 'rgba(34, 197, 94, 0.25)';
  if (value <= 30) return 'rgba(34, 197, 94, 0.45)';
  if (value <= 45) return 'rgba(245, 158, 11, 0.30)';
  if (value <= 60) return 'rgba(245, 158, 11, 0.55)';
  if (value <= 75) return 'rgba(239, 68, 68, 0.40)';
  if (value <= 88) return 'rgba(239, 68, 68, 0.60)';
  return 'rgba(239, 68, 68, 0.80)';
}

function heatmapTextColor(value) {
  if (value <= 30) return '#15803d';
  if (value <= 60) return '#92400e';
  return '#991b1b';
}

// ---- KPI Card builder ----
function buildKPICard(kpi, index) {
  const goodDownLabels = ['Active Violations', 'Congestion Score', 'Unauthorized Entries'];
  const neutralLabels = ['Avg Dwell Time'];
  const isGoodDown = goodDownLabels.includes(kpi.label);
  const isNeutral = neutralLabels.includes(kpi.label);

  let changeClass;
  if (isNeutral) {
    changeClass = ''; 
  } else if (isGoodDown) {
    changeClass = kpi.trend === 'down' ? 'positive' : 'negative';
  } else {
    changeClass = kpi.trend === 'up' ? 'positive' : 'negative';
  }

  const arrow = kpi.trend === 'up' ? '▲' : '▼';

  return `
    <div class="stat-card animate-scale-in">
      <span class="stat-label">${kpi.label}</span>
      <span class="stat-value">${kpi.value}</span>
      <span class="stat-change ${changeClass}">
        ${arrow} ${kpi.change}
      </span>
    </div>
  `;
}

// ---- Congestion heatmap builder ----
function buildHeatmap() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];

  let headerCells = '<div style="width:44px;flex-shrink:0;"></div>';
  hours.forEach(h => {
    headerCells += `<div style="flex:1;text-align:center;font-size:11px;font-weight:500;color:var(--text-tertiary);padding:0 2px;">${h}</div>`;
  });

  let rows = '';
  days.forEach((day, ri) => {
    let cells = `<div style="width:44px;flex-shrink:0;font-size:12px;font-weight:600;color:var(--text-secondary);display:flex;align-items:center;">${day}</div>`;
    chartData.congestionHeatmap[ri].forEach((val, ci) => {
      cells += `
        <div style="
          flex:1;
          height:32px;
          background:${heatmapColor(val)};
          border-radius:4px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:10px;
          font-weight:600;
          color:${heatmapTextColor(val)};
          margin:1.5px;
          transition:all 0.15s ease;
          cursor:default;
        " title="${day} ${hours[ci]}: ${val}%">${val}</div>
      `;
    });
    rows += `<div style="display:flex;gap:0;align-items:center;">${cells}</div>`;
  });

  return `
    <div style="display:flex;gap:0;align-items:center;margin-bottom:8px;">${headerCells}</div>
    ${rows}
    <div style="display:flex;align-items:center;gap:16px;margin-top:16px;padding-top:12px;border-top:1px solid var(--border-subtle);">
      <span style="font-size:11px;font-weight:500;color:var(--text-tertiary);">Congestion Scale:</span>
      <div style="display:flex;align-items:center;gap:6px;">
        <div style="width:12px;height:12px;border-radius:2px;background:rgba(34,197,94,0.35);"></div>
        <span style="font-size:10px;color:var(--text-tertiary);">Low (0-30)</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <div style="width:12px;height:12px;border-radius:2px;background:rgba(245,158,11,0.5);"></div>
        <span style="font-size:10px;color:var(--text-tertiary);">Medium (31-60)</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <div style="width:12px;height:12px;border-radius:2px;background:rgba(239,68,68,0.6);"></div>
        <span style="font-size:10px;color:var(--text-tertiary);">High (61-100)</span>
      </div>
    </div>
  `;
}

// ---- Insight cards ----
function buildInsights() {
  const insights = [
    {
      icon: '📈',
      title: 'Peak Traffic Spike',
      desc: 'Peak traffic observed at 9AM with 312 vehicles/hour — highest this week.',
      bg: 'var(--blue-50)',
      border: 'var(--blue-200)',
    },
    {
      icon: '🅿️',
      title: 'Utilization Growth',
      desc: 'Parking utilization up 8% this week driven by Lot B demand surge.',
      bg: 'var(--green-50)',
      border: 'var(--green-400)',
    },
    {
      icon: '💰',
      title: 'Revenue Boost',
      desc: 'Revenue increased 18% due to surge pricing during placement week.',
      bg: 'var(--amber-50)',
      border: 'var(--amber-400)',
    },
    {
      icon: '⚠️',
      title: 'Security Improvement',
      desc: 'Unauthorized entries down 40% after enhanced ANPR deployment.',
      bg: 'var(--purple-50)',
      border: 'var(--purple-400)',
    },
  ];

  return insights.map(i => `
    <div style="
      flex:1;
      min-width:200px;
      padding:20px;
      background:${i.bg};
      border:1px solid ${i.border};
      border-radius:var(--radius-lg);
      transition:all 0.2s ease;
    ">
      <div style="font-size:24px;margin-bottom:8px;">${i.icon}</div>
      <div style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:4px;">${i.title}</div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.5;">${i.desc}</div>
    </div>
  `).join('');
}

// ---- Main render ----
export function renderAnalytics(container) {
  const role = window.currentRole;

  if (role !== 'admin') {
    container.innerHTML = `
      <div style="background:white;border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:60px;text-align:center;max-width:500px;margin:40px auto">
        <span style="font-size:48px">🔒</span>
        <h2 style="font-weight:700;margin-top:16px">Access Restricted</h2>
        <p class="text-sm text-secondary" style="margin-top:8px">Your current profile (${role}) does not have permission to view executive analytics dashboards.</p>
      </div>
    `;
    return;
  }

  const kpiRow1 = analyticsKPIs.slice(0, 4).map(buildKPICard).join('');
  const kpiRow2 = analyticsKPIs.slice(4, 8).map(buildKPICard).join('');

  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Executive overview of infrastructure intelligence metrics</p>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="live-pulse">LIVE</span>
          <div style="
            display:flex;
            align-items:center;
            gap:8px;
            padding:6px 14px;
            background:var(--bg-primary);
            border:1px solid var(--border-default);
            border-radius:var(--radius-md);
            font-size:12px;
            font-weight:500;
            color:var(--text-secondary);
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            May 17 – May 23, 2026
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Stats Row 1 -->
    <div class="stats-row stagger" style="margin-bottom:16px;">
      ${kpiRow1}
    </div>

    <!-- KPI Stats Row 2 -->
    <div class="stats-row stagger">
      ${kpiRow2}
    </div>

    <!-- Two-Column Charts -->
    <div class="dashboard-grid two-col animate-fade-in-up" style="margin-top:24px;">
      <div class="card-section">
        <div class="card-section-header">
          <h3>Vehicle Flow (Today)</h3>
          <span class="badge badge-blue">Hourly</span>
        </div>
        <div class="card-section-body">
          <div class="chart-container">
            <canvas id="analytics-vehicle-flow"></canvas>
          </div>
        </div>
      </div>
      <div class="card-section">
        <div class="card-section-header">
          <h3>Weekly Occupancy Trends</h3>
          <span class="badge badge-green">4 Lots</span>
        </div>
        <div class="card-section-body">
          <div class="chart-container">
            <canvas id="analytics-occupancy-trend"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Three-Column Charts -->
    <div class="dashboard-grid three-col animate-fade-in-up" style="margin-top:24px;">
      <div class="card-section">
        <div class="card-section-header">
          <h3>Weekly Revenue</h3>
          <span class="badge badge-blue">₹ INR</span>
        </div>
        <div class="card-section-body">
          <div class="chart-container">
            <canvas id="analytics-revenue-chart"></canvas>
          </div>
        </div>
      </div>
      <div class="card-section">
        <div class="card-section-header">
          <h3>Violations by Type</h3>
          <span class="badge badge-red">Stacked</span>
        </div>
        <div class="card-section-body">
          <div class="chart-container">
            <canvas id="analytics-violations-chart"></canvas>
          </div>
        </div>
      </div>
      <div class="card-section">
        <div class="card-section-header">
          <h3>Pricing Trends</h3>
          <span class="badge badge-amber">₹/hr</span>
        </div>
        <div class="card-section-body">
          <div class="chart-container">
            <canvas id="analytics-pricing-chart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Congestion Heatmap -->
    <div class="card-section animate-fade-in-up" style="margin-top:24px;">
      <div class="card-section-header">
        <h3>Weekly Congestion Heatmap</h3>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="badge badge-slate">6AM – 5PM</span>
        </div>
      </div>
      <div class="card-section-body">
        ${buildHeatmap()}
      </div>
    </div>

    <!-- Key Insights -->
    <div class="card-section animate-fade-in-up" style="margin-top:24px;">
      <div class="card-section-header">
        <h3>Key Insights</h3>
        <span class="badge badge-purple">AI Generated</span>
      </div>
      <div class="card-section-body">
        <div style="display:flex;gap:16px;flex-wrap:wrap;">
          ${buildInsights()}
        </div>
      </div>
    </div>
  `;

  // ---- Initialize all charts after DOM is ready ----
  setTimeout(() => {
    initVehicleFlowChart();
    initOccupancyTrendChart();
    initRevenueChart();
    initViolationsChart();
    initPricingChart();
  }, 0);
}

// ---- Chart Initializers ----

function initVehicleFlowChart() {
  const canvas = document.getElementById('analytics-vehicle-flow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Create gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.20)');
  gradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.05)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.00)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.vehiclesPerHour.labels,
      datasets: [{
        label: 'Vehicles',
        data: chartData.vehiclesPerHour.data,
        borderColor: '#3b82f6',
        backgroundColor: gradient,
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointHitRadius: 20,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: "'Inter', sans-serif", weight: '600', size: 12 },
          bodyFont: { family: "'Inter', sans-serif", size: 11 },
          padding: { x: 12, y: 8 },
          cornerRadius: 8,
          callbacks: {
            label: ctx => `${ctx.parsed.y} vehicles`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "'Inter', sans-serif", size: 11 }, color: '#94a3b8', padding: 8 },
          border: { display: false },
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          ticks: { font: { family: "'Inter', sans-serif", size: 11 }, color: '#94a3b8', padding: 12 },
          border: { display: false },
          beginAtZero: true,
        },
      },
    },
  });
}

function initOccupancyTrendChart() {
  const canvas = document.getElementById('analytics-occupancy-trend');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const datasetConfig = [
    { label: 'Lot A', data: chartData.occupancyTrend.lotA, color: '#3b82f6' },
    { label: 'Lot B', data: chartData.occupancyTrend.lotB, color: '#22c55e' },
    { label: 'Lot C', data: chartData.occupancyTrend.lotC, color: '#f59e0b' },
    { label: 'Lot D', data: chartData.occupancyTrend.lotD, color: '#a855f7' },
  ];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.occupancyTrend.labels,
      datasets: datasetConfig.map(d => ({
        label: d.label,
        data: d.data,
        borderColor: d.color,
        backgroundColor: d.color + '10',
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: d.color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointHitRadius: 20,
        fill: false,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            font: { family: "'Inter', sans-serif", size: 11 },
            color: '#64748b',
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
            boxWidth: 6,
            boxHeight: 6,
          },
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: "'Inter', sans-serif", weight: '600', size: 12 },
          bodyFont: { family: "'Inter', sans-serif", size: 11 },
          padding: { x: 12, y: 8 },
          cornerRadius: 8,
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "'Inter', sans-serif", size: 11 }, color: '#94a3b8', padding: 8 },
          border: { display: false },
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          ticks: {
            font: { family: "'Inter', sans-serif", size: 11 },
            color: '#94a3b8',
            padding: 12,
            callback: value => value + '%',
          },
          border: { display: false },
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

function initRevenueChart() {
  const canvas = document.getElementById('analytics-revenue-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.revenueWeekly.labels,
      datasets: [{
        label: 'Revenue',
        data: chartData.revenueWeekly.data,
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        hoverBackgroundColor: '#3b82f6',
        borderRadius: 4,
        borderSkipped: false,
        barThickness: 28,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: "'Inter', sans-serif", weight: '600', size: 12 },
          bodyFont: { family: "'Inter', sans-serif", size: 11 },
          padding: { x: 12, y: 8 },
          cornerRadius: 8,
          callbacks: {
            label: ctx => '₹' + ctx.parsed.y.toLocaleString('en-IN'),
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "'Inter', sans-serif", size: 11 }, color: '#94a3b8', padding: 8 },
          border: { display: false },
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          ticks: {
            font: { family: "'Inter', sans-serif", size: 11 },
            color: '#94a3b8',
            padding: 12,
            callback: value => '₹' + (value / 1000) + 'k',
          },
          border: { display: false },
          beginAtZero: true,
        },
      },
    },
  });
}

function initViolationsChart() {
  const canvas = document.getElementById('analytics-violations-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.violationsTrend.labels,
      datasets: [
        {
          label: 'Wrong Zone',
          data: chartData.violationsTrend.wrongZone,
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          hoverBackgroundColor: '#f59e0b',
          borderRadius: 2,
          borderSkipped: false,
        },
        {
          label: 'Overstay',
          data: chartData.violationsTrend.overstay,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          hoverBackgroundColor: '#ef4444',
          borderRadius: 2,
          borderSkipped: false,
        },
        {
          label: 'No Permit',
          data: chartData.violationsTrend.noPermit,
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          hoverBackgroundColor: '#a855f7',
          borderRadius: 2,
          borderSkipped: false,
        },
        {
          label: 'Expired',
          data: chartData.violationsTrend.expired,
          backgroundColor: 'rgba(100, 116, 139, 0.7)',
          hoverBackgroundColor: '#64748b',
          borderRadius: 2,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            font: { family: "'Inter', sans-serif", size: 10 },
            color: '#64748b',
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 12,
            boxWidth: 6,
            boxHeight: 6,
          },
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: "'Inter', sans-serif", weight: '600', size: 12 },
          bodyFont: { family: "'Inter', sans-serif", size: 11 },
          padding: { x: 12, y: 8 },
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { font: { family: "'Inter', sans-serif", size: 11 }, color: '#94a3b8', padding: 8 },
          border: { display: false },
        },
        y: {
          stacked: true,
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          ticks: {
            font: { family: "'Inter', sans-serif", size: 11 },
            color: '#94a3b8',
            padding: 12,
            stepSize: 2,
          },
          border: { display: false },
          beginAtZero: true,
        },
      },
    },
  });
}

function initPricingChart() {
  const canvas = document.getElementById('analytics-pricing-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const datasets = [
    { label: 'Lot A', data: chartData.pricingTrend.lotA, color: '#3b82f6' },
    { label: 'Lot B', data: chartData.pricingTrend.lotB, color: '#22c55e' },
    { label: 'Lot C', data: chartData.pricingTrend.lotC, color: '#f59e0b' },
  ];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.pricingTrend.labels,
      datasets: datasets.map(d => ({
        label: d.label,
        data: d.data,
        borderColor: d.color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: d.color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointHitRadius: 20,
        fill: false,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            font: { family: "'Inter', sans-serif", size: 10 },
            color: '#64748b',
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 12,
            boxWidth: 6,
            boxHeight: 6,
          },
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: "'Inter', sans-serif", weight: '600', size: 12 },
          bodyFont: { family: "'Inter', sans-serif", size: 11 },
          padding: { x: 12, y: 8 },
          cornerRadius: 8,
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ₹${ctx.parsed.y}/hr`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "'Inter', sans-serif", size: 11 }, color: '#94a3b8', padding: 8 },
          border: { display: false },
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          ticks: {
            font: { family: "'Inter', sans-serif", size: 11 },
            color: '#94a3b8',
            padding: 12,
            callback: value => '₹' + value + '/hr',
          },
          border: { display: false },
          beginAtZero: true,
        },
      },
    },
  });
}
