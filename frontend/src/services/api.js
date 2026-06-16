// frontend/src/api.js
var API_URL = 'http://localhost:5000'; // change to your backend port

window.api = {

  login: function(email, password) {
    return fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    }).then(function(res) { return res.json(); });
  },

  signup: function(firstName, lastName, email, password) {
    return fetch(API_URL + '/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, password: password })
    }).then(function(res) { return res.json(); });
  }

};