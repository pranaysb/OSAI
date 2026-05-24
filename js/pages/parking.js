// ============================================
// OPTISENSE AI — Smart Parking Management
// Premium Role-Driven Operational Dashboard
// ============================================

import { 
  parkingZones, 
  parkingViolations, 
  chartData,
  guestPasses as initialGuestPasses,
  studentHistory,
  facultyHistory
} from '../data/mock-data.js';

// Local state for interactive elements
let violations = [...parkingViolations];
let guestPasses = [...initialGuestPasses];
let studentFines = 500; // KA01MN4821 fine
let studentHistoryList = [...studentHistory];
let activeViolationSpotDetails = null;

// ---- Styles Integration ----
const styleId = 'parking-custom-styles';
if (!document.getElementById(styleId)) {
  const styleEl = document.createElement('style');
  styleEl.id = styleId;
  styleEl.textContent = `
    /* CCTV Feed Styles */
    .cctv-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }
    .cctv-camera {
      position: relative;
      background: #020617;
      border-radius: var(--radius-lg);
      overflow: hidden;
      aspect-ratio: 16 / 9;
      border: 1px solid var(--slate-800);
    }
    .cctv-overlay {
      position: absolute;
      top: 12px;
      left: 12px;
      font-size: 10px;
      font-family: var(--font-mono);
      background: rgba(0,0,0,0.7);
      color: var(--green-400);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cctv-scanline {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: rgba(34, 197, 94, 0.4);
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
      animation: scan 3s linear infinite;
    }
    .cctv-target {
      position: absolute;
      border: 2px solid var(--red-500);
      width: 60px;
      height: 40px;
      top: 45%;
      left: 35%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
    }
    .cctv-target::before {
      content: 'FLAGGED';
      position: absolute;
      top: -18px;
      left: -2px;
      background: var(--red-600);
      color: white;
      font-size: 8px;
      padding: 1px 4px;
      font-weight: 700;
      border-radius: var(--radius-sm);
    }
    @keyframes scan {
      0% { top: 0%; }
      100% { top: 100%; }
    }

    /* Spot grid mapping overrides */
    .spot {
      cursor: pointer;
      position: relative;
    }
    .spot:hover {
      transform: scale(1.15);
      z-index: 10;
      box-shadow: 0 0 8px rgba(0,0,0,0.2);
    }
    
    /* Recommendation Card */
    .recommendation-box {
      background: var(--blue-50);
      border: 1px solid var(--blue-200);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      margin-bottom: var(--space-6);
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      animation: fadeInUp 0.4s ease;
    }
    
    /* QR Pass Permit */
    .qr-permit-card {
      background: linear-gradient(135deg, var(--slate-900), var(--slate-950));
      color: white;
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      border: 1px solid rgba(255,255,255,0.08);
      position: relative;
      overflow: hidden;
    }
    .qr-permit-card::after {
      content: '';
      position: absolute;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
      bottom: -40px;
      right: -40px;
    }
    .qr-grid-mock {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 2px;
      width: 64px;
      height: 64px;
      background: white;
      padding: 4px;
      border-radius: var(--radius-sm);
    }
    .qr-pixel {
      background: #000;
    }
    .qr-pixel.white {
      background: #fff;
    }

    /* Spot details modal drawer */
    .spot-detail-drawer {
      background: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      margin-top: var(--space-4);
      animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  `;
  document.head.appendChild(styleEl);
}

// ---- Helpers ----

function getOccupancyColor(pct) {
  if (pct >= 90) return 'red';
  if (pct >= 75) return 'amber';
  return 'green';
}

function getLotColorClass(id) {
  const map = { 'lot-a': 'blue', 'lot-b': 'green', 'lot-c': 'amber', 'lot-d': 'purple' };
  return map[id] || 'blue';
}

function getViolationTypeBadge(type) {
  const map = {
    'Wrong Zone': 'badge-amber',
    'Expired Permit': 'badge-red',
    'Overstay': 'badge-amber',
    'No Permit': 'badge-red',
    'Double Parking': 'badge-amber',
  };
  return map[type] || 'badge-slate';
}

function getStatusBadge(status) {
  const map = {
    'Active': 'badge-red',
    'Notified': 'badge-amber',
    'Escalated': 'badge-red',
  };
  return map[status] || 'badge-slate';
}

function heatmapColor(value) {
  if (value <= 30) {
    const ratio = value / 30;
    const r = Math.round(34 + ratio * (245 - 34));
    const g = Math.round(197 + ratio * (158 - 197));
    const b = Math.round(94 + ratio * (11 - 94));
    return `rgb(${r},${g},${b})`;
  } else if (value <= 65) {
    const ratio = (value - 30) / 35;
    const r = Math.round(245 + ratio * (239 - 245));
    const g = Math.round(158 - ratio * 90);
    const b = Math.round(11 + ratio * (57 - 11));
    return `rgb(${r},${g},${b})`;
  } else {
    const ratio = (value - 65) / 35;
    const r = Math.round(239 - ratio * 30);
    const g = Math.round(68 - ratio * 30);
    const b = Math.round(57 - ratio * 20);
    return `rgb(${r},${g},${b})`;
  }
}

// Renders QR code pixels mock
function renderMockQR() {
  let pixels = '';
  for (let i = 0; i < 64; i++) {
    // Random grid layout that looks like a QR code
    const isBlack = (i % 3 === 0 || i % 7 === 0 || i < 8 || i % 8 === 0 || i > 56 || (i > 24 && i < 32));
    pixels += `<div class="qr-pixel ${isBlack ? '' : 'white'}"></div>`;
  }
  return `<div class="qr-grid-mock">${pixels}</div>`;
}

// ---- Spot Click Handler for Security Ops ----
window.selectSecuritySpot = function(lotId, spotNum, status, violationId = null) {
  const detailsContainer = document.getElementById('security-spot-details');
  if (!detailsContainer) return;

  activeViolationSpotDetails = { lotId, spotNum, status, violationId };

  if (status === 'violation') {
    const violation = violations.find(v => v.id === violationId) || {
      id: violationId || 'VIO-UNK',
      vehicle: 'KA03PQ9901',
      name: 'Dr. Ramesh Nair (Visitor)',
      type: 'Wrong Zone',
      description: `Visitor vehicle parked in reserved spot ${spotNum}`,
      time: '10 min ago',
      fine: 500,
      status: 'Active'
    };
    
    detailsContainer.innerHTML = `
      <div class="spot-detail-drawer alert-danger">
        <div style="display:flex;justify-content:between;align-items:center;margin-bottom:8px">
          <h4 style="font-weight:700">🚨 Active Space Violation — ${lotId.toUpperCase()} Spot #${spotNum}</h4>
          <span class="badge badge-red">Active</span>
        </div>
        <div class="grid grid-2 gap-4" style="margin-bottom:12px">
          <div>
            <div style="font-size:11px;color:var(--text-tertiary)">VEHICLE NO.</div>
            <div class="mono font-semibold" style="font-size:14px">${violation.vehicle}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text-tertiary)">OWNER / DRIVER</div>
            <div class="font-semibold" style="font-size:14px">${violation.name}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text-tertiary)">VIOLATION TYPE</div>
            <div><span class="badge badge-amber">${violation.type}</span></div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text-tertiary)">DETECTED AT</div>
            <div class="font-semibold" style="font-size:14px">${violation.time}</div>
          </div>
        </div>
        <p class="text-xs" style="color:var(--red-600);margin-bottom:12px"><strong>Detail:</strong> ${violation.description}</p>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="triggerTowAction('${violation.id}')">🚜 Dispatch Tow Truck</button>
          <button class="btn btn-secondary btn-sm" onclick="sendWarningSMS('${violation.vehicle}')">📱 Send Warning SMS</button>
          <button class="btn btn-ghost btn-sm" onclick="clearViolationDrawer()">Dismiss</button>
        </div>
      </div>
    `;
  } else if (status === 'occupied') {
    // Generate simulated occupancy details
    const isStudent = lotId === 'lot-b';
    const vehicle = isStudent ? 'KA01CD9923' : 'KA03PQ7890';
    const name = isStudent ? 'Ananya Iyer' : 'Dr. Meera Nair';
    const permit = isStudent ? 'STU-2024-0553' : 'FAC-2024-0201';

    detailsContainer.innerHTML = `
      <div class="spot-detail-drawer" style="border-left: 3px solid var(--slate-400)">
        <h4 style="font-weight:600;margin-bottom:8px">Spot Details — ${lotId.toUpperCase()} Spot #${spotNum}</h4>
        <div class="grid grid-2 gap-4" style="margin-bottom:12px">
          <div>
            <div style="font-size:11px;color:var(--text-tertiary)">VEHICLE NO.</div>
            <div class="mono font-semibold">${vehicle}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text-tertiary)">OWNER</div>
            <div class="font-semibold">${name}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text-tertiary)">PERMIT ID</div>
            <div class="mono font-semibold">${permit}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text-tertiary)">STATUS</div>
            <div><span class="badge badge-green">Authorized</span></div>
          </div>
        </div>
        <div style="display:flex;justify-content:end">
          <button class="btn btn-secondary btn-sm" onclick="clearViolationDrawer()">Close</button>
        </div>
      </div>
    `;
  } else {
    detailsContainer.innerHTML = `
      <div class="spot-detail-drawer" style="border-left: 3px solid var(--green-500)">
        <h4 style="font-weight:600;color:var(--green-600)">Spot #${spotNum} is Available</h4>
        <p class="text-xs text-secondary" style="margin-top:4px">No active vehicle sensor connection. Open for authorized vehicles in ${lotId.toUpperCase()}.</p>
      </div>
    `;
  }
};

window.clearViolationDrawer = function() {
  const detailsContainer = document.getElementById('security-spot-details');
  if (detailsContainer) detailsContainer.innerHTML = '';
};

// Dispatch Tow Action Simulation
window.triggerTowAction = function(violationId) {
  violations = violations.filter(v => v.id !== violationId);
  alert(`Tow truck dispatched to resolve ${violationId}. Space state will clear shortly.`);
  clearViolationDrawer();
  
  // Re-render dashboard
  const container = document.getElementById('dashboard-content');
  renderParking(container);
};

// Send Warning SMS simulation
window.sendWarningSMS = function(vehicle) {
  alert(`Warning SMS sent to vehicle registration contacts for ${vehicle}.`);
};

// Clear Student Fine Simulation
window.payStudentFine = function() {
  studentFines = 0;
  alert('Fine of ₹500 paid successfully! Clearance code generated: STU-PAY-88421');
  const container = document.getElementById('dashboard-content');
  renderParking(container);
};

// Search Parking for Students
window.searchStudentParking = function() {
  const dest = document.getElementById('student-dest-select').value;
  const resultCard = document.getElementById('student-search-results');
  
  if (dest === 'cs') {
    resultCard.innerHTML = `
      <div class="recommendation-box" style="margin-top:12px">
        <span style="font-size:24px">💡</span>
        <div style="flex:1">
          <div style="display:flex;justify-content:between;align-items:center">
            <h4 style="font-weight:700;color:var(--blue-800)">CS Block Access Recommended Parking</h4>
            <span class="badge badge-amber animate-fade-in">Surge Pricing Active</span>
          </div>
          <p class="text-sm text-secondary" style="margin-top:6px;line-height:1.4">
            Student <strong>Lot B</strong> is closest (2 min walk) but currently <strong>91% occupied</strong> with a dynamic rate of <strong style="color:var(--red-500)">₹35/hr</strong>.
          </p>
          <div style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.12);padding:10px;border-radius:var(--radius-md);margin-top:10px">
            <span class="font-semibold text-primary">Smart Choice Recommendation:</span><br>
            <span class="text-xs text-secondary">Route to <strong>Lot C (Visitor Overflow)</strong> — 13 spots available · 6 min walk · <strong>₹15/hr</strong> (<span style="color:var(--green-600);font-weight:700">Save ₹20/hr</span>).</span>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-primary btn-sm" onclick="alert('Routing updated. Follow digital signage boards pointing to Lot C.')">🗺️ Route to Lot C</button>
            <button class="btn btn-secondary btn-sm" onclick="alert('Spot locked in Lot C for 15 minutes. Reservation ID: RSV-4412')">⚡ Pre-book Spot</button>
          </div>
        </div>
      </div>
    `;
  } else {
    resultCard.innerHTML = `
      <div class="recommendation-box" style="margin-top:12px;background:var(--slate-50);border-color:var(--slate-200);color:var(--text-primary)">
        <span style="font-size:24px">ℹ️</span>
        <div style="flex:1">
          <h4 style="font-weight:700">Parking Recommendations for ${dest.toUpperCase()} Block</h4>
          <p class="text-sm text-secondary" style="margin-top:4px">
            Parking spots are widely available in student <strong>Lot B</strong>. Current Rate: ₹20/hr (Base Pricing). No dynamic surcharges.
          </p>
        </div>
      </div>
    `;
  }
};

// Generate Faculty Guest Pass
window.createGuestPass = function(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('guest-name').value;
  const vehicle = document.getElementById('guest-vehicle').value.toUpperCase();
  const duration = document.getElementById('guest-duration').value;

  if (!name || !vehicle) {
    alert('Please enter guest name and vehicle number.');
    return;
  }

  const newPass = {
    id: `GP-${Math.floor(100 + Math.random() * 900)}`,
    name,
    vehicle,
    date: 'Today',
    duration,
    status: 'Scheduled'
  };

  guestPasses.unshift(newPass);

  alert(`Guest Pass generated for ${name} (${vehicle}). QR Code Permit sent to visitor mobile.`);
  
  // Reset form
  document.getElementById('guest-name').value = '';
  document.getElementById('guest-vehicle').value = '';

  // Re-render
  const container = document.getElementById('dashboard-content');
  renderParking(container);
};


// ---- Spot Grid Builder ----

function buildSpotGrid(zone) {
  const { id, occupied, total } = zone;
  let spots = '';

  // Get active violations in this lot
  const lotViolations = violations.filter(v => {
    if (id === 'lot-a' && v.type === 'Wrong Zone') return true;
    if (id === 'lot-b' && v.type === 'No Permit') return true;
    if (id === 'lot-c' && v.type === 'Overstay') return true;
    if (id === 'lot-d' && v.type === 'Expired Permit') return true;
    return false;
  });

  const spotsToDisplay = id === 'lot-b' ? 40 : total; // Limit Lot B display to 40 for UI clean grid

  for (let i = 1; i <= spotsToDisplay; i++) {
    let status = 'available';
    let violationId = null;

    if (i <= occupied) {
      status = 'occupied';
      // Assign violation tags
      if (lotViolations.length > 0 && i % 9 === 0) {
        const vio = lotViolations[i % lotViolations.length];
        status = 'violation';
        violationId = vio.id;
      }
    }

    const title = `${zone.name} Spot #${i} (${status.toUpperCase()})`;
    spots += `<div class="spot ${status}" title="${title}" onclick="selectSecuritySpot('${zone.id}', ${i}, '${status}', '${violationId}')"></div>`;
  }
  return spots;
}

// ---- Main Render Routing ----

export function renderParking(container) {
  const role = window.currentRole;

  if (role === 'admin') {
    renderAdminParking(container);
  } else if (role === 'security') {
    renderSecurityParking(container);
  } else if (role === 'student') {
    renderStudentParking(container);
  } else if (role === 'faculty') {
    renderFacultyParking(container);
  }

  // Load appropriate charts
  setTimeout(() => {
    if (role === 'admin') {
      initOccupancyChart();
      initDurationChart();
    }
  }, 0);
}

// ============================================
// 1. ADMIN PARKING VIEW
// ============================================

function renderAdminParking(container) {
  const totalSpots = 175;
  const totalOccupied = 116;
  const totalAvailable = 59;
  const occupancyPct = ((totalOccupied / totalSpots) * 100).toFixed(1);

  // Dynamic pricing summary rows
  const pricingAlertsRows = `
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.12);border-radius:var(--radius-md)">
        <span style="font-size:16px">⚡</span>
        <div style="flex:1">
          <div class="font-semibold text-sm text-primary">Placement Week Surge Active</div>
          <p class="text-xs text-secondary">Student Lot B pricing surged by 75% due to 91% occupancy threshold trigger.</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.12);border-radius:var(--radius-md)">
        <span style="font-size:16px">⚠️</span>
        <div style="flex:1">
          <div class="font-semibold text-sm text-primary">Faculty Spot Congestion Warnings</div>
          <p class="text-xs text-secondary">Faculty reserved Lot A near 90% capacity; overflow redirect markers activated at South Gate.</p>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>Smart Parking Dashboard</h1>
      <p>Continuous spatial state monitoring, pricing algorithms, and systemic violation logs</p>
    </div>

    <!-- Stats Row -->
    <div class="stats-row cols-6 stagger" style="margin-bottom:var(--space-6)">
      <div class="stat-card">
        <span class="stat-label">Total Spot Grid</span>
        <span class="stat-value">${totalSpots}</span>
        <span class="stat-change positive">4 lots active</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Occupancy Rate</span>
        <span class="stat-value">${totalOccupied}</span>
        <span class="stat-change" style="color:var(--text-tertiary)">${occupancyPct}% utilized</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Available Spots</span>
        <span class="stat-value">${totalAvailable}</span>
        <span class="stat-change positive">Healthy buffer</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Overstay Alarms</span>
        <span class="stat-value" style="color:var(--amber-500)">3</span>
        <span class="stat-change negative">Avg 4.1 hrs dwell</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Fines Issued</span>
        <span class="stat-value" style="color:var(--red-500)">${violations.length}</span>
        <span class="stat-change negative">₹4,550 unpaid</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Dynamic Revenue</span>
        <span class="stat-value">₹60,900</span>
        <span class="stat-change positive">▲ +18% Surge</span>
      </div>
    </div>

    <!-- Pricing Engine Intelligence Panel -->
    <div class="grid grid-2 gap-6" style="margin-bottom:var(--space-6)">
      <div class="card-section">
        <div class="card-section-header">
          <h3>Pricing Intelligence Controls</h3>
          <span class="badge badge-blue">AI Optimizing</span>
        </div>
        <div class="card-section-body">
          ${pricingAlertsRows}
        </div>
      </div>
      
      <!-- Student suggestion preview -->
      <div class="card-section" style="background:var(--blue-50);border-color:var(--blue-200)">
        <div class="card-section-header" style="border-bottom:none">
          <h3 style="color:var(--blue-900)">Student Signage Recommendation</h3>
          <span class="badge badge-blue">Active signage</span>
        </div>
        <div class="card-section-body" style="padding-top:0">
          <p class="text-sm text-secondary" style="margin-bottom:12px">Digital message sign board at West entry displays routing suggestions to optimize flow:</p>
          <div style="font-weight:600;color:var(--blue-800);background:white;padding:12px;border:1px dashed var(--blue-300);border-radius:var(--radius-md);font-family:var(--font-mono)">
            "LOT B FULL — ROUTE TO LOT C (6 MIN WALK, SAVE ₹20/HR)"
          </div>
        </div>
      </div>
    </div>

    <!-- Parking Zone Overview Cards -->
    <div class="card-section animate-fade-in-up" style="margin-bottom:var(--space-6)">
      <div class="card-section-header">
        <div style="display:flex;align-items:center;gap:12px">
          <h3>Zone Maps Summary</h3>
          <span class="live-pulse">LIVE occupancy tracking</span>
        </div>
      </div>
      <div class="parking-map">
        ${parkingZones.map(zone => {
          const pct = Math.round((zone.occupied / zone.total) * 100);
          const colorClass = getLotColorClass(zone.id);
          return `
            <div class="parking-lot-card ${zone.id}">
              <div class="lot-header">
                <div>
                  <div class="lot-name">${zone.name} — ${zone.label}</div>
                  <div class="lot-label">Rate: ₹${zone.basePrice}/hr · Peak Limit: ₹${zone.peakPrice}</div>
                </div>
                <span class="badge badge-${getOccupancyColor(pct)}">${pct}% Occupied</span>
              </div>
              <div class="progress-bar">
                <div class="fill ${colorClass}" style="width: ${pct}%"></div>
              </div>
              <div style="display:flex;justify-content:between;margin-top:10px;font-size:12px;color:var(--text-secondary)">
                <span>Spaces: <strong>${zone.occupied}/${zone.total}</strong></span>
                <span>Today's Cash: <strong>₹${zone.revenue.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Bottom Data Grid: Violations + Charts -->
    <div class="dashboard-grid two-col" style="margin-bottom:var(--space-6)">
      <!-- Violations -->
      <div class="card-section">
        <div class="card-section-header">
          <h3>Operational Violations Log</h3>
          <span class="badge badge-red">${violations.length} cases</span>
        </div>
        <div class="card-section-body no-pad" style="overflow-x:auto">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Type</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${violations.slice(0, 5).map(v => `
                <tr>
                  <td><span class="mono font-semibold">${v.vehicle}</span></td>
                  <td>${v.name}</td>
                  <td><span class="badge ${getViolationTypeBadge(v.type)}">${v.type}</span></td>
                  <td>${v.time}</td>
                  <td><span class="badge ${getStatusBadge(v.status)}">${v.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Occupancy Chart -->
      <div class="card-section">
        <div class="card-section-header">
          <h3>Weekly Occupancy Trends</h3>
          <span class="text-xs text-tertiary">Percentage occupied</span>
        </div>
        <div class="card-section-body">
          <div class="chart-container">
            <canvas id="parking-occupancy-chart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Heatmaps and Duration -->
    <div class="dashboard-grid two-col">
      <!-- Heatmap -->
      <div class="card-section">
        <div class="card-section-header">
          <h3>Weekly Congestion Profile</h3>
        </div>
        <div class="card-section-body">
          <div style="display:flex;flex-direction:column;gap:4px">
            ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const row = chartData.congestionHeatmap[idx];
              return `
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="font-size:11px;font-weight:600;width:36px">${day}</span>
                  <div style="display:flex;flex:1;gap:2px">
                    ${row.map(val => `<div style="flex:1;height:12px;border-radius:2px;background:${heatmapColor(val)}" title="Congestion: ${val}%"></div>`).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div style="display:flex;justify-content:between;font-size:10px;color:var(--text-tertiary);margin-top:8px">
            <span>6:00 AM</span>
            <span>12:00 PM</span>
            <span>6:00 PM</span>
          </div>
        </div>
      </div>

      <!-- Doughnut Chart -->
      <div class="card-section">
        <div class="card-section-header">
          <h3>Dwell-Time Distribution</h3>
        </div>
        <div class="card-section-body" style="display:flex;justify-content:center">
          <div style="max-width:260px">
            <canvas id="parking-duration-chart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// 2. SECURITY OPS PARKING VIEW
// ============================================

function renderSecurityParking(container) {
  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>Space Enforcement & Controls</h1>
      <p>Sensor grid occupancy mapping. Select any slot cell below to pull vehicle identity permits or process alert fines.</p>
    </div>

    <!-- CCTV Camera streams -->
    <div class="cctv-grid">
      <div class="cctv-camera">
        <div class="cctv-overlay">🔴 CAM-01: Main Lot A Entry</div>
        <div class="cctv-scanline"></div>
        <div class="cctv-target"></div>
        <div style="display:flex;justify-content:center;align-items:center;height:100%;color:var(--slate-600);font-size:12px">
          [ CCTV FEED MOCK — SCANNING IN PROGRESS ]
        </div>
      </div>
      <div class="cctv-camera">
        <div class="cctv-overlay" style="color:var(--blue-400)">🔵 CAM-02: Lot B Patrol View</div>
        <div class="cctv-scanline" style="animation-delay: 1.5s"></div>
        <div style="display:flex;justify-content:center;align-items:center;height:100%;color:var(--slate-600);font-size:12px">
          [ CCTV FEED MOCK — NORMAL PATROL STATUS ]
        </div>
      </div>
    </div>

    <!-- Interactive Grid Maps -->
    <div class="grid grid-2 gap-6" style="margin-bottom:var(--space-6)">
      
      <!-- Lots grids -->
      <div class="card-section">
        <div class="card-section-header">
          <h3>Live Space Occupancy Maps</h3>
          <div style="display:flex;gap:12px;font-size:11px">
            <span style="display:flex;align-items:center;gap:4px"><span class="spot available" style="width:10px;height:10px;border-radius:2px"></span>Available</span>
            <span style="display:flex;align-items:center;gap:4px"><span class="spot occupied" style="width:10px;height:10px;border-radius:2px"></span>Occupied</span>
            <span style="display:flex;align-items:center;gap:4px"><span class="spot violation" style="width:10px;height:10px;border-radius:2px"></span>Violation</span>
          </div>
        </div>
        <div class="card-section-body" style="display:flex;flex-direction:column;gap:16px">
          
          <!-- Loop parking lots grids -->
          ${parkingZones.map(zone => `
            <div>
              <div style="display:flex;justify-content:between;align-items:center;margin-bottom:6px">
                <span class="font-semibold text-sm">${zone.name} — ${zone.label}</span>
                <span class="text-xs text-secondary">${zone.occupied}/${zone.total} Spots</span>
              </div>
              <div class="lot-spots">
                ${buildSpotGrid(zone)}
              </div>
            </div>
          `).join('')}
          
        </div>
      </div>

      <!-- Action Panel Side drawer -->
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card-section">
          <div class="card-section-header">
            <h3>Active Violations Enforcement Queue</h3>
          </div>
          <div class="card-section-body no-pad" style="max-height:280px;overflow-y:auto">
            <div style="display:flex;flex-direction:column">
              ${violations.map(v => `
                <div style="padding:12px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:between;align-items:center">
                  <div>
                    <span class="mono font-semibold" style="font-size:13px">${v.vehicle}</span>
                    <span class="badge ${getViolationTypeBadge(v.type)}" style="font-size:9px;padding:1px 6px;margin-left:6px">${v.type}</span>
                    <div style="font-size:11px;color:var(--text-tertiary);margin-top:2px">${v.name} · ${v.time}</div>
                  </div>
                  <button class="btn btn-secondary btn-sm" onclick="triggerTowAction('${v.id}')">Tow</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Spot details container -->
        <div id="security-spot-details">
          <div style="background:var(--slate-50);border:1px dashed var(--slate-200);border-radius:var(--radius-lg);padding:30px;text-align:center;color:var(--text-tertiary)">
            <span style="font-size:24px">🖱️</span>
            <div style="margin-top:8px;font-size:12px">Click any grid cell block spot to check parking registration or dispatch tow trucks.</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// 3. STUDENT PORTAL VIEW (PARKING FINDER)
// ============================================

function renderStudentParking(container) {
  // Outstanding fines alert
  const finesAlert = studentFines > 0 ? `
    <div class="alert alert-danger" style="margin-bottom:var(--space-6);align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:20px">⚠️</span>
        <div>
          <strong>Outstanding Fine Issued</strong>
          <div class="text-xs">VIO-001: Wrong Zone Violation (Lot A Entry). Fine: ₹500. Pay immediately to avoid parking permit suspension.</div>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="payStudentFine()">Pay Fine (₹500)</button>
    </div>
  ` : `
    <div class="alert alert-success" style="margin-bottom:var(--space-6)">
      <span style="font-size:20px">✓</span>
      <div>
        <strong>All Fines Cleared</strong>
        <div class="text-xs">No pending violations or ticket surcharges registered on vehicle KA01MN4821.</div>
      </div>
    </div>
  `;

  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>Campus Parking Finder</h1>
      <p>Real-time campus space availability tracker and personal gate permits.</p>
    </div>

    <!-- Active warnings -->
    ${finesAlert}

    <!-- Search Tool and Results -->
    <div class="grid grid-3 gap-6" style="margin-bottom:var(--space-6)">
      <!-- Search card -->
      <div class="card-section" style="grid-column: span 1">
        <div class="card-section-header">
          <h3>Block Destination Search</h3>
        </div>
        <div class="card-section-body">
          <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:6px">SELECT BLOCK LOCATION</label>
          <select id="student-dest-select" class="select w-full" style="margin-bottom:12px;height:40px">
            <option value="cs">💻 Computer Science Block (Lot B/C)</option>
            <option value="mech">⚙️ Mechanical Block (Lot B)</option>
            <option value="admin">🏢 Administration Block (Lot A/C)</option>
          </select>
          <button class="btn btn-primary w-full" onclick="searchStudentParking()">🔍 Find Parking Spot</button>
        </div>
      </div>

      <!-- Recommendation panel container -->
      <div style="grid-column: span 2" id="student-search-results">
        <div style="background:white;border:1px dashed var(--border-default);border-radius:var(--radius-lg);padding:40px;text-align:center;color:var(--text-tertiary)">
          <span style="font-size:32px">💡</span>
          <h4 style="margin-top:12px;font-weight:600">Dynamic Recommendation Finder</h4>
          <p class="text-xs text-secondary" style="margin-top:4px">Select your destination campus building blocks on the left to locate optimal, low-cost parking spots.</p>
        </div>
      </div>
    </div>

    <!-- Permit & History -->
    <div class="grid grid-3 gap-6">
      
      <!-- Permit card layout -->
      <div class="qr-permit-card">
        <div style="display:flex;justify-content:between;align-items:start;margin-bottom:16px">
          <div>
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.6)">Optisense AI Permit</div>
            <h3 style="color:white;font-weight:800;margin-top:2px">KA-STUDENT-PASS</h3>
          </div>
          <span class="badge badge-green" style="background:rgba(34,197,94,0.15);color:var(--green-400)">Active</span>
        </div>
        
        <div style="margin-bottom:20px">
          <div style="font-size:10px;color:rgba(255,255,255,0.4)">VEHICLE REGISTRATION</div>
          <div class="mono" style="font-size:18px;font-weight:700;color:white;margin-top:2px">KA01MN4821</div>
        </div>

        <div style="display:flex;justify-content:between;align-items:end">
          <div>
            <div style="font-size:9px;color:rgba(255,255,255,0.4)">PERMIT ID</div>
            <div class="mono" style="font-size:11px;color:white">STU-2024-0891</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.4);margin-top:8px">ALLOWED ZONES</div>
            <div style="font-size:11px;color:white;font-weight:600">Lot B (Student), Lot C (Visitor)</div>
          </div>
          ${renderMockQR()}
        </div>
      </div>

      <!-- History Table -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <h3>Recent Personal Parking Records</h3>
        </div>
        <div class="card-section-body no-pad" style="overflow-x:auto">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time (In/Out)</th>
                <th>Dwell Time</th>
                <th>Zone</th>
                <th>Fare Charge</th>
              </tr>
            </thead>
            <tbody>
              ${studentHistoryList.map(h => `
                <tr>
                  <td>${h.date}</td>
                  <td>${h.entryTime} - ${h.exitTime}</td>
                  <td>${h.duration}</td>
                  <td><span class="badge badge-green">${h.zone}</span></td>
                  <td class="font-semibold">₹${h.amount}</td>
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
// 4. FACULTY PORTAL VIEW (RESERVED SPOT + GUEST PASS)
// ============================================

function renderFacultyParking(container) {
  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>Faculty Access Center</h1>
      <p>Reserved spot allocation, parking statistics, and visitor pass registrations</p>
    </div>

    <div class="grid grid-3 gap-6" style="margin-bottom:var(--space-6)">
      
      <!-- Reserved Spot Status Panel -->
      <div class="card-section" style="background:var(--blue-50);border-color:var(--blue-200)">
        <div class="card-section-header" style="border-bottom:none">
          <h3 style="color:var(--blue-900)">My Reserved Parking Space</h3>
          <span class="badge badge-blue">Spot Linked</span>
        </div>
        <div class="card-section-body" style="text-align:center;padding-top:10px">
          <div style="font-size:10px;text-transform:uppercase;color:var(--blue-500);font-weight:700;letter-spacing:0.05em">ZONE LOT A</div>
          <div style="font-size:48px;font-weight:900;color:var(--blue-900);line-height:1;margin:10px 0">Spot A-12</div>
          <div class="badge badge-green" style="background:rgba(34,197,94,0.1);color:var(--green-700)">🛰️ Vehicle Detected</div>
          
          <div style="background:white;border:1px solid var(--blue-200);border-radius:var(--radius-md);padding:10px;margin-top:16px;text-align:left">
            <div style="display:flex;justify-content:between;align-items:center;font-size:11px;color:var(--text-secondary)">
              <span>Assigned Vehicle:</span>
              <span class="mono font-semibold" style="color:var(--text-primary)">KA03PQ7890</span>
            </div>
            <div style="display:flex;justify-content:between;align-items:center;font-size:11px;color:var(--text-secondary);margin-top:4px">
              <span>Gate Check-in Time:</span>
              <span class="font-semibold" style="color:var(--text-primary)">09:25 AM (Today)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Guest pass registration form -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <h3>Issue Visitor Parking QR Permits</h3>
        </div>
        <form class="card-section-body grid grid-2 gap-4" onsubmit="createGuestPass(event)">
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:6px">GUEST / VISITOR NAME</label>
            <input type="text" id="guest-name" placeholder="Enter full name" class="input" style="height:36px">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:6px">VEHICLE REGISTRATION NUMBER</label>
            <input type="text" id="guest-vehicle" placeholder="e.g. MH04NO4433" class="input" style="height:36px">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:6px">DURATION LIMIT</label>
            <select id="guest-duration" class="select w-full" style="height:36px">
              <option value="2 hrs">2 Hours Pass</option>
              <option value="4 hrs" selected>4 Hours Pass</option>
              <option value="8 hrs">8 Hours Pass</option>
              <option value="24 hrs">Full Day Pass</option>
            </select>
          </div>
          <div style="display:flex;align-items:end">
            <button type="submit" class="btn btn-primary w-full" style="height:36px">⚡ Generate Guest Pass</button>
          </div>
        </form>
      </div>

    </div>

    <!-- Bottom Data Grid: Active Guest Passes + History -->
    <div class="grid grid-3 gap-6">
      
      <!-- Active Guest Passes list -->
      <div class="card-section">
        <div class="card-section-header">
          <h3>Active Guest Passes Issued</h3>
        </div>
        <div class="card-section-body no-pad" style="max-height:260px;overflow-y:auto">
          <div style="display:flex;flex-direction:column">
            ${guestPasses.map(pass => `
              <div style="padding:12px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:between;align-items:center">
                <div>
                  <div class="font-semibold text-sm">${pass.name}</div>
                  <div class="mono text-xs text-secondary" style="margin-top:2px">${pass.vehicle} · Duration: ${pass.duration}</div>
                </div>
                <span class="badge ${pass.status === 'Active' ? 'badge-green' : 'badge-blue'}">${pass.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- History Table -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <h3>Recent Reserved Spot Usage Logs</h3>
        </div>
        <div class="card-section-body no-pad" style="overflow-x:auto">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time (In/Out)</th>
                <th>Dwell Duration</th>
                <th>Parking Spot</th>
                <th>Sensor Status</th>
              </tr>
            </thead>
            <tbody>
              ${facultyHistory.map(h => `
                <tr>
                  <td>${h.date}</td>
                  <td>${h.entryTime} - ${h.exitTime}</td>
                  <td>${h.duration}</td>
                  <td><span class="mono font-semibold">${h.spot}</span></td>
                  <td><span class="badge badge-green">Authorized</span></td>
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
// CHARTS INITIALIZATION (ADMIN ONLY)
// ============================================

function initOccupancyChart() {
  const canvas = document.getElementById('parking-occupancy-chart');
  if (!canvas) return;

  try {
    const ctx = canvas.getContext('2d');
    const trend = chartData.occupancyTrend;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: trend.labels,
        datasets: [
          {
            label: 'Lot A (Faculty)',
            data: trend.lotA,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.02)',
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 3,
          },
          {
            label: 'Lot B (Student)',
            data: trend.lotB,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.02)',
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 3,
          },
          {
            label: 'Lot C (Visitor)',
            data: trend.lotC,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.02)',
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 3,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 10,
              font: { family: 'var(--font-sans)', size: 10 },
              color: '#64748b',
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: { 
            beginAtZero: true, 
            max: 100, 
            ticks: { callback: (v) => v + '%' } 
          }
        }
      }
    });
  } catch (e) {
    console.error("Error drawing occupancy chart", e);
  }
}

function initDurationChart() {
  const canvas = document.getElementById('parking-duration-chart');
  if (!canvas) return;

  try {
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['<1h', '1-2h', '2-4h', '4-8h', '>8h'],
        datasets: [{
          data: [15, 35, 30, 15, 5],
          backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444'],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 10,
              font: { family: 'var(--font-sans)', size: 10 },
            }
          }
        }
      }
    });
  } catch (e) {
    console.error("Error drawing duration chart", e);
  }
}
