'use strict';
const http = require('http');

const options = require('./env')
  .request;

let _date = new Date();

const requestSite = function(callback, urlObj) {
  let date = new Date();
  let diff = date - _date;
  _date = date;
  if (diff < 1000) return;

  http.request(urlObj, callback)
    .end();
}

module.exports = requestSite;

