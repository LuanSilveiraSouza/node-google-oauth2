const express = require("express");
const path = require("path");
const { google } = require('googleapis');

const googleCredentials = require('./google-oauth2.json').web;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const OAuth2Client = new google.auth.OAuth2(
  googleCredentials.client_id,
  googleCredentials.client_secret,
  googleCredentials.redirect_uris
);

google.options({auth: OAuth2Client})

const url = OAuth2Client.generateAuthUrl({
  access_type: 'offline',

  scope: 'https://www.googleapis.com/auth/calendar'
})

app.get('/', (req, res) => {
  const url = OAuth2Client.generateAuthUrl({
    access_type: 'offline',
  
    scope: ['profile', 'email']
  })

  res.render('login', {url});
})

app.get('/oauth2login', async (req, res) => {
  const authCode = req.query.code;

  const { tokens } = await OAuth2Client.getToken(authCode);

  OAuth2Client.credentials = tokens;

  res.render('auth', { tokens })
})

app.get('/dashboard', async (req, res) => {
  const { token } = req.query;

  if (token) {
    try {
      const result = await OAuth2Client.verifyIdTokenAsync({
        idToken: token, 
        audience: googleCredentials.client_id
      });
    
      console.log(result);

      res.render('dashboard');
    } catch (err) {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }

})

module.exports = app;