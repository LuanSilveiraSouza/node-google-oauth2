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

app.use('/', (req, res) => {
  const url = OAuth2Client.generateAuthUrl({
    access_type: 'offline',
  
    scope: 'profile'
  })

  res.render('login', {url});
})

module.exports = app;