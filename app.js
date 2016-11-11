'use strict';
const cheerio = require('cheerio');
const requestSite = require('./request.js');
const env = require('./env');
const cache = Object.assign({}, env.startingCache);

const sendMail = require('./email');
setTimeout(function () { sendMail(env.startUp.data, env.startUp.subject, env.toList.admin) }, 300);

function compressedBeerScout(...args) {
  return setTimeout(requestSite.bind(null, require(`./callbacks/${env.sites[args[0]]}`)(env.sites[args[0]], cheerio, args[1], args[4], args[5])), args[2], args[3]);
}

setInterval(function () {
  compressedBeerScout(0, cache[env.sites[0]], 0, env.request[env.sites[0]]);
  compressedBeerScout(1, cache[env.sites[1]][0], 4000, env.request[env.sites[1]][0]);
  compressedBeerScout(1, cache[env.sites[1]][1], 8000, env.request[env.sites[1]][1]);
  compressedBeerScout(2, cache[env.sites[2]], 12000, env.request[env.sites[2]]);
  compressedBeerScout(3, cache[env.sites[3]][0], 16000, env.request[env.sites[3]][0]);
  compressedBeerScout(3, cache[env.sites[3]][1], 20000, env.request[env.sites[3]][1]);
  compressedBeerScout(3, cache[env.sites[3]][2], 24000, env.request[env.sites[3]][2]);
  compressedBeerScout(4, cache[env.sites[4]], 28000, env.request[env.sites[4]]);
  compressedBeerScout(5, cache[env.sites[5]][0], 32000, env.request[env.sites[5]][0], 'NEW POST', 10);
  compressedBeerScout(5, cache[env.sites[5]][1], 36000, env.request[env.sites[5]][1], 'ENDING SOON', 20);
}, 90000)

