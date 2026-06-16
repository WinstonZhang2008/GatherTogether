// frontend/src/services/auth.js
// Handles token storage, attaching tokens to requests, and logout.

window.auth = {

  // ── Save token after login/signup ──────────────────────────────────────
  saveToken: function(token) {
    localStorage.setItem('gather_token', token);
  },

  // ── Get token (used internally) ────────────────────────────────────────
  getToken: function() {
    return localStorage.getItem('gather_token');
  },

  // ── Check if user is logged in ─────────────────────────────────────────
  isLoggedIn: function() {
    return !!localStorage.getItem('gather_token');
  },

  // ── Delete token on logout ─────────────────────────────────────────────
  logout: function() {
    localStorage.removeItem('gather_token');
    window.showLoginScreen(); // send user back to login
  },

  // ── Make an authenticated fetch request ────────────────────────────────
  // Use this instead of fetch() for any route that requires login
  request: function(url, options) {
    var token = this.getToken();
    options = options || {};
    options.headers = options.headers || {};
    options.headers['Content-Type']  = 'application/json';
    options.headers['Authorization'] = 'Bearer ' + token;
    return fetch(url, options).then(function(res) { return res.json(); });
  }

};