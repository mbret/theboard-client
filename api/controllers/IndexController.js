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
				icons: '/app/icons'
			},
			routes: {
				widgets: {
					get: '/widgets',
					update: '/widgets'
				}
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
		return res.ok([

			{
				identity: 'Widget meteo',
				identityHTML: 'widget-meteo',
				url: 'widgets/meteo/widget.html',
				baseURL: 'widgets/meteo/widget.html',
				permissions: [
					'mail',
					'location'
				],
				defaultLocation: 'New York',
				sizeX: 2,
				sizeY: 1,
				row: 0,
				col: 0
			},
			{
				identity: 'Widget clock',
				identityHTML: 'widget-clock',
				url: 'widgets/clock/widget.html',
				baseURL: 'widgets/clock/widget.html',
				backgroundColor: '#202020',
				sizeX: 2,
				sizeY: 1,
				row: 0,
				col: 2
			},
			{
				identity: 'Widget sample',
				identityHTML: 'widget-sample',
				url: 'widgets/sample/widget.html',
				baseURL: 'widgets/sample/widget.html',
				backgroundColor: '#57aae1',
				grant_access:[
					'user_mail',
					'location'
				],
				sizeX: 1,
				sizeY: 1,
				row: 0,
				col: 4
			},
			{
				identity: 'Widget meteo 4',
				identityHTML: 'widget-meteo4',
				url: 'widgets/meteo/widget.html',
				baseURL: 'widgets/meteo/widget.html',
				defaultLocation: 'New York',
				sizeX: 1,
				sizeY: 1,
				row: 0,
				col: 5
			},
			{
				identity: 'Widget meteo 5',
				identityHTML: 'widget-meteo5',
				url: 'widgets/meteo/widget.html',
				baseURL: 'widgets/meteo/widget.html',
				defaultLocation: 'New York',
				sizeX: 2,
				sizeY: 1,
				row: 1,
				col: 0
			},
		]);
	},

	updateWidgets: function(req, res){
		return res.ok();
	}
};