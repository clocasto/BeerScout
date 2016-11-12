'use strict';
const env = require('../env');
const requestSite = require('../request.js');

module.exports = function (name, cheerio, cache, title, sight) {
  const productViewer = require(`./_${name}`);
  const host = env.request[name][0].host;
  const protocol = env.request[name][0].protocol;

  return function (response) {
    let htmlDoc = '';

    //Handle errors from server
    response.on('error', function (err) {
      console.error(err);
    })

    //another chunk of data has been recieved, so append it to `htmlDoc`
    response.on('data', function (chunk) {
      htmlDoc += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {

      const $ = cheerio.load(htmlDoc);

      const listings = $('.description .title h3 a')
        .toArray()
        .slice(0, sight);

      const names = listings.map(listing => listing.children[0].data);
      const links = listings.map(listing => listing.attribs.href);
      const ids = links.map(link => /([0-9]+$)/.exec(link)[1]);

      let products = names
        .map((product, i) => {
          return {
            id: ids[i],
            name: product,
            link: links[i],
            request: {
              host,
              protocol,
              path: links[i].replace(`http://${host}`, '')
            }
          }
        })
        .filter(product => {
          if (cache.indexOf(product.id) > -1) return false;
          if (/poster|sign|shirt|glass|crate/.test(product.name.toLowerCase())) return false;
          if (/canti|fou|hanssens|hanss|hansens|cantillon|project|schramm|jester|farmstead|fonteinen|font|drei/.test(product.name.toLowerCase())) return true;
          return false;
        });

      if (!products.length) {
        console.log(`No updates for ${name}/${title}.`);
      } else if (!cache.length) {
        console.log(`Initialized cache for ${name}/${title}.`);
        products.forEach(product => {
          cache.push(product.id);
          console.log(`Added ${product.id} to ${env.tags[name]}/${title} cache.`);
        });
      } else {
        products.forEach((product, idx) => {
          cache.push(product.id);
          console.log(`Added ${product.id} to ${env.tags[name]}/${title} cache.`);
          setTimeout(requestSite.bind(null, productViewer(name, cheerio, cache, product, title, sight), product.request), 1250 + idx * 1250);
        });
      }
    });
  }
}

