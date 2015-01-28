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

		Widget.update( {id:widget.id}, widgetsToUpdate, function(err, widgets){
			if(err){
				return res.serverError(err);
			}

			if(!widgets || widgets.length < 1) return res.notFound();

			return res.ok(widgets);
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