'use strict';
const tableMaker = require('../table');
const sendMail = require('../email.js');
const env = require('../env');

module.exports = function (name, cheerio, cache) {
  return function (response) {
    let htmlDoc = '';

    //Handle errors from server
    response.on('error', function (err) {
      const errorMessage = `<h4>${name}</h4><br><span>${err}</span>`;
      const subject = env.error.subject;
      sendMail(errorMessage, subject, env.toList.admin);
    })

    //another chunk of data has been recieved, so append it to `htmlDoc`
    response.on('data', function (chunk) {
      htmlDoc += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {

      const $ = cheerio.load(htmlDoc);

      const listings = $('.itemTitle a')
        .toArray()
      const names = listings.map(l => l.children[0].data);
      const links = listings.map(l => l.attribs.href);
      const stock = $('.tabTable .productListing-rowheading')
        .siblings()
        .toArray()
        .map(n => n.children[1].children[0].data);
      const prices = $('.tabTable .productListing-rowheading')
        .siblings()
        .toArray()
        .map(n => n.children[9].children[0].data);
      const ids = links.map(l => /products\_id\=([0-9]+)/.exec(l)[1])

      const products = names
        .map((p, i) => {
          return {
            id: ids[i],
            name: p,
            link: links[i],
            price: prices[i],
            stock: stock[i]
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
            setTimeout(sendMail.bind(null, tableMaker(p), `[${env.tags[name]}] NEW - ${p.price}, ${p.name}`, env.toList[name]), Math.min(500, Math.random() * 2000));
          } else {
            if (!record.stock && p.stock) {
              console.log(`${name} - In Stock: ${p.name}`)
              setTimeout(sendMail.bind(null, tableMaker(p), `[${env.tags[name]}] REPLENISH - ${p.price}, ${p.name}`, env.toList[name]), Math.min(500, Math.random() * 2000));
            } else if ((p.price < record.price) && p.stock) {
              console.log(`${name} - Price Slash: ${p.name}`)
              setTimeout(sendMail.bind(null, tableMaker(p), `[${env.tags[name]}] PRICE DROP: ${p.price}, ${p.name}`, env.toList[name]), Math.min(500, Math.random() * 2000));
            }
            cache[p.id] = p;
          }
        })
      }
      console.log(`No updates for ${name}.`);
    });
  }
}

