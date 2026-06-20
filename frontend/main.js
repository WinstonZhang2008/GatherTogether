// ─── Gather App — main.js ───────────────────────────────────────────────────
// Entry point. Handles routing between screens.
// Add new screens here as you build them.

// ── Global styles (shared across all screens) ────────────────────────────────
var globalStyle = document.createElement('style');
globalStyle.textContent = [
  '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
  'html, body { height: 100%; background: #F6FAF8; font-family: Inter, sans-serif; -webkit-font-smoothing: antialiased; }',
  '@keyframes spin    { to { transform: rotate(360deg); } }',
  '@keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }',
].join('\n');
document.head.appendChild(globalStyle);

// ── Google Fonts ─────────────────────────────────────────────────────────────
var fontLink = document.createElement('link');
fontLink.rel  = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500&display=swap';
document.head.appendChild(fontLink);

// ── Router ────────────────────────────────────────────────────────────────────
// Call navigate('screenName') from any screen to switch views.

function navigate(screen) {
  var root = document.getElementById('root');
  root.innerHTML = '';

  switch (screen) {
    case 'login':
      showLoginScreen(root, navigate);
      break;
    case 'signup':
      showSignupScreen(root, navigate);
      break;
    case 'home':
      showHomeScreen(root, navigate);
      break;
    case 'createPlan':
      showCreatePlanScreen(root, navigate);
      break;
    default:
      root.innerHTML = '<p style="padding:40px;color:#C0392B;">Screen "' + screen + '" not found.</p>';
  }
}

// ── Launch app on first load ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', function () {
  navigate('login');
});