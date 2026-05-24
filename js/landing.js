// ============================================
// OPTISENSE AI — Landing Page Interactivity
// Premium visual adjustments & dynamic previews
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar on Scroll
  const nav = document.getElementById('landing-nav');
  const checkScroll = () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check

  // Animate mini bar chart in hero preview
  const miniBars = document.querySelectorAll('#hero-bars .mini-bar');
  if (miniBars.length > 0) {
    setInterval(() => {
      miniBars.forEach(bar => {
        // Shift heights slightly to simulate live feed updates
        const currentHeight = parseFloat(bar.style.height);
        const diff = (Math.random() - 0.5) * 15;
        const newHeight = Math.max(10, Math.min(95, currentHeight + diff));
        bar.style.height = `${newHeight}%`;
      });
    }, 2000);
  }

  // Smooth scroll offsets for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 72;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 10;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
});
