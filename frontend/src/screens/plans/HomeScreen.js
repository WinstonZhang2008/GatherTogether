// ─── Gather App — HomeScreen.js ─────────────────────────────────────────────
// Vanilla JS — no imports needed. Works via a plain <script src="HomeScreen.js"> tag.

(function () {

  function showHomeScreen(root, navigate) {
    // Fallback: If called without explicitly passing the root element, find it automatically
    if (!root) {
      root = document.getElementById('root');
    }

    // ── Styles ────────────────────────────────────────────────────────────────
    var styleId = 'gather-home-styles';
    if (!document.getElementById(styleId)) {
      var style = document.createElement('style');
      style.id  = styleId;
      style.textContent = [
        '#home-page { min-height:100vh; background:#F6FAF8; display:flex; flex-direction:column; max-width:480px; margin:0 auto; }',
        '#home-header { padding:24px 20px 16px; display:flex; align-items:center; justify-content:space-between; }',
        '.home-brand { font-family:Syne,sans-serif; font-size:22px; font-weight:800; color:#111714; letter-spacing:-0.5px; }',
        '.home-avatar { width:36px; height:36px; border-radius:50%; background:#1D9E75; display:flex; align-items:center; justify-content:center; font-family:Syne,sans-serif; font-size:13px; font-weight:700; color:#fff; cursor:pointer; }',
        '#home-body { padding:0 20px; flex:1; }',
        '.home-greeting { font-family:Syne,sans-serif; font-size:24px; font-weight:700; color:#111714; margin-bottom:4px; }',
        '.home-date { font-size:13px; color:#9AADA6; margin-bottom:24px; }',
        '.home-section-label { font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:0.05em; color:#9AADA6; margin-bottom:12px; }',
        '.home-plan-card { background:#fff; border:1px solid #D6E8E1; border-radius:16px; padding:16px; margin-bottom:12px; cursor:pointer; transition:box-shadow .15s; }',
        '.home-plan-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.06); }',
        '.home-plan-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }',
        '.home-plan-title { font-family:Syne,sans-serif; font-size:15px; font-weight:700; color:#111714; }',
        '.home-badge { font-size:10px; font-weight:500; padding:3px 8px; border-radius:20px; }',
        '.home-badge-pending { background:#FAEEDA; color:#633806; }',
        '.home-badge-confirmed { background:#E1F5EE; color:#085041; }',
        '.home-plan-meta { font-size:12px; color:#9AADA6; margin-bottom:10px; }',
        '.home-avatars { display:flex; gap:4px; }',
        '.home-mini-avatar { width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:600; }',
        '#home-fab { position:fixed; bottom:28px; right:28px; width:56px; height:56px; background:#1D9E75; border:none; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(29,158,117,0.35); transition:background .15s; }',
        '#home-fab:hover { background:#0F6E52; }',
      ].join('\n');
      document.head.appendChild(style);
    }

    // ── Date Formatting ───────────────────────────────────────────────────────
    var now   = new Date();
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dateStr = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();

    // ── Account Dynamic Greeting ──────────────────────────────────────────────
    // Check for a globally available account object first, then fall back
    var firstName = (window.account && window.account.firstName) || "";
    var greetingStr = firstName ? 'Hey ' + firstName + ' 👋' : 'Hey there 👋';

    // ── HTML Injections ───────────────────────────────────────────────────────
    root.innerHTML = [
      '<div id="home-page">',
        '<div id="home-header">',
          '<span class="home-brand">Gather</span>',
          '<div class="home-avatar" id="home-logout-trigger">AJ</div>',
        '</div>',
        '<div id="home-body">',
          '<div class="home-greeting">' + greetingStr + '</div>',
          '<div class="home-date">' + dateStr + '</div>',

          '<div class="home-section-label">Upcoming plans</div>',

          '<div class="home-plan-card">',
            '<div class="home-plan-top">',
              '<span class="home-plan-title">Dinner — Friday night</span>',
              '<span class="home-badge home-badge-pending">2 pending</span>',
            '</div>',
            '<div class="home-plan-meta">Fri Jun 20 · Italian or Thai</div>',
            '<div class="home-avatars">',
              '<div class="home-mini-avatar" style="background:#EEEDFE;color:#3C3489;">AJ</div>',
              '<div class="home-mini-avatar" style="background:#E1F5EE;color:#085041;">KL</div>',
              '<div class="home-mini-avatar" style="background:#FAECE7;color:#712B13;">RM</div>',
              '<div class="home-mini-avatar" style="background:#FBEAF0;color:#72243E;">+1</div>',
            '</div>',
          '</div>',

          '<div class="home-plan-card">',
            '<div class="home-plan-top">',
              '<span class="home-plan-title">Weekend hike</span>',
              '<span class="home-badge home-badge-confirmed">Confirmed</span>',
            '</div>',
            '<div class="home-plan-meta">Sun Jun 22 · 9:00 AM · Mission Peak</div>',
            '<div class="home-avatars">',
              '<div class="home-mini-avatar" style="background:#E1F5EE;color:#085041;">KL</div>',
              '<div class="home-mini-avatar" style="background:#FAECE7;color:#712B13;">RM</div>',
            '</div>',
          '</div>',

          '<div class="home-section-label" style="margin-top:24px;">Past</div>',
          '<div style="font-size:13px;color:#9AADA6;padding:4px 0;">Taco Tuesday — Jun 10 · 4 people</div>',
        '</div>',

        '<button id="home-fab" title="New plan">',
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
        '</button>',
      '</div>',
    ].join('');

    // ── Event Listeners & Routing Logic ──────────────────────────────────────
    
    // Floating Action Button
    document.getElementById('home-fab').addEventListener('click', function () {
      if (typeof navigate === 'function') {
        navigate('createPlan');;
      } else if (typeof window.showCreatePlanScreen === 'function') {
        window.showCreatePlanScreen();
      }
    });

    // Logout Functionality: Clicking the profile avatar drops you back to Login
    var avatarBtn = document.getElementById('home-logout-trigger');
    if (avatarBtn) {
      avatarBtn.addEventListener('click', function () {
        if (typeof navigate === 'function') {
          navigate('login');
        } else if (typeof window.showLoginScreen === 'function') {
          window.showLoginScreen();
        }
      });
    }
  }

  // ── Expose globally to window ──────────────────────────────────────────
  window.showHomeScreen = showHomeScreen;

})();