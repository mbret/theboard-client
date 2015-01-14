module.exports = {
  	
  	index: function (req, res) {
    	return res.view('app');
  	},

	settings: function(req, res){
		console.log(req.user);
		var settings = {
			paths: {
				server: '/',
				icons: '/app/icons',
				images: '/app/img'
			},
			messages: {
				errors: {
					unableToUpdate: 'Sorry but we were unable to update',
					unableToLoad: 'Sorry but we were unable to load',
					geolocation: {
						unsupportedBrowser:'Browser does not support location services',
						permissionDenied:'You have rejected access to your location',
						positionUnavailable:'Unable to determine your location',
						timeout:'Service timeout has been reached'
					},
					widgets: {
						unableToUpdate: 'Sorry but we were unable to save your new widget organization!',
						unableToLoad: 'Sorry but we were unable to load your widgets!'
					}
				},
				widgets: {
					updated: 'Widgets updated!'
				},
				account: {
					updated: 'Account updated!'
				}
			},
			routes: {
				widgets: {
					get: '/widgets', // get
					update: '/widgets' // put
				},
				account: {
					get: '/account', // get
					update: '/account' // put
				}
			},
			user: {
				id: req.user.id,
				username: req.user.username,
				mail: req.user.mail,
				avatar: req.user.avatar,
				backgroundImagesInterval: req.user.backgroundImagesInterval,
				backgroundImages: req.user.backgroundImages
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

	/**
	 * Update a widget
	 * @param req
	 * @param res
	 */
	updateWidget: function(req, res){

		var widget = req.param('widget');
		var widgetsToUpdate = {
			sizeX: widget.sizeX,
			sizeY: widget.sizeY,
			row: widget.row,
			col: widget.col
		};

		console.log('widget',widget);

		Widget.update( {id:widget.id}, widgetsToUpdate, function(err, widgets){
			if(err){
				return res.serverError(err);
			}

			if(!widgets || widgets.length < 1) return res.notFound();

			return res.ok(widgets);
		});
	},

	getAccountData: function(req, res){
		return res.ok({
			firstName: 'Maxime',
			lastName: 'Bret'
		});
	},

	updateAccountData: function(req, res){
		console.log(req.param('firstName'), req.param('lastName'));
		return res.ok();
	}
};