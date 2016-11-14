'use strict';
const http = require('http');
const https = require('https');

const env = require('./env');
const sendMail = require('./email');

let _date = new Date();

const errorHandler = function (err) {
  const errorMessage = `<h4>Error!</h4><br><span>${err}</span>`;
  const subject = env.error.subject;
  sendMail(errorMessage, subject, env.toList.admin);
}

const requestSite = function (callback, urlObj) {
  let date = new Date();
  let diff = date - _date;
  _date = date;
  if (diff < 1000) return;

  if (urlObj.protocol === 'https') https.get(Object.assign(urlObj, { protocol: undefined }), callback).on('error', errorHandler);
  else http.get(Object.assign(urlObj, { protocol: undefined }), callback).on('error', errorHandler);
}

module.exports = requestSite;

