// frontend/src/services/AuthContext.js
// Manages JWT token storage and authenticated fetch requests.
// Loaded as a plain <script> (not a module) so window.auth is available globally.

(function () {
  var TOKEN_KEY = 'gather_token';

  window.auth = {
    saveToken: function (token) {
      localStorage.setItem(TOKEN_KEY, token);
    },

    getToken: function () {
      return localStorage.getItem(TOKEN_KEY);
    },

    clearToken: function () {
      localStorage.removeItem(TOKEN_KEY);
    },

    isLoggedIn: function () {
      return !!localStorage.getItem(TOKEN_KEY);
    },

    // Makes an authenticated fetch. Automatically attaches the JWT Bearer token.
    request: function (url, options) {
      options = options || {};
      var token = window.auth.getToken();
      var headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }
      return fetch(url, Object.assign({}, options, { headers: headers }))
        .then(function (res) { return res.json(); });
    }
  };
})();
