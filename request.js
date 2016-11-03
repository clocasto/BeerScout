'use strict';
const http = require('http');
const https = require('https');

const options = require('./env')
  .request;

let _date = new Date();

const requestSite = function(callback, urlObj) {
  let date = new Date();
  let diff = date - _date;
  _date = date;
  if (diff < 1000) return;

  if (urlObj.protocol === 'https') https.request(Object.assign(urlObj, { protocol: undefined }), callback)
    .end();
  else http.request(Object.assign(urlObj, { protocol: undefined }), callback)
    .end();
}

module.exports = requestSite;

