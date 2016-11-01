'use strict';
module.exports = function(beer) {
  return `
	  <table style="text-align:left;">
	    <thead>
	      <tr style="text-align:left;">
	        <th>Bubbly Beer Name</th>
	        <th>Bubbly Beer Price</th>
	      </tr>
	    </thead>
	    <tbody>
	      <tr style="text-align:left;">
	        <td><a href="${beer.link}">${beer.name}</a></td>
	        <td>${beer.price}</td>
	      </tr>
	    </tbody>
	  </table>
  `
}

