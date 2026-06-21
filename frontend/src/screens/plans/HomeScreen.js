// ─── Gather App — HomeScreen.js ─────────────────────────────────────────────
// Vanilla JS — no imports needed. Works via a plain <script src="HomeScreen.js"> tag.

(function () {

  function showHomeScreen(root, navigate, plans) {
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
        '#home-body { padding:0 20px; flex:1; padding-bottom: 80px; }',
        '.home-greeting { font-family:Syne,sans-serif; font-size:24px; font-weight:700; color:#111714; margin-bottom:4px; }',
        '.home-date { font-size:13px; color:#9AADA6; margin-bottom:24px; }',
        '.home-section-label { font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:0.05em; color:#9AADA6; margin-top:24px; margin-bottom:12px; }',
        '.home-section-label:first-of-type { margin-top:0; }',
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
        '.home-empty-state { font-size:13px; color:#9AADA6; padding:12px 4px; font-style: italic; }',
        '#home-fab { position:fixed; bottom:28px; right:28px; width:56px; height:56px; background:#1D9E75; border:none; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(29,158,117,0.35); transition:background .15s; z-index:99; }',
        '#home-fab:hover { background:#0F6E52; }',
      ].join('\n');
      document.head.appendChild(style);
    }

    // ── Date Formatting & Tracking ───────────────────────────────────────────
    var now   = new Date();
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dateStr = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();

    // Reset timestamp clocks to accurately evaluate relative day changes
    var todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var tomorrowMidnight = todayMidnight + (24 * 60 * 60 * 1000);

    // ── Fetching Data Source ──────────────────────────────────────────────────
    // Fallbacks if arguments are empty: check global state or local storage
    if (!plans) {
      plans = window.gatherPlans || JSON.parse(localStorage.getItem('gather_plans')) || [];
    }

    // ── Sorting & Categorizing Plans ──────────────────────────────────────────
    var todayPlansHTML = [];
    var upcomingPlansHTML = [];
    var pastPlansHTML = [];

    plans.forEach(function (plan) {
      // Parse data string input securely into standard Javascript timestamps
      var planDate = new Date(plan.date);
      var planTimestamp = new Date(planDate.getFullYear(), planDate.getMonth(), planDate.getDate()).getTime();

      // Format clean meta lines (e.g. "Sat Jun 20 · 7:00 PM · Italian Spot")
      var formattedDate = days[planDate.getDay()].substring(0,3) + ' ' + months[planDate.getMonth()] + ' ' + planDate.getDate();
      var metaStr = formattedDate + (plan.time ? ' · ' + plan.time : '') + (plan.location ? ' · ' + plan.location : '');

      // Dynamic Avatar Rendering logic
      var avatarsHTML = '';
      if (plan.participants && plan.participants.length > 0) {
        avatarsHTML = '<div class="home-avatars">';
        plan.participants.forEach(function (p, index) {
          if (index < 3) {
            var bg = p.bg || '#EEEDFE';
            var color = p.color || '#3C3489';
            avatarsHTML += '<div class="home-mini-avatar" style="background:' + bg + ';color:' + color + ';">' + p.initials + '</div>';
          }
        });
        if (plan.participants.length > 3) {
          avatarsHTML += '<div class="home-mini-avatar" style="background:#FBEAF0;color:#72243E;">+' + (plan.participants.length - 3) + '</div>';
        }
        avatarsHTML += '</div>';
      }

      // Generate Card UI Markup
      var badgeClass = plan.status === 'confirmed' ? 'home-badge-confirmed' : 'home-badge-pending';
      var badgeText = plan.statusText || (plan.status === 'confirmed' ? 'Confirmed' : 'Pending');

      var cardHTML = [
        '<div class="home-plan-card" data-id="' + plan.id + '">',
          '<div class="home-plan-top">',
            '<span class="home-plan-title">' + plan.title + '</span>',
            '<span class="home-badge ' + badgeClass + '">' + badgeText + '</span>',
          '</div>',
          '<div class="home-plan-meta">' + metaStr + '</div>',
          avatarsHTML,
        '</div>'
      ].join('');

      // Bucket categorization check
      if (planTimestamp < todayMidnight) {
        pastPlansHTML.push(cardHTML);
      } else if (planTimestamp >= tomorrowMidnight) {
        upcomingPlansHTML.push(cardHTML);
      } else {
        todayPlansHTML.push(cardHTML);
      }
    });

    // ── Dynamic Greeting ──────────────────────────────────────────────────────
    var savedName = localStorage.getItem('gather_user_name');
    var firstName = savedName ? savedName.trim() : "there";
    var greetingStr = 'Hey ' + firstName + ' 👋';
    var userInitials = localStorage.getItem('gather_user_initials') || "??";

    // ── Account Dynamic Greeting & Initials ───────────────────────────────────
    var savedName = localStorage.getItem('gather_user_name');
    var firstName = savedName ? savedName.trim() : "there";
    var greetingStr = 'Hey ' + firstName + ' 👋';

    // 1. Grab the initials saved during signup (fallback to ?? if empty)
    var userInitials = localStorage.getItem('gather_user_initials') || "??";

    // ── Build HTML Injections ─────────────────────────────────────────────────
    root.innerHTML = [
      '<div id="home-page">',
        '<div id="home-header">',
          '<span class="home-brand">Gather</span>',
          //  Add the userInitials variable into the HTML string here:
          '<div class="home-avatar" id="home-logout-trigger">' + userInitials + '</div>',
        '</div>',
        '<div id="home-body">',
          '<div class="home-greeting">' + greetingStr + '</div>',
          '<div class="home-date">' + dateStr + '</div>',

          // TODAY SECTION
          '<div class="home-section-label">Today\'s plans</div>',
          todayPlansHTML.length ? todayPlansHTML.join('') : '<div class="home-empty-state">No plans for today.</div>',

          // UPCOMING SECTION
          '<div class="home-section-label">Upcoming plans</div>',
          upcomingPlansHTML.length ? upcomingPlansHTML.join('') : '<div class="home-empty-state">No upcoming plans scheduled.</div>',

          // PAST SECTION
          '<div class="home-section-label">Past plans</div>',
          pastPlansHTML.length ? pastPlansHTML.join('') : '<div class="home-empty-state">No past event history.</div>',
        '</div>',

        '<button id="home-fab" title="New plan">',
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
        '</button>',
      '</div>',
    ].join('');

    // ── Event Listeners & Routing Logic ──────────────────────────────────────
    document.getElementById('home-fab').addEventListener('click', function () {
      if (typeof navigate === 'function') {
        navigate('createPlan');
      } else if (typeof window.showCreatePlanScreen === 'function') {
        window.showCreatePlanScreen();
      }
    });

    var avatarBtn = document.getElementById('home-logout-trigger');
    if (avatarBtn) {
      avatarBtn.addEventListener('click', function () {
        localStorage.removeItem('gather_user_name'); // Clear saved user data on logout
        localStorage.removeItem('gather_user_initials');
        if (typeof navigate === 'function') {
          navigate('login');
        } else if (typeof window.showLoginScreen === 'function') {
          window.showLoginScreen();
        }
      });
    }
  }

  window.showHomeScreen = showHomeScreen;

})();