module.exports = {

	/**
	 * Return the app page
	 * @param req
	 * @param res
	 * @returns {*}
	 */
  	index: function (req, res) {
		var data = {};
    	return res.view('app', data);
  	},
	
	getFlashMessages: function(req, res){
		return res.ok({
			errors    : req.flash('error'),
			success : req.flash('success'),
			warnings  : req.flash('warning'),
			info: req.flash('info')
		})	
		
	},

	/**
	 * Return the settings of application
	 * @param req
	 * @param res
	 */
	getConfiguration: function(req, res){
		var user = req.user;
		var config = _.assign(sails.config.frontApp, {
			// user logged
			user: user.toView(),
			sdfsdf: 'sdfds'
		});
		res.ok(config);
	},

	/**
	 * Return widgets of logged user
	 * @param req
	 * @param res
	 */
	getWidgets: function(req, res){
		var user = req.user;
		var data = [];
		UserWidget.find({user: user.id}).populate('widget').then(function(results){
			_.forEach(results, function(result){
				// We create a widget from default widget
				// And we overwrite with the user widget settings
				var widget = _.assign(result.widget, {
					sizeX: result.sizeX,
					sizeY: result.sizeY,
					row: result.row,
					col: result.col
				});
				_.forEach(widget.options, function(option, index){
					option.value = result.getOptionValue(option.id);
				});
				data.push(widget);
			});
			return res.ok(data);
		})
	},

	/**
	 * Update a widget for a specific user
	 * @param req
	 * @param res
	 */
	updateWidget: function(req, res){
		var user = req.user;
		var widgetID = req.param('id');

		// Load widget
		UserWidget.findOne({user:user.id, widget:widgetID}, function(err, widget){
			if(err){
				return res.serverError(err);
			}
			if(!widget) return res.notFound();
			
			// Update pos
			widget.sizeX = req.param('sizeX', widget.sizeX);
			widget.sizeY = req.param('sizeY', widget.sizeY);
			widget.row = req.param('row', widget.row);
			widget.col = req.param('col', widget.col);
			
			// Option update
			var options = req.param('options', null);
			_.forEach(options, function(value, name){
				widget.setOptionValue(name, value);
			});
			console.log(widget.options);

			widget.save(function(err, widgets){
				if(err){
					return res.serverError(err);
				}

				if(!widgets || widgets.length < 1) return res.notFound();

				return res.ok(widgets);
			});
		});
		
	},

	getAccountData: function(req, res){
		var user = req.user;
		res.ok( user.toView() );
	},

	updateAccountData: function(req, res){
		var user = req.user;
		var firstName = req.param('firstName', user.firstName);
		var lastName = req.param('lastName', user.lastName);
		var settings = req.param('settings', null); // collection of settings with their value
		
		// Check if okay ...
		// @todo do that

		// Update user attribute
		user.firstName = firstName;
		user.lastName = lastName;
	
		// Update settings
		// If one setting doesn't exist it will be added to the list automatically by user
		// If settings doesn't exist and it's not a possible setting nothing happen
		if(!_.isNull(settings)){
			_.forEach(settings, function(value, key){
				user.setSettingValueOrCreate(key, value);
			})
		}
		
		// Perform update in database
		user.save(function(err, userUpdated){
			if(err){
				return res.serverError(err);
			}
			return res.ok();
		});
	},



	pipeCOR: function (req, res) {

		if(sails.config.environment === 'production'){
			console.error('You must disable this route for production');
		}
		var content = null;

		//request(req.param('url'), function(err, resp, body) {
		//	console.log(body);
		//	content = body;
		//	pass back the results to client side
		//	res.send(content);
		//});
		require('request').get(req.param('url')).pipe(res);



	}
};