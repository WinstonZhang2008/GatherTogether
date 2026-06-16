// ─── Gather App — SignupScreen.js ───────────────────────────────────────────
// Vanilla JS — no imports needed. Works via a plain <script src="SignupScreen.js"> tag.

(function () {

  function showSignupScreen(root, navigate) {
    // Fallback: If main.js calls this without passing the root element, find it yourself
    if (!root) {
      root = document.getElementById('root');
    }

    // ── Styles ────────────────────────────────────────────────────────────────
    var styleId = 'gather-signup-styles';
    if (!document.getElementById(styleId)) {
      var style = document.createElement('style');
      style.id  = styleId;
      style.textContent = [
        '#su-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px 24px; background:#F6FAF8; }',
        '#su-card { width:100%; max-width:420px; animation:fadeUp .3s ease; }',
        '.su-brand { display:flex; align-items:center; gap:10px; margin-bottom:32px; }',
        '.su-brand-icon { width:34px; height:34px; background:#1D9E75; border-radius:10px; display:flex; align-items:center; justify-content:center; }',
        '.su-brand-name { font-family:Syne,sans-serif; font-size:20px; font-weight:800; color:#111714; letter-spacing:-0.5px; }',
        '.su-heading { font-family:Syne,sans-serif; font-size:26px; font-weight:700; color:#111714; letter-spacing:-0.5px; margin-bottom:6px; }',
        '.su-sub { font-size:14px; color:#4A5751; margin-bottom:28px; }',
        '.su-link { color:#1D9E75; text-decoration:none; font-weight:500; cursor:pointer; }',
        '.su-link:hover { text-decoration:underline; }',
        '.su-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }',
        '.su-field { margin-bottom:16px; }',
        '.su-field label { display:block; font-size:13px; font-weight:500; color:#111714; margin-bottom:6px; }',
        '.su-input-wrap { position:relative; }',
        '.su-input-wrap input { width:100%; height:46px; padding:0 14px; border:1.5px solid #D6E8E1; border-radius:10px; font-size:14px; font-family:Inter,sans-serif; color:#111714; background:#fff; outline:none; transition:border-color .15s, box-shadow .15s; }',
        '.su-input-wrap input:focus { border-color:#1D9E75; box-shadow:0 0 0 3px rgba(29,158,117,0.12); }',
        '.su-input-wrap input.su-invalid { border-color:#C0392B !important; box-shadow:0 0 0 3px rgba(192,57,43,0.1) !important; }',
        '.su-input-wrap input::placeholder { color:#9AADA6; }',
        '.su-pw-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; display:flex; padding:4px; color:#9AADA6; }',
        '.su-field-err { font-size:12px; color:#C0392B; margin-top:5px; display:none; }',
        '.su-terms { font-size:12px; color:#4A5751; line-height:1.6; margin-bottom:22px; }',
        '.su-terms a { color:#1D9E75; text-decoration:none; font-weight:500; }',
        '#su-submit { width:100%; height:48px; background:#1D9E75; color:#fff; border:none; border-radius:12px; font-family:Syne,sans-serif; font-size:15px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .15s; margin-bottom:16px; }',
        '#su-submit:hover:not(:disabled) { background:#0F6E52; }',
        '#su-submit:disabled { opacity:0.6; cursor:not-allowed; }',
        '#su-spinner { display:none; width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }',
        '.su-divider { display:flex; align-items:center; gap:12px; margin:4px 0 16px; color:#9AADA6; font-size:12px; }',
        '.su-divider::before, .su-divider::after { content:""; flex:1; height:1px; background:#D6E8E1; }',
        '.su-social { width:100%; height:46px; border:1.5px solid #D6E8E1; background:#fff; border-radius:10px; font-size:14px; font-weight:500; font-family:Inter,sans-serif; color:#111714; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:10px; transition:background .15s; }',
        '.su-social:hover { background:#F6FAF8; border-color:#9AADA6; }',
        '#su-error-banner { display:none; background:#FBEAEA; border:1px solid #F5C6C6; border-radius:10px; padding:12px 14px; font-size:13px; color:#C0392B; margin-bottom:20px; align-items:center; gap:8px; }',
      ].join('\n');
      document.head.appendChild(style);
    }

    // ── HTML ──────────────────────────────────────────────────────────────────
    root.innerHTML = [
      '<div id="su-page">',
        '<div id="su-card">',

          '<div id="su-error-banner">',
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#C0392B" stroke-width="1.5"/><path d="M8 5v3.5M8 11h.01" stroke="#C0392B" stroke-width="1.5" stroke-linecap="round"/></svg>',
            '<span id="su-error-text"></span>',
          '</div>',

          '<div class="su-brand">',
            '<div class="su-brand-icon"><svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#fff" stroke-width="2"/><path d="M6 10h8M10 6v8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></div>',
            '<span class="su-brand-name">Gather</span>',
          '</div>',

          '<h1 class="su-heading">Create your account</h1>',
          '<p class="su-sub">Already have one? <span class="su-link" id="su-goto-login">Log in</span></p>',

          '<div class="su-row">',
            '<div class="su-field">',
              '<label for="su-firstname">First name</label>',
              '<div class="su-input-wrap"><input type="text" id="su-firstname" placeholder="Alex" autocomplete="given-name" /></div>',
              '<div class="su-field-err" id="su-firstname-err">Required.</div>',
            '</div>',
            '<div class="su-field">',
              '<label for="su-lastname">Last name</label>',
              '<div class="su-input-wrap"><input type="text" id="su-lastname" placeholder="Johnson" autocomplete="family-name" /></div>',
              '<div class="su-field-err" id="su-lastname-err">Required.</div>',
            '</div>',
          '</div>',

          '<div class="su-field">',
            '<label for="su-email">Email</label>',
            '<div class="su-input-wrap"><input type="email" id="su-email" placeholder="you@example.com" autocomplete="email" /></div>',
            '<div class="su-field-err" id="su-email-err">Enter a valid email address.</div>',
          '</div>',

          '<div class="su-field">',
            '<label for="su-password">Password</label>',
            '<div class="su-input-wrap">',
              '<input type="password" id="su-password" placeholder="At least 8 characters" autocomplete="new-password" style="padding-right:42px;" />',
              '<button class="su-pw-btn" id="su-pw-toggle" type="button" aria-label="Show password">',
                '<svg id="su-eye" width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4"/></svg>',
              '</button>',
            '</div>',
            '<div class="su-field-err" id="su-pw-err">Password must be at least 8 characters.</div>',
          '</div>',

          '<p class="su-terms">By signing up you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>',

          '<button id="su-submit" type="button"><span id="su-btn-text">Create account</span><span id="su-spinner"></span></button>',

          '<div class="su-divider">or sign up with</div>',

          '<button class="su-social" id="su-google"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908C16.658 14.233 17.64 11.925 17.64 9.2z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>Continue with Google</button>',
          '<button class="su-social" id="su-apple"><svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor"><path d="M13.057 9.545c-.02-2.082 1.7-3.09 1.778-3.138-1.002-1.44-2.512-1.618-3.047-1.631-1.285-.134-2.527.763-3.182.763-.666 0-1.677-.75-2.762-.728C4.26 4.832 2.767 5.83 1.942 7.346.266 10.397 1.508 14.89 3.12 17.347c.81 1.177 1.775 2.492 3.04 2.445 1.224-.05 1.682-.787 3.16-.787 1.467 0 1.886.787 3.17.76 1.319-.023 2.148-1.179 2.94-2.364.94-1.358 1.321-2.686 1.34-2.754-.03-.012-2.56-.978-2.582-3.102z"/><path d="M10.906 2.76C11.565 1.962 12.01.87 11.876-.252 10.93-.205 9.79.392 9.101 1.175c-.617.695-1.162 1.828-1.015 2.895.996.074 2.02-.504 2.82-1.31z"/></svg>Continue with Apple</button>',

        '</div>',
      '</div>',
    ].join('');

    // ── Logic ─────────────────────────────────────────────────────────────────
    var firstNameInput = document.getElementById('su-firstname');
    var lastNameInput  = document.getElementById('su-lastname');
    var emailInput     = document.getElementById('su-email');
    var passwordInput  = document.getElementById('su-password');
    var firstNameErr   = document.getElementById('su-firstname-err');
    var lastNameErr    = document.getElementById('su-lastname-err');
    var emailErr       = document.getElementById('su-email-err');
    var pwErr          = document.getElementById('su-pw-err');
    var submitBtn      = document.getElementById('su-submit');
    var btnText        = document.getElementById('su-btn-text');
    var spinner        = document.getElementById('su-spinner');
    var pwToggle       = document.getElementById('su-pw-toggle');
    var errorBanner    = document.getElementById('su-error-banner');
    var errorText      = document.getElementById('su-error-text');

    // Go back to login
    document.getElementById('su-goto-login').addEventListener('click', function () {
      if (typeof navigate === 'function') {
        navigate('login');
      } else if (typeof window.showLoginScreen === 'function') {
        window.showLoginScreen();
      } else {
        console.error('Login screen function not found!');
      }
    });

    // Password toggle
    var pwVisible = false;
    pwToggle.addEventListener('click', function () {
      pwVisible = !pwVisible;
      passwordInput.type = pwVisible ? 'text' : 'password';
    });

    function req(input, errEl) {
      var ok = input.value.trim().length > 0;
      if (!ok) { input.classList.add('su-invalid'); errEl.style.display = 'block'; }
      else      { input.classList.remove('su-invalid'); errEl.style.display = 'none'; }
      return ok;
    }

    function validateEmail() {
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      if (!ok) { emailInput.classList.add('su-invalid'); emailErr.style.display = 'block'; }
      else      { emailInput.classList.remove('su-invalid'); emailErr.style.display = 'none'; }
      return ok;
    }

    function validatePassword() {
      var ok = passwordInput.value.length >= 8;
      if (!ok) { passwordInput.classList.add('su-invalid'); pwErr.style.display = 'block'; }
      else      { passwordInput.classList.remove('su-invalid'); pwErr.style.display = 'none'; }
      return ok;
    }

    function showError(msg) {
      errorText.textContent     = msg;
      errorBanner.style.display = 'flex';
    }

    function setLoading(on) {
      submitBtn.disabled    = on;
      btnText.textContent   = on ? 'Creating account…' : 'Create account';
      spinner.style.display = on ? 'inline-block' : 'none';
    }

    // ── Submit Action ────────────────────────────────────────────────────────
    submitBtn.addEventListener('click', function () {
      errorBanner.style.display = 'none';

      var ok = [
        req(firstNameInput, firstNameErr),
        req(lastNameInput,  lastNameErr),
        validateEmail(),
        validatePassword(),
      ].every(Boolean);

      if (!ok) return;

      setLoading(true);

      var firstName = firstNameInput.value.trim();
      var lastName  = lastNameInput.value.trim();
      var email     = emailInput.value.trim().toLowerCase();
      var password  = passwordInput.value;

      // ── Real API call to your backend ────────────────────────────────────
      window.api.signup(firstName, lastName, email, password)
        .then(function (data) {
          setLoading(false);
          if (data.success) {
            if (typeof navigate === 'function') {
              navigate('home');
            } else if (typeof window.showHomeScreen === 'function') {
              window.showHomeScreen();
            } else {
              console.error("HomeScreen.js hasn't been loaded in index.html yet!");
            }
          } else {
            showError(data.message || 'Something went wrong. Please try again.');
          }
        })
        .catch(function () {
          setLoading(false);
          showError('Could not reach the server. Please try again.');
        });
    });

    document.getElementById('su-google').addEventListener('click', function () { alert('Connect your Google OAuth provider here.'); });
    document.getElementById('su-apple').addEventListener('click',  function () { alert('Connect your Apple OAuth provider here.'); });
  }

  // ── Expose globally to window ──────────────────────────────────────────
  window.showSignupScreen = showSignupScreen;

})();