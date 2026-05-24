// ============================================
// OPTISENSE AI — MOCK DATA
// Realistic Indian data for all dashboards
// ============================================

// ---- People ----
export const people = [
  { name: 'Pranay S B', vehicle: 'KA01MN4821', role: 'Student', department: 'Computer Science', phone: '+91 98765 43210', permit: 'STU-2024-0891', zone: 'Lot B', status: 'Active' },
  { name: 'Riya Sharma', vehicle: 'KA05AB1142', role: 'Student', department: 'Electronics', phone: '+91 87654 32109', permit: 'STU-2024-0742', zone: 'Lot B', status: 'Active' },
  { name: 'Arjun Verma', vehicle: 'TN09DK4422', role: 'Faculty', department: 'Mechanical', phone: '+91 76543 21098', permit: 'FAC-2024-0156', zone: 'Lot A', status: 'Active' },
  { name: 'Dr. Meera Nair', vehicle: 'KA03PQ7890', role: 'Faculty', department: 'Physics', phone: '+91 65432 10987', permit: 'FAC-2024-0201', zone: 'Lot A', status: 'Active' },
  { name: 'Vikram Reddy', vehicle: 'AP07GH5561', role: 'Student', department: 'Civil Engineering', phone: '+91 54321 09876', permit: 'STU-2024-1024', zone: 'Lot B', status: 'Expired' },
  { name: 'Ananya Iyer', vehicle: 'KA01CD9923', role: 'Student', department: 'Information Science', phone: '+91 43210 98765', permit: 'STU-2024-0553', zone: 'Lot B', status: 'Active' },
  { name: 'Prof. Rajesh Kumar', vehicle: 'KA04EF3344', role: 'Faculty', department: 'Mathematics', phone: '+91 32109 87654', permit: 'FAC-2024-0089', zone: 'Lot A', status: 'Active' },
  { name: 'Deepika Patel', vehicle: 'GJ01HI7788', role: 'Staff', department: 'Administration', phone: '+91 21098 76543', permit: 'STF-2024-0321', zone: 'Lot A', status: 'Active' },
  { name: 'Karthik Menon', vehicle: 'KL07JK2211', role: 'Student', department: 'Biotechnology', phone: '+91 10987 65432', permit: 'STU-2024-0667', zone: 'Lot B', status: 'Pending' },
  { name: 'Dr. Sunita Rao', vehicle: 'KA02LM6655', role: 'Faculty', department: 'Chemistry', phone: '+91 98712 34567', permit: 'FAC-2024-0178', zone: 'Lot A', status: 'Active' },
  { name: 'Rohit Joshi', vehicle: 'MH04NO4433', role: 'Visitor', department: '-', phone: '+91 87612 34567', permit: 'VIS-2024-0044', zone: 'Lot C', status: 'Active' },
  { name: 'Shreya Deshmukh', vehicle: 'KA09PQ8877', role: 'Student', department: 'Architecture', phone: '+91 76512 34567', permit: 'STU-2024-0912', zone: 'Lot B', status: 'Active' },
  { name: 'Amit Banerjee', vehicle: 'WB06RS1122', role: 'Visitor', department: '-', phone: '+91 65412 34567', permit: 'VIS-2024-0051', zone: 'Lot C', status: 'Active' },
  { name: 'Dr. Kavitha Suresh', vehicle: 'KA01TU5544', role: 'Faculty', department: 'Computer Science', phone: '+91 54312 34567', permit: 'FAC-2024-0234', zone: 'Lot A', status: 'Active' },
  { name: 'Naveen Hegde', vehicle: 'KA19VW3366', role: 'Staff', department: 'Security', phone: '+91 43212 34567', permit: 'STF-2024-0198', zone: 'Lot D', status: 'Active' },
];

// ---- ANPR Events ----
export const anprEvents = [
  { id: 'EVT-001', vehicle: 'KA01MN4821', name: 'Pranay S B', confidence: 98.7, gate: 'Gate A - Main', type: 'Entry', status: 'Approved', time: '09:14:32', alert: 'None', role: 'Student' },
  { id: 'EVT-002', vehicle: 'TN10AZ8942', name: 'Unknown', confidence: 62.3, gate: 'Gate B - South', type: 'Entry', status: 'Manual Review', time: '09:16:45', alert: 'Low Confidence', role: '-' },
  { id: 'EVT-003', vehicle: 'KA05AB1142', name: 'Riya Sharma', confidence: 97.2, gate: 'Gate A - Main', type: 'Entry', status: 'Approved', time: '09:18:11', alert: 'None', role: 'Student' },
  { id: 'EVT-004', vehicle: 'AP07GH5561', name: 'Vikram Reddy', confidence: 95.8, gate: 'Gate A - Main', type: 'Entry', status: 'Flagged', time: '09:22:03', alert: 'Expired Permit', role: 'Student' },
  { id: 'EVT-005', vehicle: 'KA03PQ7890', name: 'Dr. Meera Nair', confidence: 99.1, gate: 'Gate A - Main', type: 'Entry', status: 'Approved', time: '09:25:18', alert: 'None', role: 'Faculty' },
  { id: 'EVT-006', vehicle: 'DL04XY1234', name: 'Unknown', confidence: 94.5, gate: 'Gate C - Logistics', type: 'Entry', status: 'Blocked', time: '09:28:41', alert: 'Blacklisted', role: '-' },
  { id: 'EVT-007', vehicle: 'KA04EF3344', name: 'Prof. Rajesh Kumar', confidence: 99.4, gate: 'Gate A - Main', type: 'Entry', status: 'Approved', time: '09:31:55', alert: 'None', role: 'Faculty' },
  { id: 'EVT-008', vehicle: 'MH04NO4433', name: 'Rohit Joshi', confidence: 96.1, gate: 'Gate B - South', type: 'Entry', status: 'Approved', time: '09:35:22', alert: 'Visitor', role: 'Visitor' },
  { id: 'EVT-009', vehicle: 'KA01CD9923', name: 'Ananya Iyer', confidence: 98.3, gate: 'Gate A - Main', type: 'Exit', status: 'Logged', time: '09:38:47', alert: 'None', role: 'Student' },
  { id: 'EVT-010', vehicle: 'KA01MN4821', name: 'Pranay S B', confidence: 97.9, gate: 'Gate A - Main', type: 'Exit', status: 'Logged', time: '12:45:10', alert: 'None', role: 'Student' },
  { id: 'EVT-011', vehicle: 'XX00XX0000', name: 'Unknown', confidence: 31.2, gate: 'Gate B - South', type: 'Entry', status: 'Failed', time: '09:42:33', alert: 'Unreadable Plate', role: '-' },
  { id: 'EVT-012', vehicle: 'KA02LM6655', name: 'Dr. Sunita Rao', confidence: 99.6, gate: 'Gate A - Main', type: 'Entry', status: 'Approved', time: '09:45:02', alert: 'None', role: 'Faculty' },
  { id: 'EVT-013', vehicle: 'KA01MN4821', name: 'Pranay S B (Duplicate)', confidence: 93.4, gate: 'Gate C - Logistics', type: 'Entry', status: 'Flagged', time: '10:02:18', alert: 'Duplicate Plate', role: 'Student' },
  { id: 'EVT-014', vehicle: 'GJ01HI7788', name: 'Deepika Patel', confidence: 98.8, gate: 'Gate A - Main', type: 'Entry', status: 'Approved', time: '10:05:44', alert: 'None', role: 'Staff' },
  { id: 'EVT-015', vehicle: 'KL07JK2211', name: 'Karthik Menon', confidence: 97.1, gate: 'Gate B - South', type: 'Entry', status: 'Flagged', time: '10:12:29', alert: 'Pending Approval', role: 'Student' },
];

// ---- Parking Data ----
export const parkingZones = [
  { id: 'lot-a', name: 'Lot A', label: 'Faculty / Professors', occupied: 14, total: 20, type: 'faculty', color: '#3b82f6', basePrice: 40, peakPrice: 70, revenue: 12400 },
  { id: 'lot-b', name: 'Lot B', label: 'Students', occupied: 83, total: 120, type: 'student', color: '#22c55e', basePrice: 20, peakPrice: 35, revenue: 34200 },
  { id: 'lot-c', name: 'Lot C', label: 'Visitors', occupied: 12, total: 25, type: 'visitor', color: '#f59e0b', basePrice: 60, peakPrice: 90, revenue: 8700 },
  { id: 'lot-d', name: 'Lot D', label: 'VIP / Logistics', occupied: 7, total: 10, type: 'vip', color: '#a855f7', basePrice: 100, peakPrice: 150, revenue: 5600 },
];

export const parkingViolations = [
  { id: 'VIO-001', vehicle: 'KA01MN4821', name: 'Pranay S B', type: 'Wrong Zone', description: 'Student vehicle detected in Faculty Lot A', time: '10:32 AM', fine: 500, status: 'Active' },
  { id: 'VIO-002', vehicle: 'AP07GH5561', name: 'Vikram Reddy', type: 'Expired Permit', description: 'Parking with expired permit STU-2024-1024', time: '09:45 AM', fine: 1000, status: 'Notified' },
  { id: 'VIO-003', vehicle: 'MH04NO4433', name: 'Rohit Joshi', type: 'Overstay', description: 'Exceeded 4hr visitor limit by 2hr 15min', time: '02:15 PM', fine: 300, status: 'Active' },
  { id: 'VIO-004', vehicle: 'TN10AZ8942', name: 'Unknown', type: 'No Permit', description: 'Unregistered vehicle parked in Lot B', time: '11:20 AM', fine: 2000, status: 'Escalated' },
  { id: 'VIO-005', vehicle: 'KA09PQ8877', name: 'Shreya Deshmukh', type: 'Double Parking', description: 'Double parking blocking adjacent spot B-47', time: '01:45 PM', fine: 750, status: 'Active' },
];

// ---- Dynamic Pricing ----
export const pricingData = {
  currentSurge: true,
  surgeReason: 'Placement Week — High demand in Lot B',
  zones: [
    {
      zone: 'Lot A', label: 'Faculty', occupancy: 70, demand: 'Moderate',
      currentPrice: 40, peakPrice: 70, forecastPrice: 55,
      discount: 'Faculty 30% off', surcharge: 'Student restricted access',
      revenue: 12400, utilization: 70, projectedRevenue: 15800,
    },
    {
      zone: 'Lot B', label: 'Students', occupancy: 69, demand: 'Very High',
      currentPrice: 35, peakPrice: 50, forecastPrice: 42,
      discount: 'Student pass holders 20% off', surcharge: 'Placement week +75%',
      revenue: 34200, utilization: 69, projectedRevenue: 41500,
    },
    {
      zone: 'Lot C', label: 'Visitors', occupancy: 48, demand: 'Moderate',
      currentPrice: 60, peakPrice: 90, forecastPrice: 65,
      discount: 'None', surcharge: 'Peak hour +50%',
      revenue: 8700, utilization: 48, projectedRevenue: 10200,
    },
    {
      zone: 'Lot D', label: 'VIP / Logistics', occupancy: 70, demand: 'High',
      currentPrice: 100, peakPrice: 150, forecastPrice: 120,
      discount: 'Annual pass 15% off', surcharge: 'Premium flat rate',
      revenue: 5600, utilization: 70, projectedRevenue: 7800,
    },
  ],
  alerts: [
    { type: 'surge', message: 'Placement Week Surge Active — Lot B pricing increased by 75%', time: '2 hours ago' },
    { type: 'capacity', message: 'Lot B occupancy exceeded 91% — overflow routing to Lot C', time: '45 min ago' },
    { type: 'redirect', message: 'Visitors redirected to Lot C — estimated savings ₹20/hr', time: '30 min ago' },
    { type: 'forecast', message: 'Peak demand expected 2:00 PM - 4:00 PM today', time: '1 hour ago' },
  ],
  recommendation: {
    from: 'Lot B',
    to: 'Lot C',
    savings: 20,
    timeSaved: '8 min',
    reason: 'Lot B congested at 91% capacity',
  },
};

// ---- Logistics ----
export const logisticsData = [
  { id: 'TRK-4201', truck: 'KA01TC4201', driver: 'Ramesh Gowda', entry: '06:15 AM', exit: '08:42 AM', cargo: 'Electronics', status: 'Completed', warehouse: 'WH-01', dwell: '2h 27m' },
  { id: 'TRK-4202', truck: 'TN04TK8821', driver: 'Suresh Pillai', entry: '07:30 AM', exit: '-', cargo: 'FMCG Supplies', status: 'Loading', warehouse: 'WH-03', dwell: '1h 45m' },
  { id: 'TRK-4203', truck: 'MH12LG3301', driver: 'Ganesh Patil', entry: '08:00 AM', exit: '-', cargo: 'Lab Equipment', status: 'Gate Check', warehouse: 'WH-02', dwell: '0h 32m' },
  { id: 'TRK-4204', truck: 'AP05CR9912', driver: 'Venkat Rao', entry: '05:45 AM', exit: '-', cargo: 'Construction Material', status: 'Delayed', warehouse: 'WH-04', dwell: '4h 12m' },
  { id: 'TRK-4205', truck: 'KA03FD6677', driver: 'Naveen Kumar', entry: '-', exit: '-', cargo: 'Furniture', status: 'Arriving', warehouse: 'WH-01', dwell: '-' },
  { id: 'TRK-4206', truck: 'GJ06HD2244', driver: 'Rajiv Shah', entry: '09:15 AM', exit: '11:30 AM', cargo: 'IT Hardware', status: 'Completed', warehouse: 'WH-02', dwell: '2h 15m' },
  { id: 'TRK-4207', truck: 'KL01MV5533', driver: 'Ajith Nambiar', entry: '10:00 AM', exit: '-', cargo: 'Cafeteria Supplies', status: 'Unloading', warehouse: 'WH-03', dwell: '0h 48m' },
  { id: 'TRK-4208', truck: 'DL08PN7788', driver: 'Manoj Tiwari', entry: '-', exit: '-', cargo: 'Medical Supplies', status: 'Arriving', warehouse: 'WH-01', dwell: '-' },
];

// ---- Analytics ----
export const analyticsKPIs = [
  { label: 'Vehicles Today', value: '1,247', change: '+12%', trend: 'up' },
  { label: 'ANPR Accuracy', value: '98.4%', change: '+0.3%', trend: 'up' },
  { label: 'Parking Utilization', value: '66.3%', change: '+8%', trend: 'up' },
  { label: 'Active Violations', value: '5', change: '-23%', trend: 'down' },
  { label: 'Revenue Today', value: '₹60,900', change: '+18%', trend: 'up' },
  { label: 'Congestion Score', value: '42/100', change: '-5', trend: 'down' },
  { label: 'Unauthorized Entries', value: '3', change: '-40%', trend: 'down' },
  { label: 'Avg Dwell Time', value: '3.2 hrs', change: '+0.4', trend: 'up' },
];

// ---- Chart Data ----
export const chartData = {
  vehiclesPerHour: {
    labels: ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'],
    data: [23, 67, 189, 312, 245, 178, 156, 142, 198, 267, 234, 189, 245, 178, 89],
  },
  occupancyTrend: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    lotA: [65, 72, 68, 75, 70, 30, 15],
    lotB: [55, 78, 82, 91, 85, 40, 20],
    lotC: [30, 35, 42, 55, 48, 60, 45],
    lotD: [40, 50, 55, 70, 65, 35, 20],
  },
  revenueWeekly: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [42000, 51000, 48000, 62000, 58000, 35000, 21000],
  },
  pricingTrend: {
    labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM'],
    lotA: [40, 45, 55, 60, 55, 50, 65, 70, 60, 50, 40],
    lotB: [20, 25, 30, 35, 30, 28, 35, 45, 40, 30, 20],
    lotC: [60, 65, 70, 75, 70, 65, 80, 90, 80, 70, 60],
  },
  violationsTrend: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    wrongZone: [2, 1, 3, 2, 4, 1, 0],
    overstay: [3, 4, 2, 5, 3, 2, 1],
    noPermit: [1, 0, 2, 1, 1, 0, 0],
    expired: [0, 1, 1, 2, 1, 0, 0],
  },
  congestionHeatmap: [
    [10, 25, 45, 60, 50, 35, 30, 25, 40, 55, 50, 35],
    [15, 30, 55, 75, 65, 45, 40, 35, 55, 70, 60, 40],
    [12, 28, 50, 70, 60, 42, 38, 32, 50, 65, 55, 38],
    [18, 35, 60, 82, 72, 50, 45, 40, 62, 78, 68, 45],
    [20, 38, 65, 88, 78, 55, 48, 42, 65, 82, 72, 48],
    [8, 15, 25, 35, 30, 28, 25, 20, 28, 32, 28, 18],
    [5, 10, 15, 20, 18, 15, 12, 10, 15, 18, 15, 10],
  ],
};

// ---- Guest Passes (for Faculty) ----
export const guestPasses = [
  { id: 'GP-901', name: 'Rohit Joshi', vehicle: 'MH04NO4433', date: 'Today', duration: '4 hrs', status: 'Active' },
  { id: 'GP-902', name: 'Priya Menon', vehicle: 'KA09XY1234', date: 'Tomorrow', duration: '2 hrs', status: 'Scheduled' },
];

// ---- Student Parking History (for Pranay S B) ----
export const studentHistory = [
  { date: 'May 23, 2026', entryTime: '09:14 AM', exitTime: '12:45 PM', duration: '3h 31m', zone: 'Lot B', amount: 105 },
  { date: 'May 22, 2026', entryTime: '08:45 AM', exitTime: '05:30 PM', duration: '8h 45m', zone: 'Lot B', amount: 175 },
  { date: 'May 21, 2026', entryTime: '09:02 AM', exitTime: '04:15 PM', duration: '7h 13m', zone: 'Lot B', amount: 145 },
  { date: 'May 20, 2026', entryTime: '08:30 AM', exitTime: '01:00 PM', duration: '4h 30m', zone: 'Lot B', amount: 90 },
  { date: 'May 19, 2026', entryTime: '10:15 AM', exitTime: '03:45 PM', duration: '5h 30m', zone: 'Lot B', amount: 110 },
];

// ---- Faculty Parking History (for Dr. Meera Nair) ----
export const facultyHistory = [
  { date: 'Today', entryTime: '09:25 AM', exitTime: '-', duration: 'In Progress', zone: 'Lot A', spot: 'A-12' },
  { date: 'May 22, 2026', entryTime: '09:05 AM', exitTime: '05:40 PM', duration: '8h 35m', zone: 'Lot A', spot: 'A-12' },
  { date: 'May 21, 2026', entryTime: '08:55 AM', exitTime: '06:10 PM', duration: '9h 15m', zone: 'Lot A', spot: 'A-12' },
  { date: 'May 20, 2026', entryTime: '09:12 AM', exitTime: '05:15 PM', duration: '8h 03m', zone: 'Lot A', spot: 'A-12' },
  { date: 'May 19, 2026', entryTime: '09:30 AM', exitTime: '04:50 PM', duration: '7h 20m', zone: 'Lot A', spot: 'A-12' },
];

// ---- Notifications ----
export const notifications = [
  { id: 1, type: 'alert', title: 'Blacklisted Vehicle Detected', message: 'DL04XY1234 attempted entry at Gate C', time: '2 min ago', read: false },
  { id: 2, type: 'warning', title: 'Lot B Near Capacity', message: 'Occupancy at 91% — overflow routing activated', time: '15 min ago', read: false },
  { id: 3, type: 'info', title: 'Pricing Update', message: 'Placement week surge pricing applied to Lot B', time: '1 hr ago', read: true },
  { id: 4, type: 'success', title: 'Daily Report Ready', message: 'May 22 analytics report generated', time: '3 hr ago', read: true },
  { id: 5, type: 'alert', title: 'Expired Permit Entry', message: 'AP07GH5561 (Vikram Reddy) flagged at Gate A', time: '4 hr ago', read: true },
];

// Utility: generate realistic time-series data
export function generateTimeSeries(points, min, max, trend = 'stable') {
  const data = [];
  let value = (min + max) / 2;
  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * (max - min) * 0.3;
    const trendFactor = trend === 'up' ? i * 0.5 : trend === 'down' ? -i * 0.5 : 0;
    value = Math.max(min, Math.min(max, value + noise + trendFactor));
    data.push(Math.round(value * 10) / 10);
  }
  return data;
}

// Utility: format currency
export function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

// Utility: format time ago
export function timeAgo(minutes) {
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hr ago`;
  return `${Math.floor(minutes / 1440)} days ago`;
}
