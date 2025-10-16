// hamburger menu toggle script
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navBar = document.querySelector('.nav-bar');

  // Toggle nav-bar on hamburger click
  hamburger.addEventListener('click', () => {
    navBar.classList.toggle('expanded');
    hamburger.classList.toggle('active');
  });

  // Close nav-bar when clicking outside
  document.addEventListener('click', (event) => {
    if (!navBar.contains(event.target) && !hamburger.contains(event.target) && navBar.classList.contains('expanded')) {
      navBar.classList.remove('expanded');
      hamburger.classList.remove('active');
    }
  });
});
