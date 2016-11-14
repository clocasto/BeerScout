'use strict';
const tableMaker = require('../table');
const sendMail = require('../email.js');
const env = require('../env');

module.exports = function (name, cheerio, cache) {
  return function (response) {
    let htmlDoc = '';

    //Handle errors from server
    response.on('error', console.error);

    //another chunk of data has been recieved, so append it to `htmlDoc`
    response.on('data', function (chunk) {
      htmlDoc += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {

      const $ = cheerio.load(htmlDoc);

      const names = $('.product-name')
        .map((i, n) => n.attribs.title)
        .toArray();

      const links = $('.product-name')
        .map((i, n) => n.attribs.href);

      const prices = $('.product-price')
        .map((i, n) => $(n)
          .text())

      const availabilities = $('.availability span')
        .map((i, n) => $(n)
          .hasClass('available-now'))
        .toArray();

      const products = names
        .map((p, i) => {
          return {
            id: /\/([0-9]+)/.exec(links[i])[1],
            name: p,
            link: links[i],
            price: prices[i] || '???',
            stock: availabilities[i]
          }
        })
        .filter(p => {
          return !/poster|sign|shirt|glass|crate/.test(p.name.toLowerCase());
        })

      if (!Object.keys(cache).length && products.length) {
        products.forEach(p => cache[p.id] = p);
        console.log(`Initialized cache for ${name}`);
      } else if (products.length) {
        products.forEach(p => {
          const record = cache[p.id];
          if (!record) {
            console.log(`Updating ${name} cache for ${p.id}!`);
            cache[p.id] = p;
            console.log(`${name} - New Posting!`)
            setTimeout(sendMail.bind(null, tableMaker(p), `[${env.tags[name]}] ${p.price}, ${p.name}`, env.toList[name]), Math.min(500, Math.random() * 2000));
          } else {
            if (!record.stock && p.stock) {
              console.log(`${name} - In Stock: ${p.name}`)
              setTimeout(sendMail.bind(null, tableMaker(p), `[${env.tags[name]}] ${p.price}, ${p.name}`, env.toList[name]), Math.min(500, Math.random() * 2000));
            } else if ((p.price < record.price) && p.stock) {
              console.log(`${name} - Price Slash: ${p.name}`)
              setTimeout(sendMail.bind(null, tableMaker(p), `[${env.tags[name]}] ${p.price}, ${p.name}`, env.toList[name]), Math.min(500, Math.random() * 2000));
            }
            cache[p.id] = p;
          }
        })
      } else { console.log(`No updates for ${name}.`); }
    });
  }
}

