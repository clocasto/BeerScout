'use strict';
const cheerio = require('cheerio');
const requestSite = require('./request.js');
const env = require('./env');
const cache = Object.assign({}, env.startingCache);

const sendMail = require('./email');
setTimeout(function() { sendMail(env.startUp.data, env.startUp.subject, env.toList.admin) }, 3000);

setInterval(function() {
  requestSite(require(`./callbacks/${env.sites[0]}`)(env.sites[0], cheerio, cache[env.sites[0]]), env.request[env.sites[0]])
  setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[1]}`)(env.sites[1], cheerio, cache[env.sites[1]][0])), 2400, env.request[env.sites[1]][0]);
  setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[1]}`)(env.sites[1], cheerio, cache[env.sites[1]][1])), 3600, env.request[env.sites[1]][1]);
}, 8000)

