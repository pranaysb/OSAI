// ============================================
// OPTISENSE AI — Dashboard Router & Shell (Dynamic Roles)
// ============================================

import { renderANPR } from './pages/anpr.js';
import { renderParking } from './pages/parking.js';
import { renderPricing } from './pages/pricing.js';
import { renderInstitutional } from './pages/institutional.js';
import { renderLogistics } from './pages/logistics.js';
import { renderAnalytics } from './pages/analytics.js';

// Setup current role from localStorage or default to admin
window.currentRole = localStorage.getItem('currentRole') || 'admin';

const pages = {
  anpr: { title: 'ANPR Intelligence', render: renderANPR },
  parking: { title: 'Smart Parking', render: renderParking },
  pricing: { title: 'Dynamic Pricing', render: renderPricing },
  institutional: { title: 'Institutional Dashboard', render: renderInstitutional },
  logistics: { title: 'Logistics & Cargo', render: renderLogistics },
  analytics: { title: 'Analytics Dashboard', render: renderAnalytics },
};

// Role configuration
const roleConfig = {
  admin: {
    sidebar: [
      { id: 'anpr', label: 'ANPR Intelligence', icon: 'anpr', badge: '3' },
      { id: 'parking', label: 'Smart Parking', icon: 'parking' },
      { id: 'pricing', label: 'Dynamic Pricing', icon: 'pricing', badge: 'SURGE', badgeColor: 'var(--amber-500)' },
      { id: 'institutional', label: 'User Directory', icon: 'institutional' },
      { id: 'logistics', label: 'Logistics & Cargo', icon: 'logistics' },
      { id: 'analytics', label: 'Analytics', icon: 'analytics' }
    ],
    defaultPage: 'anpr',
    user: { name: 'Pranay S B', role: 'System Admin', avatar: 'PS' }
  },
  security: {
    sidebar: [
      { id: 'anpr', label: 'CCTV Plate Patrol', icon: 'anpr', badge: '3' },
      { id: 'parking', label: 'Parking Enforcement', icon: 'parking' },
      { id: 'institutional', label: 'Gate Controls', icon: 'institutional' },
      { id: 'logistics', label: 'Logistics Check-in', icon: 'logistics' }
    ],
    defaultPage: 'anpr',
    user: { name: 'Naveen Hegde', role: 'Security Chief', avatar: 'NH' }
  },
  student: {
    sidebar: [
      { id: 'parking', label: 'Parking Finder', icon: 'parking' },
      { id: 'institutional', label: 'Student Portal', icon: 'institutional' }
    ],
    defaultPage: 'parking',
    user: { name: 'Pranay S B', role: 'CS Student', avatar: 'PS' }
  },
  faculty: {
    sidebar: [
      { id: 'parking', label: 'My Spot (A-12)', icon: 'parking' },
      { id: 'institutional', label: 'Faculty Portal', icon: 'institutional' }
    ],
    defaultPage: 'institutional',
    user: { name: 'Dr. Meera Nair', role: 'Physics Professor', avatar: 'MN' }
  }
};

const content = document.getElementById('dashboard-content');
const pageTitle = document.getElementById('page-title');
const navContainer = document.querySelector('.sidebar-nav');
const sidebarUserAvatar = document.querySelector('.sidebar-avatar');
const sidebarUserName = document.querySelector('.sidebar-user-name');
const sidebarUserRole = document.querySelector('.sidebar-user-role');
const roleSelector = document.getElementById('role-selector');

// SVG icons mapping
const iconMap = {
  anpr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  parking: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`,
  pricing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  institutional: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  logistics: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  analytics: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
};

function renderSidebar() {
  const config = roleConfig[window.currentRole];
  
  // Update footer profile details
  if (sidebarUserAvatar) sidebarUserAvatar.textContent = config.user.avatar;
  if (sidebarUserName) sidebarUserName.textContent = config.user.name;
  if (sidebarUserRole) sidebarUserRole.textContent = config.user.role;
  
  // Rebuild navigation list
  navContainer.innerHTML = '';
  
  // Render section title
  const secTitle = document.createElement('div');
  secTitle.className = 'sidebar-section-label';
  secTitle.textContent = window.currentRole === 'admin' ? 'Monitoring' : 'Operational Workspace';
  navContainer.appendChild(secTitle);
  
  config.sidebar.forEach((item, index) => {
    // Add spacer before Analytics if it's admin role
    if (window.currentRole === 'admin' && index === 3) {
      const mgtLabel = document.createElement('div');
      mgtLabel.className = 'sidebar-section-label';
      mgtLabel.textContent = 'Management';
      navContainer.appendChild(mgtLabel);
    } else if (window.currentRole === 'admin' && index === 5) {
      const insightsLabel = document.createElement('div');
      insightsLabel.className = 'sidebar-section-label';
      insightsLabel.textContent = 'Insights';
      navContainer.appendChild(insightsLabel);
    }
    
    const link = document.createElement('a');
    link.className = 'sidebar-link';
    link.dataset.page = item.id;
    link.href = `#${item.id}`;
    
    const svgIcon = iconMap[item.icon] || '';
    link.innerHTML = `
      ${svgIcon}
      <span>${item.label}</span>
    `;
    
    if (item.badge) {
      const badge = document.createElement('span');
      badge.className = 'badge-count';
      badge.textContent = item.badge;
      if (item.badgeColor) {
        badge.style.background = item.badgeColor;
      }
      link.appendChild(badge);
    }
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = item.id;
    });
    
    navContainer.appendChild(link);
  });
}

function navigate(page) {
  const config = roleConfig[window.currentRole];
  
  // Check authorization - if page not in active sidebar, redirect to default page
  const isAuthorized = config.sidebar.some(item => item.id === page);
  if (!isAuthorized) {
    window.location.hash = config.defaultPage;
    return;
  }
  
  // Fetch active item label for the header
  const sidebarItem = config.sidebar.find(item => item.id === page);
  const displayTitle = sidebarItem ? sidebarItem.label : pages[page].title;

  // Update header text
  pageTitle.textContent = displayTitle;
  document.title = `${displayTitle} — Optisense AI`;

  // Update active links in sidebar
  const sidebarLinks = navContainer.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Render page with smooth fade
  content.style.opacity = '0';
  content.style.transform = 'translateY(6px)';

  setTimeout(() => {
    content.innerHTML = '';
    pages[page].render(content);
    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';
  }, 100);
}

// Content transition styles
content.style.transition = 'opacity 0.15s ease, transform 0.15s ease';

// Handle role selection change
if (roleSelector) {
  roleSelector.value = window.currentRole;
  roleSelector.addEventListener('change', (e) => {
    const newRole = e.target.value;
    window.currentRole = newRole;
    localStorage.setItem('currentRole', newRole);
    
    // Re-render sidebar & navigate to default view
    renderSidebar();
    const config = roleConfig[newRole];
    window.location.hash = config.defaultPage;
    
    // Force re-routing
    onHashChange();
  });
}

// Handle hash changes
function onHashChange() {
  const config = roleConfig[window.currentRole];
  const hash = window.location.hash.slice(1) || config.defaultPage;
  navigate(hash);
}

window.addEventListener('hashchange', onHashChange);

// Initialize App
renderSidebar();
onHashChange();

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// Close sidebar on content click (mobile)
content.addEventListener('click', () => {
  sidebar.classList.remove('open');
});

// Global search
const searchInput = document.getElementById('global-search');
if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.blur();
      searchInput.value = '';
    }
  });
}
