// ─── Gather App — ForgotPasswordScreen.js ───────────────────────────────────

(function () {

  function showForgotPasswordScreen(root, navigate) {
    if (!root) root = document.getElementById('root');

    var styleId = 'gather-forgot-styles';
    if (!document.getElementById(styleId)) {
      var style = document.createElement('style');
      style.id = styleId;
      style.textContent = [
        '#fp-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px 24px; background:#F6FAF8; }',
        '#fp-card { width:100%; max-width:400px; animation:fadeUp .3s ease; }',
        '.fp-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#1D9E75; font-weight:500; cursor:pointer; margin-bottom:32px; background:none; border:none; padding:0; }',
        '.fp-back:hover { text-decoration:underline; }',
        '.fp-brand { font-family:Syne,sans-serif; font-size:20px; font-weight:800; color:#111714; letter-spacing:-0.5px; margin-bottom:32px; }',
        '.fp-heading { font-family:Syne,sans-serif; font-size:26px; font-weight:700; color:#111714; letter-spacing:-0.5px; margin-bottom:8px; }',
        '.fp-sub { font-size:14px; color:#4A5751; line-height:1.6; margin-bottom:28px; }',
        '.fp-field { margin-bottom:20px; }',
        '.fp-field label { display:block; font-size:13px; font-weight:500; color:#111714; margin-bottom:6px; }',
        '.fp-field input { width:100%; height:46px; padding:0 14px; border:1.5px solid #D6E8E1; border-radius:10px; font-size:14px; font-family:Inter,sans-serif; color:#111714; background:#fff; outline:none; transition:border-color .15s, box-shadow .15s; }',
        '.fp-field input:focus { border-color:#1D9E75; box-shadow:0 0 0 3px rgba(29,158,117,0.12); }',
        '.fp-field input.fp-invalid { border-color:#C0392B !important; box-shadow:0 0 0 3px rgba(192,57,43,0.1) !important; }',
        '.fp-field input::placeholder { color:#9AADA6; }',
        '.fp-field-err { font-size:12px; color:#C0392B; margin-top:5px; display:none; }',
        '#fp-error-banner { display:none; background:#FBEAEA; border:1px solid #F5C6C6; border-radius:10px; padding:12px 14px; font-size:13px; color:#C0392B; margin-bottom:20px; align-items:center; gap:8px; }',
        '#fp-submit { width:100%; height:48px; background:#1D9E75; color:#fff; border:none; border-radius:12px; font-family:Syne,sans-serif; font-size:15px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .15s; }',
        '#fp-submit:hover:not(:disabled) { background:#0F6E52; }',
        '#fp-submit:disabled { opacity:0.6; cursor:not-allowed; }',
        '#fp-spinner { display:none; width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }',
        '#fp-success { display:none; text-align:center; padding:8px 0; animation:fadeUp .3s ease; }',
        '.fp-success-icon { width:64px; height:64px; border-radius:50%; background:#E1F5EE; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }',
        '.fp-success-title { font-family:Syne,sans-serif; font-size:22px; font-weight:700; color:#111714; margin-bottom:8px; }',
        '.fp-success-sub { font-size:14px; color:#4A5751; line-height:1.6; margin-bottom:28px; }',
        '.fp-success-back { font-size:14px; color:#1D9E75; font-weight:500; cursor:pointer; background:none; border:none; }',
        '.fp-success-back:hover { text-decoration:underline; }',
      ].join('\n');
      document.head.appendChild(style);
    }

    root.innerHTML = [
      '<div id="fp-page">',
        '<div id="fp-card">',

          '<button class="fp-back" id="fp-back-btn">',
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#1D9E75" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            'Back to login',
          '</button>',

          '<div class="fp-brand">Gather</div>',

          '<div id="fp-form">',
            '<h1 class="fp-heading">Forgot password?</h1>',
            '<p class="fp-sub">Enter your email and we\'ll send you a link to reset your password.</p>',

            '<div id="fp-error-banner">',
              '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#C0392B" stroke-width="1.5"/><path d="M8 5v3.5M8 11h.01" stroke="#C0392B" stroke-width="1.5" stroke-linecap="round"/></svg>',
              '<span id="fp-error-text"></span>',
            '</div>',

            '<div class="fp-field">',
              '<label for="fp-email">Email address</label>',
              '<input type="email" id="fp-email" placeholder="you@example.com" autocomplete="email" />',
              '<div class="fp-field-err" id="fp-email-err">Enter a valid email address.</div>',
            '</div>',

            '<button id="fp-submit" type="button"><span id="fp-btn-text">Send reset link</span><span id="fp-spinner"></span></button>',
          '</div>',

          '<div id="fp-success">',
            '<div class="fp-success-icon">',
              '<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 14l7 7L24 7" stroke="#1D9E75" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            '</div>',
            '<div class="fp-success-title">Check your email</div>',
            '<p class="fp-success-sub">If <strong id="fp-sent-email"></strong> is registered, a reset link is on its way. Check your spam folder if it doesn\'t arrive.</p>',
            '<button class="fp-success-back" id="fp-success-back-btn">Back to login</button>',
          '</div>',

        '</div>',
      '</div>',
    ].join('');

    var emailInput   = document.getElementById('fp-email');
    var emailErr     = document.getElementById('fp-email-err');
    var errorBanner  = document.getElementById('fp-error-banner');
    var errorText    = document.getElementById('fp-error-text');
    var submitBtn    = document.getElementById('fp-submit');
    var btnText      = document.getElementById('fp-btn-text');
    var spinner      = document.getElementById('fp-spinner');
    var formEl       = document.getElementById('fp-form');
    var successEl    = document.getElementById('fp-success');
    var sentEmailEl  = document.getElementById('fp-sent-email');

    function goBack() {
      if (typeof navigate === 'function') {
        navigate('login');
      } else if (typeof window.showLoginScreen === 'function') {
        window.showLoginScreen();
      }
    }

    document.getElementById('fp-back-btn').addEventListener('click', goBack);
    document.getElementById('fp-success-back-btn').addEventListener('click', goBack);

    function isValidEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function setLoading(on) {
      submitBtn.disabled    = on;
      btnText.textContent   = on ? 'Sending…' : 'Send reset link';
      spinner.style.display = on ? 'inline-block' : 'none';
    }

    submitBtn.addEventListener('click', function () {
      errorBanner.style.display = 'none';
      emailInput.classList.remove('fp-invalid');
      emailErr.style.display = 'none';

      var email = emailInput.value.trim().toLowerCase();

      if (!isValidEmail(email)) {
        emailInput.classList.add('fp-invalid');
        emailErr.style.display = 'block';
        return;
      }

      setLoading(true);

      window.api.forgotPassword(email)
        .then(function () {
          setLoading(false);
          sentEmailEl.textContent = email;
          formEl.style.display    = 'none';
          successEl.style.display = 'block';
        })
        .catch(function () {
          setLoading(false);
          errorText.textContent     = 'Could not reach the server. Please try again.';
          errorBanner.style.display = 'flex';
        });
    });

    emailInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submitBtn.click();
    });
  }

  window.showForgotPasswordScreen = showForgotPasswordScreen;

})();
