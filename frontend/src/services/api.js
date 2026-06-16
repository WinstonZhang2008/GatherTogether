// frontend/src/services/api.js
var API_URL = 'http://localhost:5000';

window.api = {

  // ── Public routes (no token needed) ───────────────────────────────────

  login: function(email, password) {
    return fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success && data.token) {
        window.auth.saveToken(data.token); // ← save token automatically
      }
      return data;
    });
  },

  signup: function(firstName, lastName, email, password) {
    return fetch(API_URL + '/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, password: password })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success && data.token) {
        window.auth.saveToken(data.token); // ← save token automatically
      }
      return data;
    });
  },

  // ── Protected routes (token attached automatically) ────────────────────

  getPlans: function() {
    return window.auth.request(API_URL + '/plans', { method: 'GET' });
  },

  createPlan: function(planData) {
    return window.auth.request(API_URL + '/plans', {
      method: 'POST',
      body: JSON.stringify(planData)
    });
  }

};