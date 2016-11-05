'use strict';
module.exports = function(beer) {
	let buy = beer.buy ? `<td>BUYOUT</td>
	        <td>${beer.buy}</td>` : '';
  return `
	  <h5>Time left: ${beer.timeLeft}</h5>
	  <table style="text-align:left;">
	    <thead>
	      <tr style="text-align:left;">
	        <th><a href="${beer.link}">${beer.name}</a></th>
	        <th>Bubbly Beer Price</th>
	      </tr>
	    </thead>
	    <tbody>
	      <tr style="text-align:left;">
	        <td>BID</td>
	        <td>${beer.bid}</td>
	        ${beer.buy ? buy : ''}
	      </tr>
	    </tbody>
	  </table>
  `
}

