'use strict';
const http = require('http');

const options = require('./env')
  .request;

let _date = new Date();

const requestSite = function(callback, site) {
  let date = new Date();
  let diff = date - _date;
  _date = date;
  if (diff < 1000) return;

  http.request(options[site], callback)
    .end();
}

module.exports = requestSite;

