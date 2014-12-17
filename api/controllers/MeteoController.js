module.exports = {
  	
  	getWeather: function (req, res) {
    	return res.ok({
    		today: 'clear',
    		tomorrow: 'cloudy'
    	});
  	}
};