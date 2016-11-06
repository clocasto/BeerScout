'use strict';
const sendMail = require('../email.js');
const env = require('../env');
const requestSite = require('../request.js');

module.exports = function(name, cheerio, cache, title, sight) {
  const productViewer = require(`./_${name}`);
  const host = env.request[name][0].host;
  const protocol = env.request[name][0].protocol;

  return function(response) {
    let htmlDoc = '';

    //another chunk of data has been recieved, so append it to `htmlDoc`
    response.on('data', function(chunk) {
      htmlDoc += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {

      const $ = cheerio.load(htmlDoc);

      const listings = $('.description .title h3 a')
        .toArray()
        .slice(0, sight);

      const names = listings.map(l => l.children[0].data);
      const links = listings.map(l => l.attribs.href);
      const ids = links.map(l => /([0-9]+$)/.exec(l)[1]);

      let products = names
        .map((p, i) => {
          return {
            id: ids[i],
            name: p,
            link: links[i],
            request: {
              host,
              protocol,
              path: links[i].replace(`http://${host}`, '')
            }
          }
        })
        .filter(p => {
          if (/poster|sign|shirt|glass|crate/.test(p.name.toLowerCase())) return false;
          if (cache.indexOf(p.id) > -1) return false;
          if (/cant|fou|hanssens|hansens|cantillon|fonteinen|font|drei/.test(p.name.toLowerCase())) return false;
          return false;
        });

      console.log(`List of products found for ${name}/${title}: ${products.map(p => p.id)}`)

      if (!products.length) {
        console.log(`No updates from ${name}/${title}.`);
      } else {
        if (cache.length) {
          products.forEach(p => requestSite(productViewer(name, cheerio, cache, p, title, sight), p.request))
        }
        products.forEach(l => {
          cache.push(l.id);
          console.log(`Added ${l.id} to ${env.tags[name]}/${title} cache.`);
        });
      }
      console.log(`Cache for ${name}/${title}: ${cache}`)
    });
  }
}

