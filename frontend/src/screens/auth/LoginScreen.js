// ─── Gather Login Screen ────────────────────────────────────────────────────
// Vanilla JS — no imports needed. Works via a plain <script src="LoginScreen.js"> tag.
// Demo credentials: demo@gather.app / password123

(function () {

  // ── 1. Inject Google Fonts ──────────────────────────────────────────────
  var fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Syne:wght=700;800&family=Inter:wght=400;500&display=swap';
  document.head.appendChild(fontLink);

  // ── 2. Inject CSS ───────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '* { box-sizing: border-box; margin: 0; padding: 0; }',
    'html, body { height: 100%; background: #F6FAF8; font-family: Inter, sans-serif; -webkit-font-smoothing: antialiased; }',
    '@keyframes spin { to { transform: rotate(360deg); } }',
    '@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }',

    // Page layout
    '#gather-page { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; }',
    '@media(max-width:700px){ #gather-page { grid-template-columns:1fr; } #gather-left { display:none !important; } }',

    // Left panel
    '#gather-left { background:#1D9E75; display:flex; flex-direction:column; justify-content:space-between; padding:56px 48px; position:relative; overflow:hidden; }',
    '#gather-left::before { content:""; position:absolute; top:-120px; right:-120px; width:400px; height:400px; border-radius:50%; background:rgba(255,255,255,0.07); pointer-events:none; }',
    '#gather-left::after  { content:""; position:absolute; bottom:-80px; left:-60px;  width:280px; height:280px; border-radius:50%; background:rgba(255,255,255,0.05); pointer-events:none; }',

    '.g-brand { display:flex; align-items:center; gap:10px; position:relative; z-index:1; }',
    '.g-brand-icon { width:36px; height:36px; background:#fff; border-radius:10px; display:flex; align-items:center; justify-content:center; }',
    '.g-brand-name { font-family:Syne,sans-serif; font-size:22px; font-weight:800; color:#fff; letter-spacing:-0.5px; }',

    '.g-headline { font-family:Syne,sans-serif; font-size:40px; font-weight:800; line-height:1.1; color:#fff; letter-spacing:-1px; margin-bottom:18px; position:relative; z-index:1; }',
    '.g-headline em { font-style:normal; color:rgba(255,255,255,0.45); }',
    '.g-subtext { font-size:15px; color:rgba(255,255,255,0.75); line-height:1.65; max-width:290px; position:relative; z-index:1; }',

    '.g-testimonial { background:rgba(255,255,255,0.12); border-radius:16px; padding:20px 22px; position:relative; z-index:1; }',
    '.g-testimonial p { font-size:14px; color:rgba(255,255,255,0.9); line-height:1.6; margin-bottom:14px; }',
    '.g-tauthor { display:flex; align-items:center; gap:10px; }',
    '.g-avatar { width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; font-family:Syne,sans-serif; font-size:12px; font-weight:700; color:#fff; }',
    '.g-aname { font-size:13px; font-weight:500; color:#fff; }',
    '.g-arole { font-size:12px; color:rgba(255,255,255,0.55); }',

    // Right panel
    '#gather-right { display:flex; align-items:center; justify-content:center; padding:40px 32px; }',
    '#gather-card { width:100%; max-width:400px; animation:fadeUp .3s ease; }',

    // Error banner
    '#g-error-banner { display:none; background:#FBEAEA; border:1px solid #F5C6C6; border-radius:10px; padding:12px 14px; font-size:13px; color:#C0392B; margin-bottom:20px; align-items:center; gap:8px; }',

    // Heading
    '.g-heading { font-family:Syne,sans-serif; font-size:28px; font-weight:700; color:#111714; letter-spacing:-0.5px; margin-bottom:6px; }',
    '.g-sub { font-size:14px; color:#4A5751; margin-bottom:28px; }',
    '.g-sub a { color:#1D9E75; text-decoration:none; font-weight:500; }',

    // Fields
    '.g-field { margin-bottom:16px; }',
    '.g-field label { display:block; font-size:13px; font-weight:500; color:#111714; margin-bottom:6px; }',
    '.g-input-wrap { position:relative; }',
    '.g-input-wrap input { width:100%; height:46px; padding:0 42px 0 14px; border:1.5px solid #D6E8E1; border-radius:10px; font-size:14px; font-family:Inter,sans-serif; color:#111714; background:#fff; outline:none; transition:border-color .15s, box-shadow .15s; }',
    '.g-input-wrap input:focus { border-color:#1D9E75; box-shadow:0 0 0 3px rgba(29,158,117,0.12); }',
    '.g-input-wrap input.g-invalid { border-color:#C0392B !important; box-shadow:0 0 0 3px rgba(192,57,43,0.1) !important; }',
    '.g-input-wrap input::placeholder { color:#9AADA6; }',
    '.g-icon-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; display:flex; padding:4px; color:#9AADA6; }',
    '.g-icon-btn:hover { color:#4A5751; }',
    '.g-field-err { font-size:12px; color:#C0392B; margin-top:5px; display:none; }',

    // Forgot
    '.g-forgot { display:flex; justify-content:flex-end; margin-top:-6px; margin-bottom:22px; }',
    '.g-forgot a { font-size:13px; color:#1D9E75; text-decoration:none; font-weight:500; }',

    // Submit
    '#g-submit { width:100%; height:48px; background:#1D9E75; color:#fff; border:none; border-radius:12px; font-family:Syne,sans-serif; font-size:15px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .15s; }',
    '#g-submit:hover:not(:disabled) { background:#0F6E52; }',
    '#g-submit:disabled { opacity:0.6; cursor:not-allowed; }',
    '#g-spinner { display:none; width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }',

    // Divider
    '.g-divider { display:flex; align-items:center; gap:12px; margin:22px 0; color:#9AADA6; font-size:12px; }',
    '.g-divider::before, .g-divider::after { content:""; flex:1; height:1px; background:#D6E8E1; }',

    // Social buttons
    '.g-social { width:100%; height:46px; border:1.5px solid #D6E8E1; background:#fff; border-radius:10px; font-size:14px; font-weight:500; font-family:Inter,sans-serif; color:#111714; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:10px; transition:background .15s; }',
    '.g-social:hover { background:#F6FAF8; border-color:#9AADA6; }',

    // Success
    '#g-success { display:none; flex-direction:column; align-items:center; text-align:center; padding:40px 0; animation:fadeUp .3s ease; }',
    '.g-success-icon { width:64px; height:64px; border-radius:50%; background:#E1F5EE; display:flex; align-items:center; justify-content:center; margin-bottom:20px; }',
    '.g-success-title { font-family:Syne,sans-serif; font-size:22px; font-weight:700; color:#111714; margin-bottom:8px; }',
    '.g-success-sub { font-size:14px; color:#4A5751; line-height:1.6; }',
  ].join('\n');
  document.head.appendChild(style);


  // ── 3. Define the Global Show Function ──────────────────────────────────
  function showLoginScreen() {
    var root = document.getElementById('root');
    
    root.innerHTML = [
      '<div id="gather-page">',
        // Left panel
        '<div id="gather-left">',
          '<div class="g-brand">',
            '<div class="g-brand-icon">',
              '<svg width="20" height="20" viewBox="0 0 20 20" fill="none">',
                '<circle cx="10" cy="10" r="8" stroke="#1D9E75" stroke-width="2"/>',
                '<path d="M6 10h8M10 6v8" stroke="#1D9E75" stroke-width="2" stroke-linecap="round"/>',
              '</svg>',
            '</div>',
            '<span class="g-brand-name">Gather</span>',
          '</div>',
          '<div>',
            '<div class="g-headline">Plans that<br/><em>actually</em><br/>happen.</div>',
            '<p class="g-subtext">Stop losing the plan in a 47-message thread. Gather gets your group to a confirmed time, place, and headcount — fast.</p>',
          '</div>',
          '<div class="g-testimonial">',
            '<p>"We used to spend 20 minutes just deciding where to eat. Now we confirm dinner in under two minutes."</p>',
            '<div class="g-tauthor">',
              '<div class="g-avatar">AJ</div>',
              '<div><div class="g-aname">Alex J.</div><div class="g-arole">Uses Gather weekly</div></div>',
            '</div>',
          '</div>',
        '</div>',

        // Right panel
        '<div id="gather-right">',
          '<div id="gather-card">',
            // Error banner
            '<div id="g-error-banner">',
              '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#C0392B" stroke-width="1.5"/><path d="M8 5v3.5M8 11h.01" stroke="#C0392B" stroke-width="1.5" stroke-linecap="round"/></svg>',
              '<span id="g-error-text"></span>',
            '</div>',

            '<h1 class="g-heading">Welcome back</h1>',
            '<p class="g-sub">New here? <a href="#">Create an account</a></p>',

            // Email field
            '<div class="g-field">',
              '<label for="g-email">Email</label>',
              '<div class="g-input-wrap">',
                '<input type="email" id="g-email" placeholder="you@example.com" autocomplete="email" />',
                '<span style="position:absolute;right:14px;top:50%;transform:translateY(-50%);pointer-events:none;display:flex;">',
                  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#9AADA6" stroke-width="1.4"/><path d="M1 5.5l7 4.5 7-4.5" stroke="#9AADA6" stroke-width="1.4" stroke-linecap="round"/></svg>',
                '</span>',
              '</div>',
              '<div class="g-field-err" id="g-email-err">Enter a valid email address.</div>',
            '</div>',

            // Password field
            '<div class="g-field">',
              '<label for="g-password">Password</label>',
              '<div class="g-input-wrap">',
                '<input type="password" id="g-password" placeholder="••••••••" autocomplete="current-password" />',
                '<button class="g-icon-btn" id="g-pw-toggle" type="button" aria-label="Show password">',
                  '<svg id="g-eye-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4"/></svg>',
                '</button>',
              '</div>',
              '<div class="g-field-err" id="g-pw-err">Password must be at least 8 characters.</div>',
            '</div>',

            // Forgot password
            '<div class="g-forgot"><a href="#">Forgot password?</a></div>',

            // Submit button
            '<button id="g-submit" type="button">',
              '<span id="g-btn-text">Log in</span>',
              '<span id="g-spinner"></span>',
            '</button>',

            // Divider
            '<div class="g-divider">or continue with</div>',

            // Social buttons
            '<button class="g-social" id="g-google-btn">',
              '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908C16.658 14.233 17.64 11.925 17.64 9.2z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>',
              'Continue with Google',
            '</button>',
            '<button class="g-social" id="g-apple-btn">',
              '<svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor"><path d="M13.057 9.545c-.02-2.082 1.7-3.09 1.778-3.138-1.002-1.44-2.512-1.618-3.047-1.631-1.285-.134-2.527.763-3.182.763-.666 0-1.677-.75-2.762-.728C4.26 4.832 2.767 5.83 1.942 7.346.266 10.397 1.508 14.89 3.12 17.347c.81 1.177 1.775 2.492 3.04 2.445 1.224-.05 1.682-.787 3.16-.787 1.467 0 1.886.787 3.17.76 1.319-.023 2.148-1.179 2.94-2.364.94-1.358 1.321-2.686 1.34-2.754-.03-.012-2.56-.978-2.582-3.102z"/><path d="M10.906 2.76C11.565 1.962 12.01.87 11.876-.252 10.93-.205 9.79.392 9.101 1.175c-.617.695-1.162 1.828-1.015 2.895.996.074 2.02-.504 2.82-1.31z"/></svg>',
              'Continue with Apple',
            '</button>',

            // Success state
            '<div id="g-success">',
              '<div class="g-success-icon">',
                '<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14l6 6 10-10" stroke="#1D9E75" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
              '</div>',
              '<div class="g-success-title">You\'re in!</div>',
              '<p class="g-success-sub">Taking you to your plans…</p>',
            '</div>',

          '</div>',
        '</div>',
      '</div>'
    ].join('');

    // ── 4. Wire up JavaScript logic ─────────────────────────────────────────
    var emailInput   = document.getElementById('g-email'); 
    var passwordInput= document.getElementById('g-password');
    var emailErr     = document.getElementById('g-email-err');
    var pwErr        = document.getElementById('g-pw-err');
    var errorBanner  = document.getElementById('g-error-banner');
    var errorText    = document.getElementById('g-error-text');
    var submitBtn    = document.getElementById('g-submit');
    var btnText      = document.getElementById('g-btn-text');
    var spinner      = document.getElementById('g-spinner');
    var pwToggle     = document.getElementById('g-pw-toggle');
    var eyeIcon      = document.getElementById('g-eye-icon');
    var successEl    = document.getElementById('g-success');
    var card         = document.getElementById('gather-card');

    // Password toggle
    var pwVisible = false;
    pwToggle.addEventListener('click', function () {
      pwVisible = !pwVisible;
      passwordInput.type = pwVisible ? 'text' : 'password';
      pwToggle.setAttribute('aria-label', pwVisible ? 'Hide password' : 'Show password');
      eyeIcon.style.opacity = pwVisible ? '0.4' : '1';
    });

    // Validation
    function isValidEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function validateEmail(show) {
      var ok = isValidEmail(emailInput.value);
      if (!ok && show) { emailInput.classList.add('g-invalid'); emailErr.style.display = 'block'; }
      else             { emailInput.classList.remove('g-invalid'); emailErr.style.display = 'none'; }
      return ok;
    }

    function validatePassword(show) {
      var ok = passwordInput.value.length >= 8;
      if (!ok && show) { passwordInput.classList.add('g-invalid'); pwErr.style.display = 'block'; }
      else             { passwordInput.classList.remove('g-invalid'); pwErr.style.display = 'none'; }
      return ok;
    }

    emailInput.addEventListener('blur',  function () { validateEmail(true); });
    passwordInput.addEventListener('blur', function () { validatePassword(true); });
    emailInput.addEventListener('input',   function () { if (emailInput.classList.contains('g-invalid'))    validateEmail(false); }); 
    passwordInput.addEventListener('input',function () { if (passwordInput.classList.contains('g-invalid')) validatePassword(false); });

    function setLoading(on) { 
      submitBtn.disabled    = on;
      btnText.textContent   = on ? 'Logging in…' : 'Log in';
      spinner.style.display = on ? 'inline-block' : 'none';
    }

    function showError(msg) {
      errorText.textContent       = msg;
      errorBanner.style.display   = 'flex';
      emailInput.classList.add('g-invalid');
      passwordInput.classList.add('g-invalid');
    }

    function clearErrors() {
      errorBanner.style.display = 'none';
      emailInput.classList.remove('g-invalid');
      passwordInput.classList.remove('g-invalid');
      emailErr.style.display = 'none';
      pwErr.style.display    = 'none';
    }

    // Submit Action
    submitBtn.addEventListener('click', function () {
      clearErrors();
      var emailOk = validateEmail(true);
      var pwOk    = validatePassword(true);
      if (!emailOk || !pwOk) return;

      setLoading(true);

      setTimeout(function () {
        var email    = emailInput.value.trim().toLowerCase();
        var password = passwordInput.value;

        if (email === 'demo@gather.app' && password === 'password123') {
          setLoading(false);
          var children = card.children;
          for (var i = 0; i < children.length; i++) {
            children[i].style.display = 'none';
          }
          successEl.style.display = 'flex';
        } else {
          setLoading(false);
          showError("Those credentials didn't match. Try again.");
          passwordInput.value = '';
        }
      }, 1400);
    });

    // Social buttons
    document.getElementById('g-google-btn').addEventListener('click', function () {
      alert('Connect your Google OAuth provider here.');
    });
    document.getElementById('g-apple-btn').addEventListener('click', function () {
      alert('Connect your Apple OAuth provider here.');
    });

    // LoginScreen --> Signup Screen
    var signupLink = document.querySelector('.g-sub a');
    if (signupLink) {
      signupLink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevents the page from refreshing
        window.showSignupScreen(); // Launches the signup UI
      });
    }
  }

  // ── 5. Expose globally to window ────────────────────────────────────────
  window.showLoginScreen = showLoginScreen;

})();