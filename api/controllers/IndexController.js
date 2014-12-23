module.exports = {
  	
  	home: function (req, res) {
    	return res.ok(
    		null,
    		'index'
    	);
  	},

	settings: function(req, res){
		var settings = {
			paths: {
				server: '/',
				icons: '/app/icons',
				images: '/app/img'
			},
			routes: {
				widgets: {
					get: '/widgets',
					update: '/widgets'
				}
			},
			user: {
				backgroundImages: ['board (2).jpg', 'board (3).jpg', 'board (4).jpg', 'board (5).jpg', 'board (6).jpg', 'board (7).jpg', 'board (8).jpg', 'board (9).jpg']
			},
			environment: sails.config.environment
		};
		res.setHeader('Content-Type', 'application/javascript');
		res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
		res.setHeader('Pragma', 'no-cache');
		res.setHeader('Expires', 0);
		res.send('window.settings = ' + JSON.stringify(settings) + ';');
	},

	getWidgets: function(req, res){

		Widget.find().then(function(widgets){
			return res.ok(widgets);
		})

	},

	updateWidgets: function(req, res){
		return res.ok();
	}
};