// Displays a form for creating a new plan (name, category, date range, invites).
// Called by main.js via: showCreatePlanScreen(root, navigate)
// Exposed globally as: window.showCreatePlanScreen
//
// Flow:
//   HomeScreen → (tap + button) → CreatePlanScreen → (submit) → HomeScreen
//
// API call:
//   window.api.createPlan(planData) — defined in services/api.js
// ────────────────────────────────────────────────────────────────────────────

(function () {

  // ── 1. Styles ─────────────────────────────────────────────────────────────
  // Injected once into <head>. The styleId guard prevents duplicates
  // if the user navigates away and back to this screen.

  var styleId = 'gather-createplan-styles';

  function injectStyles() {
    if (document.getElementById(styleId)) return; // already injected

    var style = document.createElement('style');
    style.id  = styleId;
    style.textContent = [

      // ── Page shell ──
      '#cp-page { min-height:100vh; background:#F6FAF8; display:flex; flex-direction:column; max-width:480px; margin:0 auto; padding-bottom:40px; }',

      // ── Header bar ──
      '#cp-header { display:flex; align-items:center; gap:12px; padding:20px 20px 12px; }',
      '#cp-back-btn { background:none; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:10px; color:#111714; transition:background .15s; flex-shrink:0; }',
      '#cp-back-btn:hover { background:#E1F5EE; }',
      '#cp-header-title { font-family:Syne,sans-serif; font-size:18px; font-weight:700; color:#111714; }',

      // ── Scrollable form body ──
      '#cp-body { padding:0 20px; flex:1; }',

      // ── Section label ──
      '.cp-section-label { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:#9AADA6; margin:24px 0 10px; }',

      // ── Field ──
      '.cp-field { margin-bottom:16px; }',
      '.cp-field label { display:block; font-size:13px; font-weight:500; color:#111714; margin-bottom:6px; }',
      '.cp-input { width:100%; height:46px; padding:0 14px; border:1.5px solid #D6E8E1; border-radius:10px; font-size:14px; font-family:Inter,sans-serif; color:#111714; background:#fff; outline:none; transition:border-color .15s, box-shadow .15s; }',
      '.cp-input:focus { border-color:#1D9E75; box-shadow:0 0 0 3px rgba(29,158,117,0.12); }',
      '.cp-input.cp-invalid { border-color:#C0392B !important; box-shadow:0 0 0 3px rgba(192,57,43,0.1) !important; }',
      '.cp-input::placeholder { color:#9AADA6; }',
      '.cp-field-err { font-size:12px; color:#C0392B; margin-top:5px; display:none; }',

      // ── Textarea ──
      '.cp-textarea { width:100%; padding:12px 14px; border:1.5px solid #D6E8E1; border-radius:10px; font-size:14px; font-family:Inter,sans-serif; color:#111714; background:#fff; outline:none; resize:none; transition:border-color .15s, box-shadow .15s; }',
      '.cp-textarea:focus { border-color:#1D9E75; box-shadow:0 0 0 3px rgba(29,158,117,0.12); }',
      '.cp-textarea::placeholder { color:#9AADA6; }',

      // ── Category pill grid ──
      // Users tap a pill to select the plan type (dinner, hike, movie, etc.)
      '#cp-category-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:4px; }',
      '.cp-pill { height:40px; border:1.5px solid #D6E8E1; border-radius:20px; background:#fff; font-size:13px; font-weight:500; font-family:Inter,sans-serif; color:#4A5751; cursor:pointer; transition:all .15s; display:flex; align-items:center; justify-content:center; gap:6px; }',
      '.cp-pill:hover { border-color:#1D9E75; color:#1D9E75; background:#F0FAF6; }',
      '.cp-pill.cp-pill-selected { border-color:#1D9E75; background:#1D9E75; color:#fff; }',

      // ── Date row (start + end side by side) ──
      '#cp-date-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }',

      // ── Invite chips ──
      // Shows added invitees as removable chips above the input
      '#cp-invite-chips { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; min-height:0; }',
      '.cp-chip { display:flex; align-items:center; gap:6px; background:#E1F5EE; border-radius:20px; padding:4px 10px 4px 12px; font-size:13px; color:#085041; font-weight:500; }',
      '.cp-chip-remove { background:none; border:none; cursor:pointer; color:#085041; display:flex; align-items:center; padding:0; opacity:0.6; }',
      '.cp-chip-remove:hover { opacity:1; }',
      '#cp-invite-row { display:flex; gap:8px; }',
      '#cp-invite-add { height:46px; padding:0 16px; background:#E1F5EE; border:1.5px solid #9FE1CB; border-radius:10px; font-size:13px; font-weight:600; font-family:Inter,sans-serif; color:#085041; cursor:pointer; white-space:nowrap; transition:background .15s; }',
      '#cp-invite-add:hover { background:#C8F0E2; }',

      // ── Visibility toggle (public / private) ──
      '#cp-visibility-row { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:4px; }',
      '.cp-vis-btn { height:44px; border:1.5px solid #D6E8E1; border-radius:10px; background:#fff; font-size:13px; font-weight:500; font-family:Inter,sans-serif; color:#4A5751; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all .15s; }',
      '.cp-vis-btn:hover { border-color:#1D9E75; color:#1D9E75; }',
      '.cp-vis-btn.cp-vis-selected { border-color:#1D9E75; background:#E1F5EE; color:#085041; font-weight:600; }',

      // ── Error banner (shown if API call fails) ──
      '#cp-error-banner { display:none; background:#FBEAEA; border:1px solid #F5C6C6; border-radius:10px; padding:12px 14px; font-size:13px; color:#C0392B; margin-bottom:16px; align-items:center; gap:8px; }',

      // ── Submit button ──
      '#cp-submit { width:100%; height:52px; background:#1D9E75; color:#fff; border:none; border-radius:14px; font-family:Syne,sans-serif; font-size:16px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .15s; margin-top:28px; }',
      '#cp-submit:hover:not(:disabled) { background:#0F6E52; }',
      '#cp-submit:disabled { opacity:0.6; cursor:not-allowed; }',
      '#cp-spinner { display:none; width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }',

    ].join('\n');

    document.head.appendChild(style);
  }

  // ── 2. Category options ───────────────────────────────────────────────────
  // Each entry has an emoji icon and a label. Add or remove as needed.

  var CATEGORIES = [
    { icon: '🍽️', label: 'Dinner'  },
    { icon: '🥾', label: 'Hike'    },
    { icon: '🎬', label: 'Movie'   },
    { icon: '☕', label: 'Coffee'  },
    { icon: '🎉', label: 'Party'   },
    { icon: '✈️', label: 'Trip'    },
    { icon: '🎮', label: 'Gaming'  },
    { icon: '🏖️', label: 'Beach'   },
    { icon: '🍕', label: 'Other'   },
  ];

  // ── 3. Build the screen HTML ──────────────────────────────────────────────
  // Builds the full page as an HTML string and injects it into root.
  // All interactive wiring happens in wireUpLogic() below.

  function buildHTML() {
    // Category pill HTML — one pill per category
    var pillsHTML = CATEGORIES.map(function(cat) {
      return [
        '<button class="cp-pill" data-category="' + cat.label + '" type="button">',
          '<span>' + cat.icon + '</span>',
          '<span>' + cat.label + '</span>',
        '</button>',
      ].join('');
    }).join('');

    return [
      '<div id="cp-page">',

        // ── Header ──
        '<div id="cp-header">',
          '<button id="cp-back-btn" type="button" aria-label="Go back">',
            '<svg width="20" height="20" viewBox="0 0 20 20" fill="none">',
              '<path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
            '</svg>',
          '</button>',
          '<span id="cp-header-title">New plan</span>',
        '</div>',

        '<div id="cp-body">',

          // ── Error banner ──
          '<div id="cp-error-banner">',
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#C0392B" stroke-width="1.5"/><path d="M8 5v3.5M8 11h.01" stroke="#C0392B" stroke-width="1.5" stroke-linecap="round"/></svg>',
            '<span id="cp-error-text"></span>',
          '</div>',

          // ── Plan name ──
          '<div class="cp-section-label">Plan details</div>',
          '<div class="cp-field">',
            '<label for="cp-name">Plan name</label>',
            '<input class="cp-input" type="text" id="cp-name" placeholder="e.g. Friday night dinner" maxlength="60" />',
            '<div class="cp-field-err" id="cp-name-err">Give your plan a name.</div>',
          '</div>',

          // ── Category pills ──
          '<div class="cp-field">',
            '<label>Category</label>',
            '<div id="cp-category-grid">' + pillsHTML + '</div>',
            '<div class="cp-field-err" id="cp-category-err">Pick a category.</div>',
          '</div>',

          // ── Notes / description ──
          '<div class="cp-field">',
            '<label for="cp-notes">Notes <span style="color:#9AADA6;font-weight:400;">(optional)</span></label>',
            '<textarea class="cp-textarea" id="cp-notes" rows="3" placeholder="Any details the group should know…"></textarea>',
          '</div>',

          // ── Date range ──
          '<div class="cp-section-label">When</div>',
          '<div id="cp-date-row">',
            '<div class="cp-field">',
              '<label for="cp-date-start">Earliest date</label>',
              '<input class="cp-input" type="date" id="cp-date-start" />',
              '<div class="cp-field-err" id="cp-date-err">Pick a start date.</div>',
            '</div>',
            '<div class="cp-field">',
              '<label for="cp-date-end">Latest date</label>',
              '<input class="cp-input" type="date" id="cp-date-end" />',
            '</div>',
          '</div>',

          // ── Invite people ──
          '<div class="cp-section-label">Invite people</div>',
          '<div id="cp-invite-chips"></div>',
          '<div class="cp-field">',
            '<div id="cp-invite-row">',
              '<input class="cp-input" type="email" id="cp-invite-input" placeholder="friend@email.com" />',
              '<button id="cp-invite-add" type="button">Add</button>',
            '</div>',
            '<div class="cp-field-err" id="cp-invite-err">Enter a valid email address.</div>',
          '</div>',

          // ── Visibility ──
          '<div class="cp-section-label">Who can join?</div>',
          '<div id="cp-visibility-row">',
            '<button class="cp-vis-btn cp-vis-selected" data-vis="private" type="button">',
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
              'Invite only',
            '</button>',
            '<button class="cp-vis-btn" data-vis="public" type="button">',
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.4"/><path d="M7 2c-1.5 1.5-2 3-2 5s.5 3.5 2 5M7 2c1.5 1.5 2 3 2 5s-.5 3.5-2 5M2 7h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
              'Anyone with link',
            '</button>',
          '</div>',

          // ── Submit ──
          '<button id="cp-submit" type="button">',
            '<span id="cp-btn-text">Create plan</span>',
            '<span id="cp-spinner"></span>',
          '</button>',

        '</div>',
      '</div>',
    ].join('');
  }

  // ── 4. Wire up logic ──────────────────────────────────────────────────────
  // All event listeners, state tracking, validation, and the API call.
  // Runs after the HTML has been injected into root.

  function wireUpLogic(navigate) {

    // ── Element references ──
    var nameInput    = document.getElementById('cp-name');
    var nameErr      = document.getElementById('cp-name-err');
    var notesInput   = document.getElementById('cp-notes');
    var dateStart    = document.getElementById('cp-date-start');
    var dateEnd      = document.getElementById('cp-date-end');
    var dateErr      = document.getElementById('cp-date-err');
    var categoryErr  = document.getElementById('cp-category-err');
    var inviteInput  = document.getElementById('cp-invite-input');
    var inviteAddBtn = document.getElementById('cp-invite-add');
    var inviteChips  = document.getElementById('cp-invite-chips');
    var inviteErr    = document.getElementById('cp-invite-err');
    var submitBtn    = document.getElementById('cp-submit');
    var btnText      = document.getElementById('cp-btn-text');
    var spinner      = document.getElementById('cp-spinner');
    var errorBanner  = document.getElementById('cp-error-banner');
    var errorText    = document.getElementById('cp-error-text');
    var backBtn      = document.getElementById('cp-back-btn');

    // ── State ──
    // Tracks user selections that aren't stored directly in input values
    var selectedCategory = null;       // e.g. 'Dinner'
    var selectedVis      = 'private';  // 'private' or 'public'
    var invitees         = [];         // array of email strings

    // ── Back button ──
    // Navigates back to home without saving anything
    backBtn.addEventListener('click', function() {
      if (typeof navigate === 'function') {
        navigate('home');
      } else if (typeof window.showHomeScreen === 'function') {
        window.showHomeScreen();
      }
    });

    // ── Category pill selection ──
    // Tapping a pill sets selectedCategory and highlights it
    var pills = document.querySelectorAll('.cp-pill');
    pills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        pills.forEach(function(p) { p.classList.remove('cp-pill-selected'); });
        pill.classList.add('cp-pill-selected');
        selectedCategory = pill.getAttribute('data-category');
        categoryErr.style.display = 'none'; // clear any existing error
      });
    });

    // ── Visibility toggle ──
    // Only one button active at a time
    var visBtns = document.querySelectorAll('.cp-vis-btn');
    visBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        visBtns.forEach(function(b) { b.classList.remove('cp-vis-selected'); });
        btn.classList.add('cp-vis-selected');
        selectedVis = btn.getAttribute('data-vis');
      });
    });

    // ── Invite chips ──
    // addInvitee() validates and adds an email to the invitees array,
    // then re-renders the chip list.

    function isValidEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function addInvitee() {
      var email = inviteInput.value.trim().toLowerCase();

      if (!isValidEmail(email)) {
        inviteErr.textContent   = 'Enter a valid email address.';
        inviteErr.style.display = 'block';
        return;
      }
      if (invitees.indexOf(email) !== -1) {
        // Don't add the same person twice
        inviteErr.textContent   = 'Already added.';
        inviteErr.style.display = 'block';
        return;
      }

      inviteErr.style.display = 'none';
      invitees.push(email);
      renderChips();
      inviteInput.value = '';
      inviteInput.focus();
    }

    function removeInvitee(email) {
      invitees = invitees.filter(function(e) { return e !== email; });
      renderChips();
    }

    function renderChips() {
      // Rebuild chips from the invitees array each time it changes
      inviteChips.innerHTML = invitees.map(function(email) {
        return [
          '<div class="cp-chip">',
            '<span>' + email + '</span>',
            '<button class="cp-chip-remove" data-email="' + email + '" type="button" aria-label="Remove ' + email + '">',
              '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
            '</button>',
          '</div>',
        ].join('');
      }).join('');

      // Re-wire remove buttons after every render
      inviteChips.querySelectorAll('.cp-chip-remove').forEach(function(btn) {
        btn.addEventListener('click', function() {
          removeInvitee(btn.getAttribute('data-email'));
        });
      });
    }

    inviteAddBtn.addEventListener('click', addInvitee);

    // Pressing Enter in the invite field triggers addInvitee
    inviteInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); addInvitee(); }
    });

    inviteInput.addEventListener('input', function() {
      inviteErr.style.display = 'none';
    });

    // ── Date min values ──
    // Prevent picking dates in the past
    var today = new Date().toISOString().split('T')[0];
    dateStart.min = today;
    dateEnd.min   = today;

    // If start date changes, bump end date minimum to match
    dateStart.addEventListener('change', function() {
      dateEnd.min = dateStart.value || today;
      if (dateEnd.value && dateEnd.value < dateStart.value) {
        dateEnd.value = dateStart.value;
      }
    });

    // ── Validation ──
    // Checks all required fields. Returns true if everything passes.
    function validate() {
      var ok = true;

      if (!nameInput.value.trim()) {
        nameInput.classList.add('cp-invalid');
        nameErr.style.display = 'block';
        ok = false;
      } else {
        nameInput.classList.remove('cp-invalid');
        nameErr.style.display = 'none';
      }

      if (!selectedCategory) {
        categoryErr.style.display = 'block';
        ok = false;
      } else {
        categoryErr.style.display = 'none';
      }

      if (!dateStart.value) {
        dateStart.classList.add('cp-invalid');
        dateErr.style.display = 'block';
        ok = false;
      } else {
        dateStart.classList.remove('cp-invalid');
        dateErr.style.display = 'none';
      }

      return ok;
    }

    // Clear name error while the user is typing a fix
    nameInput.addEventListener('input', function() {
      if (nameInput.classList.contains('cp-invalid')) {
        nameInput.classList.remove('cp-invalid');
        nameErr.style.display = 'none';
      }
    });

    // ── Loading helpers ──
    function setLoading(on) {
      submitBtn.disabled    = on;
      btnText.textContent   = on ? 'Creating…' : 'Create plan';
      spinner.style.display = on ? 'inline-block' : 'none';
    }

    function showError(msg) {
      errorText.textContent     = msg;
      errorBanner.style.display = 'flex';
      window.scrollTo(0, 0); // scroll to top so the banner is visible
    }

    function clearError() {
      errorBanner.style.display = 'none';
    }

    // ── Submit ────────────────────────────────────────────────────────────
    // Validates → builds planData object → calls window.api.createPlan()
    // On success: navigate to home
    // On failure: show error banner with backend's message

    submitBtn.addEventListener('click', function() {
      clearError();
      if (!validate()) return;

      setLoading(true);

      // The object shape should match what your Flask backend expects
      var planData = {
        name:       nameInput.value.trim(),
        category:   selectedCategory,
        notes:      notesInput.value.trim(),
        dateStart:  dateStart.value,
        dateEnd:    dateEnd.value || null,  // optional
        invitees:   invitees,               // array of email strings
        visibility: selectedVis,
      };

      // window.api.createPlan is defined in frontend/src/services/api.js
      window.api.createPlan(planData)
        .then(function(data) {
          setLoading(false);
          if (data.success) {
            if (typeof navigate === 'function') {
              navigate('home');
            } else if (typeof window.showHomeScreen === 'function') {
              window.showHomeScreen();
            }
          } else {
            showError(data.message || 'Something went wrong. Please try again.');
          }
        })
        .catch(function() {
          // Fires if the server is unreachable (network error, server down, etc.)
          setLoading(false);
          showError('Could not reach the server. Check your connection and try again.');
        });
    });
  }

  // ── 5. Main screen function ───────────────────────────────────────────────
  // Entry point called by main.js. Injects styles, renders HTML, wires logic.

  function showCreatePlanScreen(root, navigate) {
    if (!root) root = document.getElementById('root'); // fallback

    injectStyles();               // inject CSS once
    root.innerHTML = buildHTML(); // render the screen
    wireUpLogic(navigate);        // attach all event listeners
  }

  // ── 6. Expose globally ───────────────────────────────────────────────────
  // main.js calls window.showCreatePlanScreen inside its switch statement.
  // This line is what makes that work.

  window.showCreatePlanScreen = showCreatePlanScreen;

})();