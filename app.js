'use strict';
const cheerio = require('cheerio');
const requestSite = require('./request.js');
const env = require('./env');
const cache = Object.assign({}, env.startingCache);

const sendMail = require('./email');
setTimeout(function() { sendMail(env.startUp.data, env.startUp.subject, env.toList.admin) }, 300);

setInterval(function() {
  requestSite(require(`./callbacks/${env.sites[0]}`)(env.sites[0], cheerio, cache[env.sites[0]]), env.request[env.sites[0]])
  setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[1]}`)(env.sites[1], cheerio, cache[env.sites[1]][0])), 4000, env.request[env.sites[1]][0]);
  setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[1]}`)(env.sites[1], cheerio, cache[env.sites[1]][1])), 8000, env.request[env.sites[1]][1]);
  setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[2]}`)(env.sites[2], cheerio, cache[env.sites[2]])), 12000, env.request[env.sites[2]]);
  setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[3]}`)(env.sites[3], cheerio, cache[env.sites[3]][0])), 16000, env.request[env.sites[3]][0]);
  setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[3]}`)(env.sites[3], cheerio, cache[env.sites[3]][1])), 20000, env.request[env.sites[3]][1]);
  setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[3]}`)(env.sites[3], cheerio, cache[env.sites[3]][2])), 24000, env.request[env.sites[3]][2]);
  setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[4]}`)(env.sites[4], cheerio, cache[env.sites[4]][0], 'NEW POST', 10)), 28000, env.request[env.sites[4]][0]);
  setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[4]}`)(env.sites[4], cheerio, cache[env.sites[4]][1], 'ENDING SOON', 1)), 32000, env.request[env.sites[4]][1]);
}, 80000)

