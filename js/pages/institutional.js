// ============================================
// OPTISENSE AI — Institutional access & Gates
// Premium Role-Driven Operational Dashboard
// ============================================

import { 
  people as initialPeople, 
  guestPasses as initialGuestPasses, 
  studentHistory,
  facultyHistory
} from '../data/mock-data.js';

// Local state
let people = [...initialPeople];
let guestPasses = [...initialGuestPasses];
let searchFilter = '';
let studentFinesValue = 500;
let gatesState = {
  gateA: { name: 'Gate A - Main Entry', status: 'Closed', activeScan: 'KA03PQ7890 (Meera Nair)' },
  gateB: { name: 'Gate B - South Exit', status: 'Closed', activeScan: 'KA01CD9923 (Ananya Iyer)' },
  gateC: { name: 'Gate C - Logistics Gate', status: 'Closed', activeScan: 'AP05CR9912 (Venkat Rao)' }
};

// --- Operations ---

window.toggleGateStatus = function(gateKey) {
  const gate = gatesState[gateKey];
  if (!gate) return;
  gate.status = gate.status === 'Open' ? 'Closed' : 'Open';
  alert(`✓ Barrier state changed on ${gate.name}. State: ${gate.status.toUpperCase()}`);
  
  // Re-render
  const container = document.getElementById('dashboard-content');
  renderInstitutional(container);
};

window.addNewPermit = function(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const vehicle = document.getElementById('reg-vehicle').value.toUpperCase();
  const role = document.getElementById('reg-role').value;
  const dept = document.getElementById('reg-dept').value;

  if (!name || !vehicle) {
    alert('Please enter name and vehicle registration plate.');
    return;
  }

  const prefix = role.substring(0, 3).toUpperCase();
  const permitId = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPerson = {
    name,
    vehicle,
    role,
    department: dept || 'Staff',
    phone: '+91 99999 88888',
    permit: permitId,
    zone: role === 'Student' ? 'Lot B' : 'Lot A',
    status: 'Active'
  };

  people.unshift(newPerson);
  alert(`✓ Permit registration completed. Permit ${permitId} issued to ${name} for ${newPerson.zone}.`);

  // Reset form
  document.getElementById('reg-name').value = '';
  document.getElementById('reg-vehicle').value = '';

  // Re-render
  const container = document.getElementById('dashboard-content');
  renderInstitutional(container);
};

window.filterDirectory = function(val) {
  searchFilter = val.toLowerCase();
  const container = document.getElementById('dashboard-content');
  // Re-render only directories if possible, but rendering page is fine
  renderAdminInstitutional(container);
};

window.payInstitutionalFine = function() {
  studentFinesValue = 0;
  alert('Outstanding fine paid successfully.');
  const container = document.getElementById('dashboard-content');
  renderInstitutional(container);
};

// ---- Main Render ----

export function renderInstitutional(container) {
  const role = window.currentRole;

  if (role === 'admin') {
    renderAdminInstitutional(container);
  } else if (role === 'security') {
    renderSecurityInstitutional(container);
  } else if (role === 'student') {
    renderStudentInstitutional(container);
  } else if (role === 'faculty') {
    renderFacultyInstitutional(container);
  }
}

// ============================================
// 1. ADMIN USER DIRECTORY VIEW
// ============================================

function renderAdminInstitutional(container) {
  const filtered = people.filter(p => 
    p.name.toLowerCase().includes(searchFilter) || 
    p.vehicle.toLowerCase().includes(searchFilter) || 
    p.permit.toLowerCase().includes(searchFilter)
  );

  const tableRows = filtered.map(p => `
    <tr>
      <td class="font-semibold">${p.name}</td>
      <td><span class="mono font-semibold" style="font-size:13px">${p.vehicle}</span></td>
      <td>
        <span class="badge ${p.role === 'Student' ? 'badge-blue' : p.role === 'Faculty' ? 'badge-purple' : 'badge-slate'}">
          ${p.role}
        </span>
      </td>
      <td>${p.department}</td>
      <td class="mono" style="font-size:12px">${p.permit}</td>
      <td><span class="badge badge-blue">${p.zone}</span></td>
      <td><span class="badge ${p.status === 'Active' ? 'badge-green' : 'badge-red'}">${p.status}</span></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>Campus Permit Directory</h1>
      <p>Manage vehicle access permits, assign authorized zones, and register campus residents</p>
    </div>

    <!-- Forms & Directories -->
    <div class="grid grid-3 gap-6">
      
      <!-- New Permit Form -->
      <div class="card-section" style="grid-column: span 1">
        <div class="card-section-header">
          <h3>Issue New Vehicle Permit</h3>
        </div>
        <form class="card-section-body" style="display:flex;flex-direction:column;gap:12px" onsubmit="addNewPermit(event)">
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:4px">NAME</label>
            <input type="text" id="reg-name" placeholder="Full name" class="input" style="height:36px">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:4px">VEHICLE PLATE NO.</label>
            <input type="text" id="reg-vehicle" placeholder="e.g. KA01MN4821" class="input" style="height:36px">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:4px">PROFILE ROLE</label>
            <select id="reg-role" class="select w-full" style="height:36px">
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:4px">DEPARTMENT</label>
            <input type="text" id="reg-dept" placeholder="CS, Physics, etc." class="input" style="height:36px">
          </div>
          <button type="submit" class="btn btn-primary w-full" style="height:36px;margin-top:8px">Register Vehicle</button>
        </form>
      </div>

      <!-- Directory List -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <div style="display:flex;align-items:center;gap:12px">
            <h3>Registered Permits Directory</h3>
            <span class="badge badge-blue">${filtered.length} permits</span>
          </div>
          <div class="header-search" style="margin-left:auto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="search" id="directory-search-input" value="${searchFilter}" placeholder="Filter by name, plate, ID..." class="input" style="padding: 6px 12px 6px 30px; font-size:12px; height:30px; width:180px" oninput="filterDirectory(this.value)">
          </div>
        </div>
        <div class="card-section-body no-pad" style="max-height:420px;overflow-y:auto">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Vehicle</th>
                <th>Role</th>
                <th>Dept</th>
                <th>Permit ID</th>
                <th>Zone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// ============================================
// 2. SECURITY GATES ACCESS VIEW
// ============================================

function renderSecurityInstitutional(container) {
  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>Gate Access Panel</h1>
      <p>Manual remote barrier relays. Toggle switch values below to force open or close campus barriers.</p>
    </div>

    <!-- Gate Relays Grid -->
    <div class="grid grid-3 gap-6" style="margin-bottom:var(--space-6)">
      ${Object.keys(gatesState).map(key => {
        const gate = gatesState[key];
        const isOpen = gate.status === 'Open';
        return `
          <div class="card-section" style="border-top:3px solid ${isOpen ? 'var(--green-500)' : 'var(--red-500)'}">
            <div class="card-section-header" style="border-bottom:none">
              <h3 style="font-weight:700">${gate.name}</h3>
              <span class="badge ${isOpen ? 'badge-green' : 'badge-red'}">${gate.status.toUpperCase()}</span>
            </div>
            <div class="card-section-body" style="padding-top:0">
              <div style="background:var(--slate-50);border:1px solid var(--border-default);padding:10px;border-radius:var(--radius-md);margin-bottom:16px">
                <div style="font-size:10px;color:var(--text-tertiary)">LAST ANPR SCAN</div>
                <div class="mono font-semibold" style="font-size:12px;margin-top:2px">${gate.activeScan}</div>
              </div>
              <button class="btn ${isOpen ? 'btn-secondary' : 'btn-primary'} w-full" onclick="toggleGateStatus('${key}')">
                ${isOpen ? '🔒 Close Barrier Relay' : '🔓 Remote Open Gate'}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Gate sensor heartbeats -->
    <div class="card-section">
      <div class="card-section-header">
        <h3>Campus Barrier Relays Status</h3>
      </div>
      <div class="card-section-body grid grid-4 gap-4">
        <div style="display:flex;align-items:center;gap:10px">
          <span class="status-dot green"></span>
          <span style="font-size:13px">Gate A ANPR Loop: <strong>OK</strong></span>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="status-dot green"></span>
          <span style="font-size:13px">Gate B ANPR Loop: <strong>OK</strong></span>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="status-dot green"></span>
          <span style="font-size:13px">Gate C Laser Barrier: <strong>OK</strong></span>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="status-dot green"></span>
          <span style="font-size:13px">Main Relays UPS: <strong>98%</strong></span>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// 3. STUDENT PORTAL PORTAL VIEW
// ============================================

function renderStudentInstitutional(container) {
  // Check active warning
  const warningBox = studentFinesValue > 0 ? `
    <div class="alert alert-warning" style="margin-bottom:var(--space-6);align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:20px">⚠️</span>
        <div>
          <strong>Parking Violation Due</strong>
          <p class="text-xs text-secondary">Student vehicle KA01MN4821 parked in Faculty Lot A without permit. Fine: ₹500.</p>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="payInstitutionalFine()">Pay Fines (₹500)</button>
    </div>
  ` : `
    <div class="alert alert-success" style="margin-bottom:var(--space-6)">
      <span style="font-size:20px">✓</span>
      <div><strong>Permit Active</strong> — Vehicle KA01MN4821 holds valid clearance permit for Lot B. No pending fines.</div>
    </div>
  `;

  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>CS Student Portal</h1>
      <p>Register new vehicles, pay fees, or look up permit history details.</p>
    </div>

    ${warningBox}

    <!-- Double Columns -->
    <div class="grid grid-3 gap-6">
      
      <!-- Registration Process Steps Checklist -->
      <div class="card-section">
        <div class="card-section-header">
          <h3>Vehicle Permit Progress</h3>
        </div>
        <div class="card-section-body" style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:16px;color:var(--green-500)">✓</span>
            <span style="font-size:13px">Step 1: Submit vehicle details</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:16px;color:var(--green-500)">✓</span>
            <span style="font-size:13px">Step 2: Upload RC Book copy</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:16px;color:var(--green-500)">✓</span>
            <span style="font-size:13px">Step 3: Administrative approval</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:16px;color:var(--green-500)">✓</span>
            <span style="font-size:13px">Step 4: Smart QR Pass generated</span>
          </div>
        </div>
      </div>

      <!-- Mock Pass Display -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <h3>Active Digital Permit QR</h3>
        </div>
        <div class="card-section-body" style="display:flex;justify-content:center">
          <div style="background:linear-gradient(135deg, var(--slate-900), var(--slate-950));color:white;padding:20px;border-radius:var(--radius-lg);width:320px">
            <div style="display:flex;justify-content:between;margin-bottom:12px">
              <span class="mono font-semibold" style="font-size:12px">KA01MN4821</span>
              <span class="badge badge-green" style="background:rgba(34,197,94,0.15);color:var(--green-400)">Active</span>
            </div>
            <div style="text-align:center;margin:16px 0">
              <div style="display:inline-block;background:white;padding:8px;border-radius:var(--radius-sm)">
                <div class="qr-grid-mock" style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px;width:64px;height:64px">
                  ${Array.from({length: 64}).map((_, i) => `<div class="qr-pixel" style="background:${(i % 3 === 0 || i % 7 === 0) ? '#000' : '#fff'}"></div>`).join('')}
                </div>
              </div>
            </div>
            <div style="font-size:10px;text-align:center;color:var(--slate-400)">Permit ID: STU-2024-0891 · Valid till May 2027</div>
          </div>
        </div>
      </div>

    </div>
  `;
}

// ============================================
// 4. FACULTY PORTAL GUEST PASS VIEW
// ============================================

function renderFacultyInstitutional(container) {
  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header animate-fade-in-up">
      <h1>Faculty Visitor Desk</h1>
      <p>Create temporary QR barcode entry passes for external guests or guest lecturers.</p>
    </div>

    <!-- Booker Form -->
    <div class="grid grid-3 gap-6">
      
      <!-- Booker form -->
      <div class="card-section" style="grid-column: span 1">
        <div class="card-section-header">
          <h3>Issue Guest Permits</h3>
        </div>
        <form class="card-section-body" style="display:flex;flex-direction:column;gap:12px" onsubmit="addNewPermit(event)">
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:4px">GUEST FULL NAME</label>
            <input type="text" id="reg-name" placeholder="Guest name" class="input" style="height:36px">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:4px">VEHICLE PLATE NUMBER</label>
            <input type="text" id="reg-vehicle" placeholder="e.g. MH04NO4433" class="input" style="height:36px">
          </div>
          <input type="hidden" id="reg-role" value="Visitor">
          <input type="hidden" id="reg-dept" value="Guest Pass (Physics)">
          
          <button type="submit" class="btn btn-primary w-full" style="height:36px;margin-top:8px">Generate Ticket</button>
        </form>
      </div>

      <!-- Passes Issued List -->
      <div class="card-section" style="grid-column: span 2">
        <div class="card-section-header">
          <h3>Active Guest Passes List</h3>
        </div>
        <div class="card-section-body no-pad" style="max-height:360px;overflow-y:auto">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Vehicle No.</th>
                <th>Pass Type</th>
                <th>Clearance Dept</th>
                <th>Pass Status</th>
              </tr>
            </thead>
            <tbody>
              ${people.filter(p => p.role === 'Visitor').map(p => `
                <tr>
                  <td class="font-semibold">${p.name}</td>
                  <td><span class="mono font-semibold" style="font-size:13px">${p.vehicle}</span></td>
                  <td><span class="badge badge-amber">Visitor Pass</span></td>
                  <td>${p.department}</td>
                  <td><span class="badge badge-green">${p.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}
