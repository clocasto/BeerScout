'use strict';
const tableMaker = require('../table_coll');
const sendMail = require('../email.js');
const env = require('../env');

const extractPrice = function(str) {
  return /(\$[0-9]+\.[0-9]+)/.exec(str)[1];
}

const timeRemaining = function(ms) {
  const left = ms - Date.now();

  const _day = 1000 * 60 * 60 * 24;
  const _hour = 1000 * 60 * 60;
  const _minute = 1000 * 60;
  const _second = 1000;

  const days = Math.floor(left / _day);
  const hours = Math.floor(((left / _day) % 1) * 24);
  const minutes = Math.floor((((left / _day) % 1) * 24 * 60) % 60);
  const seconds = Math.floor(((((left / _day) % 1) * 24 * 60 * 60) % 60));

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

module.exports = function(name, cheerio, cache, product, title, sight) {
  const host = product.request.host;
  const protocol = product.request.protocol;

  return function(response) {
    let htmlDoc = '';

    //another chunk of data has been recieved, so append it to `htmlDoc`
    response.on('data', function(chunk) {
      htmlDoc += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {
      const $ = cheerio.load(htmlDoc);

      let bid, buy;
      if ($('.current-price')
        .toArray()[0]) {
        bid = extractPrice($('.current-price')
          .toArray()[0].children[0].data);
      }
      if ($('#product-price')
        .toArray()
        .length) {
        buy = extractPrice($('#product-price')
          .toArray()[0].children[0].data);
      }
      const timeLeft = timeRemaining($('.time')
        .children('span')
        .attr('data-countdown'));

      const listing = Object.assign({}, product, { request: undefined }, { bid, buy, timeLeft })

      console.log(`Added ${product.id} to ${env.tags[name]}/${title} cache.`)
      cache.push(listing.id);
      if (cache.length > sight) {
        cache.shift();
        const price = bid < buy ? bid : buy;
        setTimeout(sendMail.bind(null, tableMaker(listing), `[${env.tags[name]}] ${title}: ${price}, ${listing.name}`, env.toList[name]), Math.min(500, Math.random() * 2000));
      }
    });
  }
}

