// ============================================
// OPTISENSE AI — ANPR Intelligence
// Premium Role-Driven Operational Dashboard
// ============================================

import { anprEvents } from '../data/mock-data.js';

// Local state
let scans = [...anprEvents];
let isLockdownActive = false;
let ocrThreshold = 85;

// --- Helpers ---

function statusBadge(status) {
  const map = {
    'Approved': 'badge badge-green',
    'Flagged': 'badge badge-amber',
    'Blocked': 'badge badge-red',
    'Manual Review': 'badge badge-amber',
    'Logged': 'badge badge-blue',
    'Failed': 'badge badge-red',
  };
  return map[status] || 'badge badge-slate';
}

function alertBadge(alert) {
  if (!alert || alert === 'None') return '<span style="color:var(--text-tertiary);font-size:var(--text-xs)">—</span>';
  const map = {
    'Low Confidence': 'badge badge-amber',
    'Expired Permit': 'badge badge-amber',
    'Blacklisted': 'badge badge-red',
    'Unreadable Plate': 'badge badge-red',
    'Duplicate Plate': 'badge badge-amber',
    'Pending Approval': 'badge badge-amber',
    'Visitor': 'badge badge-blue',
  };
  const cls = map[alert] || 'badge badge-slate';
  return `<span class="${cls}">${alert}</span>`;
}

function confidenceHTML(conf) {
  let color = 'var(--green-600)';
  let bg = 'var(--green-50)';
  if (conf < 80) { color = 'var(--red-600)'; bg = 'var(--red-50)'; }
  else if (conf < 95) { color = 'var(--amber-600)'; bg = 'var(--amber-50)'; }
  return `<span style="font-weight:600;color:${color};background:${bg};padding:2px 8px;border-radius:var(--radius-full);font-size:var(--text-xs)">${conf.toFixed(1)}%</span>`;
}

// Simulated Operations
window.triggerLockdownToggle = function() {
  isLockdownActive = !isLockdownActive;
  const container = document.getElementById('dashboard-content');
  renderANPR(container);
  alert(isLockdownActive ? '🚨 SECURITY ALERT: Campus Entry lockdown initiated. Main and South gate entry barrier controls held closed.' : '✓ Campus entry gates reset to normal operational parameters.');
};

window.overrideGateOpen = function(gate) {
  alert(`✓ Operator manual override approved. Signalling Gate relay controller: Open barrier on ${gate}.`);
};

window.adjustOcrThreshold = function(val) {
  ocrThreshold = val;
  const label = document.getElementById('ocr-threshold-value');
  if (label) label.textContent = `${val}%`;
};

// ---- Main Render Routing ----

export function renderANPR(container) {
  const role = window.currentRole;

  if (role !== 'admin' && role !== 'security') {
    container.innerHTML = `
      <div style="background:white;border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:60px;text-align:center;max-width:500px;margin:40px auto">
        <span style="font-size:48px">🔒</span>
        <h2 style="font-weight:700;margin-top:16px">Access Restricted</h2>
        <p class="text-sm text-secondary" style="margin-top:8px">Your current profile (${role}) does not have permission to view real-time ANPR scan intelligence logs.</p>
      </div>
    `;
    return;
  }

  if (role === 'admin') {
    renderAdminANPR(container);
  } else if (role === 'security') {
    renderSecurityANPR(container);
  }
}

// ============================================
// 1. ADMIN ANPR VIEW
// ============================================

function renderAdminANPR(container) {
  const tableRows = scans.map(evt => `
    <tr>
      <td><span style="font-family:var(--font-mono);font-weight:600;font-size:var(--text-sm);letter-spacing:0.02em">${evt.vehicle}</span></td>
      <td><span style="font-weight:500">${evt.name}</span></td>
      <td>${confidenceHTML(evt.confidence)}</td>
      <td style="font-size:var(--text-xs);color:var(--text-secondary)">${evt.gate}</td>
      <td>
        <span class="badge ${evt.type === 'Entry' ? 'badge-green' : 'badge-blue'}">
          ${evt.type === 'Entry' ? '↙' : '↗'} ${evt.type}
        </span>
      </td>
      <td><span class="${statusBadge(evt.status)}">${evt.status}</span></td>
      <td>${alertBadge(evt.alert)}</td>
      <td style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-secondary)">${evt.time}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>ANPR Scan Audits</h1>
      <p>System OCR engine settings, scan confidence indices, and central access ledger</p>
    </div>

    <!-- Stats -->
    <div class="stats-row stagger" style="margin-bottom:var(--space-6)">
      <div class="stat-card">
        <div class="stat-label">Total Scans Today</div>
        <div class="stat-value">1,247</div>
        <div class="stat-change positive">▲ +12% vs yesterday</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">OCR Average Accuracy</div>
        <div class="stat-value">98.4%</div>
        <div class="stat-change positive">▲ +0.3% calibration</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Flagged Vehicles</div>
        <div class="stat-value">7</div>
        <div class="stat-change positive">▼ -23% exceptions</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Calibration Threshold</div>
        <div class="stat-value" id="admin-threshold-stat">${ocrThreshold}%</div>
        <div class="stat-change positive">Active Filter</div>
      </div>
    </div>

    <div class="grid grid-3 gap-6" style="margin-bottom:var(--space-6)">
      <!-- Configuration Controls -->
      <div class="card-section" style="grid-column: span 1">
        <div class="card-section-header">
          <h3>OCR Confidence Calibration</h3>
        </div>
        <div class="card-section-body">
          <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:6px">MINIMUM OCR CONFIDENCE: <span id="ocr-threshold-value" class="font-semibold text-primary">${ocrThreshold}%</span></label>
          <input type="range" min="50" max="98" value="${ocrThreshold}" style="width:100%;margin-bottom:16px" oninput="adjustOcrThreshold(this.value)">
          <div style="font-size:11px;color:var(--text-tertiary);line-height:1.4">Scans below this score trigger a "Manual Review" flag, pausing entry gate sensors until cleared by Security Ops.</div>
        </div>
      </div>

      <!-- Confidence Distribution Chart -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <h3>Accuracy Confidence Ranges</h3>
        </div>
        <div class="card-section-body">
          <div class="chart-container" style="height:140px">
            <canvas id="anpr-confidence-chart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Scans Table -->
    <div class="table-container">
      <div class="table-header">
        <h3>Detection Event Audit Ledger</h3>
        <button class="btn btn-secondary btn-sm">Export CSV</button>
      </div>
      <div style="overflow-x:auto">
        <table class="premium-table">
          <thead>
            <tr>
              <th>Vehicle No.</th>
              <th>Name</th>
              <th>Confidence</th>
              <th>Gate</th>
              <th>Direction</th>
              <th>Status</th>
              <th>Alert</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Draw chart
  setTimeout(() => {
    const canvas = container.querySelector('#anpr-confidence-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['<60%', '60-80%', '80-90%', '90-95%', '95-100%'],
        datasets: [{
          data: [1, 1, 2, 3, 8],
          backgroundColor: '#3b82f6',
          borderRadius: 4,
          maxBarThickness: 32,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }, 0);
}

// ============================================
// 2. SECURITY OPS ANPR VIEW
// ============================================

function renderSecurityANPR(container) {
  // Lockdown indicator banner
  const lockdownBanner = isLockdownActive ? `
    <div class="alert alert-danger" style="margin-bottom:var(--space-6);align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:24px;animation: pulse-glow 1s infinite">🚨</span>
        <div>
          <strong>CAMPUS LOCKDOWN SHUTDOWN ACTIVE</strong>
          <div class="text-xs">Security manual override. Gate control sensors suspended. All vehicle access denied.</div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="triggerLockdownToggle()">Cancel Lockdown</button>
    </div>
  ` : '';

  // Get last 8 scans for the patrol feed
  const patrolScans = [...scans].reverse().slice(0, 8);

  container.innerHTML = `
    <!-- Lockdown Alerts Banner -->
    ${lockdownBanner}

    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <div style="display:flex;align-items:center;gap:12px">
        <h1>ANPR CCTV Plate Patrol</h1>
        <span class="live-pulse">System Live</span>
      </div>
      <p>Real-time plate scanning feed. Verify incoming alerts, manual override gate barriers, or initiate lockdown.</p>
    </div>

    <!-- Live Streams + Controls -->
    <div class="grid grid-3 gap-6" style="margin-bottom:var(--space-6)">
      <!-- CCTV Feed Cam -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <h3>Gate Camera ANPR Scanners</h3>
        </div>
        <div class="card-section-body" style="padding:0">
          <div style="display:grid;grid-template-columns:1fr 1fr">
            <!-- Cam 1 -->
            <div style="position:relative;background:#020617;aspect-ratio:16/10;border-right:1px solid var(--slate-800)">
              <div class="cctv-overlay">🔴 CAM-01 (GATE A)</div>
              <div class="cctv-scanline"></div>
              <div style="position:absolute;border:1px dashed var(--green-400);width:80px;height:40px;top:40%;left:45%;transform:translate(-50%,-50%)">
                <span style="position:absolute;bottom:-14px;left:0;font-size:8px;font-family:var(--font-mono);color:var(--green-400);background:black;padding:1px 3px">KA01MN4821</span>
              </div>
              <div style="display:flex;justify-content:center;align-items:center;height:100%;color:var(--slate-700);font-size:12px">
                [ SCANNING MAIN ENTRY ]
              </div>
            </div>
            <!-- Cam 2 -->
            <div style="position:relative;background:#020617;aspect-ratio:16/10">
              <div class="cctv-overlay">🔴 CAM-02 (GATE B)</div>
              <div class="cctv-scanline" style="animation-delay: 1.5s"></div>
              <div style="display:flex;justify-content:center;align-items:center;height:100%;color:var(--slate-700);font-size:12px">
                [ PATROLLING SOUTH EXIT ]
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Actions -->
      <div class="card-section">
        <div class="card-section-header">
          <h3>Emergency Controls</h3>
        </div>
        <div class="card-section-body" style="display:flex;flex-direction:column;gap:12px">
          <button class="btn btn-primary w-full" style="background:var(--red-600);border-color:var(--red-600);height:44px" onclick="triggerLockdownToggle()">
            🚨 Trigger Emergency Lockdown
          </button>
          
          <div style="border-top:1px solid var(--border-default);margin-top:8px;padding-top:12px">
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:6px">MANUAL BARRIER OVERRIDE</label>
            <div style="display:flex;flex-direction:column;gap:8px">
              <button class="btn btn-secondary btn-sm" onclick="overrideGateOpen('Gate A (Main)')">🔓 Open Gate A (Main)</button>
              <button class="btn btn-secondary btn-sm" onclick="overrideGateOpen('Gate B (South)')">🔓 Open Gate B (South)</button>
              <button class="btn btn-secondary btn-sm" onclick="overrideGateOpen('Gate C (Logistics)')">🔓 Open Gate C (Logistics)</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Scanning logs -->
    <div class="grid grid-3 gap-6">
      <!-- Live Scan Queue Feed -->
      <div class="card-section" style="grid-column: span 1">
        <div class="card-section-header">
          <h3>Patrol Stream Feed</h3>
        </div>
        <div class="card-section-body no-pad" style="max-height:360px;overflow-y:auto">
          <div class="feed-list">
            ${patrolScans.map(evt => {
              const isAlert = evt.status === 'Blocked' || evt.status === 'Failed' || evt.status === 'Flagged';
              const indicator = isAlert ? '🔴' : '🟢';
              return `
                <div class="feed-item" style="padding:10px 14px">
                  <div style="font-size:14px">${indicator}</div>
                  <div class="feed-content">
                    <div class="mono font-semibold" style="font-size:13px">${evt.vehicle}</div>
                    <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${evt.gate} · ${evt.status}</div>
                  </div>
                  <div class="feed-time" style="font-size:10px">${evt.time}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Manual Action Alerts Queue -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <h3>Requires Operator Clearance</h3>
        </div>
        <div class="card-section-body no-pad" style="overflow-x:auto">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Gate</th>
                <th>Alert Condition</th>
                <th>Confidence</th>
                <th>Cleared Status</th>
              </tr>
            </thead>
            <tbody>
              ${scans.filter(evt => evt.status === 'Manual Review' || evt.status === 'Flagged' || evt.status === 'Failed').map(evt => `
                <tr>
                  <td><span class="mono font-semibold">${evt.vehicle}</span></td>
                  <td>${evt.gate}</td>
                  <td><span class="badge badge-red">${evt.alert}</span></td>
                  <td>${confidenceHTML(evt.confidence)}</td>
                  <td>
                    <button class="btn btn-primary btn-sm" onclick="alert('Permit approved. Barrier opened.')" style="padding:4px 10px;font-size:10px">Approve</button>
                    <button class="btn btn-secondary btn-sm" onclick="alert('Access denied. Security guard dispatched.')" style="padding:4px 10px;font-size:10px">Deny</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
