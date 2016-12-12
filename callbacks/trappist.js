'use strict';
const tableMaker = require('../table');
const sendMail = require('../email.js');
const env = require('../env');

module.exports = function(name, cheerio, cache) {
  return function(response) {
    let htmlDoc = '';

    //Handle errors from server
    response.on('error', console.error);

    //another chunk of data has been recieved, so append it to `htmlDoc`
    response.on('data', function(chunk) {
      htmlDoc += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {
      const $ = cheerio.load(htmlDoc);
      const listings = $('#product_list')
        .children('li')
        .children('div.center_block')
        .children('h3')
        .children('a');

      if (!listings) return console.log(`No valid html from ${name}.`);

      const keys = Object.keys(listings.contents()).filter(el => el.replace(/[^0-9]/g, '') === '' ? false : true);

      const prices = $('#product_list')
        .children('li')
        .children('div.right_block')
        .children('div.content_price')
        .children('span.price')
        .contents()

      const availabilities = $('#product_list')
        .children('li')
        .children('div.right_block')
        .children('div.content_price')
        .children('span.availability')
        .contents()

      const products = keys
        .map(k => {
          const item = listings[k];
          return {
            id: item.attribs.href.replace(/[^0-9]/g, ''),
            name: item.attribs.title,
            link: item.attribs.href,
            price: prices[k].data,
            stock: availabilities[k].data === 'Available' ? true : false,
          }
        })
        .filter(prod => {
          return !env.blacklist.default.test(prod.name.toLowerCase());
        })

      if (!Object.keys(cache).length && products.length) {
        products.forEach(p => {
          cache[p.id] = p;
        });
        console.log(`Initialized cache for ${name}`)
      } else if (products.length) {
        products.forEach(p => {
          const record = cache[p.id]
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

