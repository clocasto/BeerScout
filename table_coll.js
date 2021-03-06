'use strict';
module.exports = function(beer) {
  let buy = beer.buy ? `<td style="color:red">${beer.buy}</td>` : '<td>--</td>';
  let bid = beer.bid ? `<td style="color:blue">${beer.bid}</td>` : '<td>--</td>';
  let time = beer.timeLeft ? `<h3>Time left: ${beer.timeLeft}</h3>` : '';

  return `
	  ${time}
	  <table style="text-align:left;">
	    <thead>
	      <tr style="text-align:left;">
	        <th>Bubbly Beer Name</th>
	        <th>Bubbly Bid Price</th>
	        <th>Bubbly Buy-It-Now Price</th>
	      </tr>
	    </thead>
	    <tbody>
	      <tr style="text-align:left;">
	      	<td><a href="${beer.link}">${beer.name}</a></td>
	        ${bid}
	        ${buy}
	      </tr>
	    </tbody>
	  </table>
  `
}

