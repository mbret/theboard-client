var request = require('request');

module.exports = {
  	
  	pipeCOR: function (req, res) {

		var content = null;

		//request(req.param('url'), function(err, resp, body) {
		//	console.log(body);
		//	content = body;
		//	pass back the results to client side
		//	res.send(content);
		//});
		request.get(req.param('url')).pipe(res);



  	}


};