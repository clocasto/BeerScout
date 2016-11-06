'use strict';
const tableMaker = require('../table');
const sendMail = require('../email.js');
const env = require('../env');

module.exports = function(site, cheerio, cache) {
  return function(response) {
    let htmlDoc = '';

    //another chunk of data has been recieved, so append it to `htmlDoc`
    response.on('data', function(chunk) {
      htmlDoc += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {
      const $ = cheerio.load(htmlDoc);
      const table = $('#latest')[0];
      let name = table.children[1].children[2].children[0].children[1].data;
      if (!name) name =  table.children[1].children[2].children[0].children[1].children[0].data;
      const price = table.children[1].children[3].children[0].data;
      const _path = table.children[1].children[2].children[0].attribs.href;
      const link = `${env.siteInfo[site].domain}${_path}`;
      const _id = Number(_path.replace(/[^0-9]/g, ''));
      if (cache.indexOf(_id) > -1) {
        console.log(`No updates from ${site}.`);
      } else {
        if (!cache.length) {
          console.log(`Initialized cache for ${site}`)
          cache.push(_id);
        } else {
          if (!(/cant|fou|hanssens|hansens|cantillon|fonteinen|font|drei/.test(name.toLowerCase()))) return;
          console.log(`Updating ${site} cache with ${_id}!`);
          cache.push(_id);
          if (cache.length > 5) cache.shift();
          console.log(`${env.tags[site]} - New Listing!`)
          setTimeout(sendMail.bind(null, tableMaker({ name, price, link }), `[${env.tags[site]}] NEW - ${price}, ${name}`, env.toList[site]), Math.min(500, Math.random() * 10000));
        }
      }
    });
  }
}

