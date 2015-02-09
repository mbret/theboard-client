var Promise = require('bluebird');

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
		});
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
			user: user.toView()
		});
        config.user.useragent = req.headers['user-agent'];
        config.user.profile = req.session.profile;
		res.ok(config);
	},

    /**
     * Return the list of user profiles
     * The user must be logged
     * @param req
     * @param res
     */
    getProfiles: function(req, res){
        var user = req.user;
        var data = [];
        Profile.find({user: user.id}).populate('widgets').then(function(results){
            return res.ok(results);
        }).catch(function(err){
            return res.serverError(err);
        });
    },

    /**
     * Update a user profile
     * WARNING this method is not transactional and should be
     * @todo use transactions here
     * @todo see http://blog.evizija.si/sails-js-waterline-mysql-transactions/ for transaction support
     * @param req
     * @param res
     */
    updateProfile: function(req, res){
        var user = req.user;
        
        var wantToActivate = req.param('activate', null);
        
        // Check profile
        Profile.findOne(req.param('id'))
            .then(function(profile){
                if(!profile){
                    return profile;
                }
                
                var toUpdate = {
                    name: req.param('name', profile.name),
                    description: req.param('description', profile.description)
                };

                return Profile.update(profile.id, toUpdate);
            })
            .then(function(profile){
                if(! profile || profile.length < 1) return res.notFound();
                
                // save profile for this session
                if( wantToActivate == true ){
                    req.session.profile = profile[0].id;
                }
                
                return Profile.findOne(profile[0].id).populate('widgets').then(function(profile){
                    return res.ok(profile);
                });
            })
            .catch(res.serverError);
    },

	/**
	 * Return widgets of logged user.
	 * @param req
	 * @param res
	 */
	getWidgets: function(req, res){
		var user = req.user;
        var profileId = req.param('profileid', null);
        var query = { user: user.id };
		var data = [];
        
        if( profileId === null ){
            // current profile for session
            if( req.session.profile ){
                query.id = req.session.profile
            }
            else{
                query.default = true;
            }
        }
        else{
            query.id = profileId;
        }
        console.log(query);
        
        // get activated profile
        Profile.findOne(query).populate('widgets').then(function(profile){
            if(!profile){
                return res.notFound();
            }
            
            var profileWidgets = profile.widgets;
            
            // load all widgets
            return Promise.map(profileWidgets, function(profileWidget){
                return Widget.findOne(profileWidget.widget).then(function(widget){
                    // We create a widget from default widget
                    // And we overwrite with the user widget settings
                    var widgetForView = _.assign(widget, {
                        sizeX: profileWidget.sizeX,
                        sizeY: profileWidget.sizeY,
                        row: profileWidget.row,
                        col: profileWidget.col
                    });
                    // We also set widget options specific for our user
                    _.forEach(widgetForView.options, function(option, index){
                        option.value = profileWidget.getOptionValue(option.id);
                    });
                    data.push(widgetForView);
                    return widget;
                });
            }).then(function(widgets){
                return res.ok(data);
            });
        }).catch(res.serverError);

	},

	/**
	 * Update a widget for a specific user for a specific profile
	 * @param req
	 * @param res
	 */
	updateProfileWidget: function(req, res){
		var user = req.user;
		var widgetID = req.param('id');

        var query = {
            user: user.id
        };
        if( req.session.profile ) query.id = req.session.profile;
        else{
            query.default = true;
        }
        
        // Get default activated profile
        Profile.findOne(query).then(function(profile){

            console.log(profile);
            // Load widget profile
            ProfileWidget.findOne({profile:profile.id, widget: widgetID}).then(function(profileWidget){

                console.log(profileWidget);
                if(!profileWidget) return res.notFound();

                // Update pos
                profileWidget.sizeX = req.param('sizeX', profileWidget.sizeX);
                profileWidget.sizeY = req.param('sizeY', profileWidget.sizeY);
                profileWidget.row = req.param('row', profileWidget.row);
                profileWidget.col = req.param('col', profileWidget.col);

                // Option update
                var options = req.param('options', null);
                _.forEach(options, function(option){
                    profileWidget.setOptionValue(option.id, option.value);
                });
                console.log(profileWidget.options);

                return profileWidget.save().then(function(profileWidget){
                    return res.ok(profileWidget);
                });
            });
        }).catch(res.serverError);
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