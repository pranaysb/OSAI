// ============================================
// OPTISENSE AI — Chart Utilities
// Shared Chart.js configuration & helpers
// ============================================

const baseFont = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  size: 12,
  weight: 400,
};

const colors = {
  blue: '#3b82f6',
  blueLight: 'rgba(59, 130, 246, 0.08)',
  green: '#22c55e',
  greenLight: 'rgba(34, 197, 94, 0.08)',
  amber: '#f59e0b',
  amberLight: 'rgba(245, 158, 11, 0.08)',
  red: '#ef4444',
  redLight: 'rgba(239, 68, 68, 0.08)',
  purple: '#a855f7',
  purpleLight: 'rgba(168, 85, 247, 0.08)',
  slate: '#64748b',
  slateLight: 'rgba(100, 116, 139, 0.08)',
  grid: 'rgba(0, 0, 0, 0.04)',
  gridBorder: 'rgba(0, 0, 0, 0.06)',
};

// Default chart options
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        font: { ...baseFont, size: 11 },
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
      titleFont: { ...baseFont, weight: 600, size: 12 },
      bodyFont: { ...baseFont, size: 11 },
      padding: { x: 12, y: 8 },
      cornerRadius: 8,
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
      boxPadding: 4,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { ...baseFont, size: 11 },
        color: '#94a3b8',
        padding: 8,
      },
      border: { display: false },
    },
    y: {
      grid: {
        color: colors.grid,
        drawTicks: false,
      },
      ticks: {
        font: { ...baseFont, size: 11 },
        color: '#94a3b8',
        padding: 12,
      },
      border: { display: false },
      beginAtZero: true,
    },
  },
};

export function createLineChart(canvas, labels, datasets, options = {}) {
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      ...defaultOptions,
      ...options,
      elements: {
        line: { tension: 0.35, borderWidth: 2 },
        point: { radius: 0, hoverRadius: 5, hitRadius: 20 },
      },
      plugins: {
        ...defaultOptions.plugins,
        ...(options.plugins || {}),
      },
      scales: {
        ...defaultOptions.scales,
        ...(options.scales || {}),
      },
    },
  });
}

export function createBarChart(canvas, labels, datasets, options = {}) {
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      ...defaultOptions,
      ...options,
      elements: {
        bar: { borderRadius: 4, borderSkipped: false },
      },
      plugins: {
        ...defaultOptions.plugins,
        ...(options.plugins || {}),
      },
      scales: {
        ...defaultOptions.scales,
        ...(options.scales || {}),
      },
    },
  });
}

export function createDoughnutChart(canvas, labels, data, backgroundColors, options = {}) {
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors,
        borderWidth: 0,
        hoverOffset: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { ...baseFont, size: 11 },
            color: '#64748b',
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
            boxWidth: 6,
            boxHeight: 6,
          },
        },
        tooltip: defaultOptions.plugins.tooltip,
      },
      ...options,
    },
  });
}

export function makeGradient(ctx, color, height = 300) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, color.replace(')', ', 0.15)').replace('rgb', 'rgba'));
  gradient.addColorStop(1, color.replace(')', ', 0.01)').replace('rgb', 'rgba'));
  return gradient;
}

export { colors };
