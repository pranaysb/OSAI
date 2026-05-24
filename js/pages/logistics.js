// ============================================
// OPTISENSE AI — Logistics & Cargo Intelligence
// Premium Role-Driven Operational Dashboard
// ============================================

import { logisticsData as initialLogisticsData } from '../data/mock-data.js';

// Local state
let logisticsData = [...initialLogisticsData];

function statusBadge(status) {
  const map = {
    'Completed': 'badge badge-green',
    'Loading': 'badge badge-blue',
    'Unloading': 'badge badge-blue',
    'Gate Check': 'badge badge-amber',
    'Delayed': 'badge badge-red',
    'Arriving': 'badge badge-slate',
  };
  const cls = map[status] || 'badge badge-slate';
  const dot = status === 'Arriving' ? '<span class="status-dot blue" style="animation: pulse-glow 2s ease-in-out infinite;"></span> ' : '';
  return `<span class="${cls}">${dot}${status}</span>`;
}

// Security: Verify Arriving Truck Manifest
window.verifyTruckManifest = function(e) {
  if (e) e.preventDefault();
  const truckNum = document.getElementById('log-truck-num').value.toUpperCase();
  const driver = document.getElementById('log-driver').value;
  const cargo = document.getElementById('log-cargo').value;
  const wh = document.getElementById('log-wh').value;

  if (!truckNum || !driver) {
    alert('Please enter vehicle plate and driver name.');
    return;
  }

  const newTruck = {
    id: `TRK-${Math.floor(4200 + Math.random() * 100)}`,
    truck: truckNum,
    driver,
    entry: 'Just now',
    exit: '-',
    cargo,
    status: 'Unloading',
    warehouse: wh,
    dwell: '0h 01m'
  };

  logisticsData.unshift(newTruck);
  alert(`✓ Manifest verified for ${truckNum}. Entry gate cleared. Truck routed to warehouse ${wh}.`);

  // Reset form
  document.getElementById('log-truck-num').value = '';
  document.getElementById('log-driver').value = '';

  // Re-render
  const container = document.getElementById('dashboard-content');
  renderLogistics(container);
};

// ---- Main Render Routing ----

export function renderLogistics(container) {
  const role = window.currentRole;

  if (role !== 'admin' && role !== 'security') {
    container.innerHTML = `
      <div style="background:white;border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:60px;text-align:center;max-width:500px;margin:40px auto">
        <span style="font-size:48px">🔒</span>
        <h2 style="font-weight:700;margin-top:16px">Access Restricted</h2>
        <p class="text-sm text-secondary" style="margin-top:8px">Your current profile (${role}) does not have permission to view logistics tracking operations.</p>
      </div>
    `;
    return;
  }

  if (role === 'admin') {
    renderAdminLogistics(container);
  } else if (role === 'security') {
    renderSecurityLogistics(container);
  }
}

// ============================================
// 1. ADMIN LOGISTICS VIEW
// ============================================

function renderAdminLogistics(container) {
  const warehouses = [
    { id: 'WH-01', name: 'Main Receiving', util: 72, docks: 3, trucks: 1, delayed: false },
    { id: 'WH-02', name: 'Equipment', util: 85, docks: 2, trucks: 1, delayed: false },
    { id: 'WH-03', name: 'Supplies', util: 61, docks: 4, trucks: 2, delayed: false },
    { id: 'WH-04', name: 'Construction', util: 90, docks: 2, trucks: 1, delayed: true },
  ];

  function utilColor(pct) {
    if (pct > 85) return 'red';
    if (pct >= 70) return 'amber';
    return 'green';
  }

  const warehouseCards = warehouses.map(wh => `
    <div class="card card-sm" style="border-left: 3px solid var(--${wh.delayed ? 'red-500' : utilColor(wh.util) === 'green' ? 'green-500' : utilColor(wh.util) === 'amber' ? 'amber-500' : 'red-500'}); ${wh.delayed ? 'background: var(--red-50);' : ''}">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div>
          <div class="font-semibold text-base">${wh.id}</div>
          <div class="text-xs text-tertiary">${wh.name}</div>
        </div>
        <span class="font-bold text-lg" style="color: var(--${utilColor(wh.util) === 'green' ? 'green-600' : utilColor(wh.util) === 'amber' ? 'amber-600' : 'red-600'});">${wh.util}%</span>
      </div>
      <div class="progress-bar" style="margin-bottom: 10px;">
        <div class="fill ${utilColor(wh.util)}" style="width: ${wh.util}%;"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); color: var(--text-secondary);">
        <span>🚪 ${wh.docks} Docks</span>
        <span>${wh.delayed ? '<span style="color: var(--red-600); font-weight: 600;">🚛 Delayed</span>' : '🚛 ' + wh.trucks + ' Active'}</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>Logistics & Cargo Analytics</h1>
      <p>Warehouse dock utilization logs, delay warnings, and carrier schedules</p>
    </div>

    <!-- Stats -->
    <div class="stats-row stagger" style="margin-bottom:var(--space-6)">
      <div class="stat-card">
        <span class="stat-label">Trucks Active</span>
        <span class="stat-value">${logisticsData.filter(t => t.status !== 'Completed').length}</span>
        <span class="stat-change positive">In warehouse areas</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Delayed Carriers</span>
        <span class="stat-value" style="color:var(--red-500)">1</span>
        <span class="stat-change negative">Critical dwell time alert</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Avg Dwell Time</span>
        <span class="stat-value">2.1 hrs</span>
        <span class="stat-change positive">↓ 18 min last week</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Main WH Utilization</span>
        <span class="stat-value">78%</span>
        <span class="stat-change positive">Docks optimized</span>
      </div>
    </div>

    <div class="grid grid-3 gap-6" style="margin-bottom:var(--space-6)">
      <!-- Delayed alert -->
      <div class="card-section" style="grid-column: span 1">
        <div class="card-section-header">
          <h3>Warehouse Utilization</h3>
        </div>
        <div class="card-section-body" style="display:flex;flex-direction:column;gap:12px">
          ${warehouseCards}
        </div>
      </div>

      <!-- Timeline and summary -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <h3>Active Dock Manifests</h3>
        </div>
        <div class="card-section-body no-pad" style="max-height:400px;overflow-y:auto">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Truck ID</th>
                <th>Vehicle No.</th>
                <th>Driver</th>
                <th>Entry</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Warehouse</th>
                <th>Dwell</th>
              </tr>
            </thead>
            <tbody>
              ${logisticsData.map(t => `
                <tr>
                  <td class="font-semibold text-primary">${t.id}</td>
                  <td><span class="mono" style="font-size:12px">${t.truck}</span></td>
                  <td>${t.driver}</td>
                  <td>${t.entry}</td>
                  <td>${t.cargo}</td>
                  <td>${statusBadge(t.status)}</td>
                  <td><span class="badge badge-slate">${t.warehouse}</span></td>
                  <td>${t.dwell}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// 2. SECURITY OPS LOGISTICS CHECK-IN VIEW
// ============================================

function renderSecurityLogistics(container) {
  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>Logistics Gate Check-in</h1>
      <p>Verify incoming carrier manifests, record weights, and signal gate access relays</p>
    </div>

    <div class="grid grid-3 gap-6">
      
      <!-- Check in Form -->
      <div class="card-section" style="grid-column: span 1">
        <div class="card-section-header">
          <h3>Verify Carrier Entry</h3>
        </div>
        <form class="card-section-body" style="display:flex;flex-direction:column;gap:12px" onsubmit="verifyTruckManifest(event)">
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:4px">VEHICLE PLATE NUMBER</label>
            <input type="text" id="log-truck-num" placeholder="e.g. KA01TC4201" class="input" style="height:36px">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:4px">DRIVER NAME</label>
            <input type="text" id="log-driver" placeholder="Ramesh Gowda" class="input" style="height:36px">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:4px">CARGO MANIFEST TYPE</label>
            <select id="log-cargo" class="select w-full" style="height:36px">
              <option value="Electronics">Electronics</option>
              <option value="FMCG Supplies">FMCG Supplies</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Construction Material">Construction Material</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:4px">ROUTING WAREHOUSE</label>
            <select id="log-wh" class="select w-full" style="height:36px">
              <option value="WH-01">WH-01 (Receiving)</option>
              <option value="WH-02">WH-02 (Equipment)</option>
              <option value="WH-03">WH-03 (Supplies)</option>
              <option value="WH-04">WH-04 (Construction)</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary w-full" style="height:36px;margin-top:8px">Verify & Clear Gate</button>
        </form>
      </div>

      <!-- Carrier checklist table -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <h3>Security Log Ledger</h3>
        </div>
        <div class="card-section-body no-pad" style="max-height:440px;overflow-y:auto">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Truck ID</th>
                <th>Vehicle No.</th>
                <th>Driver</th>
                <th>Manifest Cargo</th>
                <th>Warehouse Destination</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${logisticsData.map(t => `
                <tr>
                  <td class="font-semibold text-primary">${t.id}</td>
                  <td><span class="mono" style="font-size:12px">${t.truck}</span></td>
                  <td>${t.driver}</td>
                  <td>${t.cargo}</td>
                  <td><span class="badge badge-slate">${t.warehouse}</span></td>
                  <td>${statusBadge(t.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}
