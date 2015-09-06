(function(){
    'use strict';

    var Promise = require('bluebird');
    var validator = require('validator');
    var util = require('util');

    module.exports = {

        /**
         * Return widgets of logged user.
         * - Use req.profile if specified or default user profile
         * @param req
         * @param res
         */
        findAll: function(req, res){
            var user = req.user;

            // get possible specific profile
            var profileId = req.param('profile', null);
            if(profileId !== null && !validator.isNumeric(profileId)){
                return res.badRequest(null, null, 'The profile id is invalid');
            }

            var query = { user: user.id };
            var data = [];

            // Use default profile or specific one
            if( profileId === null ){
                query.default = true;
            }
            else{
                query.id = profileId;
            }

            Profile
                // Get profile with widgets populated
                .findOne(query).populate('widgets')
                .then(function(profile){

                    if(!profile) return res.notFound();

                    return Promise.map(profile.widgets, function(profileWidget){

                        // load complete data about widgets
                        // db is not enough, we need information about package
                        return profileWidget
                            .loadCompleteObject()
                            .then(function(){
                                data.push(profileWidget.toJSON());
                            });
                    });
                })
                .then(function(){
                    return res.ok(data);
                })
                .catch(res.serverError);

        },

        /**
         * Add a widget to the specific profile
         * - add the widget with its default configuration
         * @param req
         * @param res
         */
        addWidgetToProfile: function(req, res){
            var profileId       = req.param('profile', null);
            var widgetIdentity  = req.param('widget', null);
            var location        = req.param('location', 'remote');

            // Validation
            if( ['local', 'remote'].indexOf(location) === -1 ){
                return res.badRequest(null,  null, 'bad location');
            }

            if(!validator.isInt(profileId)){
                return res.badRequest(null,  null, 'bad profile id');
            }

            if(validator.isNull(widgetIdentity)){
                return res.badRequest(null,  null, 'bad widget identity');
            }

            // Load profile for current user
            Profile.findOne({user: req.user.id, id: profileId})
                .then(function(profile){

                    if(!profile){
                        return res.badRequest(null, null, "This profile doesn't exist");
                    }

                    // Add widget to the list of widgets
                    return ProfileWidget.createWithRepo(widgetIdentity, location, profile.id)
                        .then(function(widget){
                            return res.ok(widget);
                        })
                        .catch(function(err){
                            // Unable to load this widget because he is invalid
                            // Something went wrong with widget validation
                            if(err.code === 'WIDGET_INVALID'){
                                return res.badRequest(null, null, 'Widget invalid');
                            }
                            throw err;
                        });

                })
                .catch(res.serverError);

        },

        removeWidgetFromProfile: function(req, res){
            var profileId       = req.param('profile', null);
            var widgetIdentity  = req.param('widget', null);
            var location        = req.param('location', 'remote');

            // Validation
            if( ['local', 'remote'].indexOf(location) === -1 ){
                return res.badRequest(null,  null, 'bad location');
            }

            if(!validator.isInt(profileId)){
                return res.badRequest(null,  null, 'bad profile id');
            }

            if(validator.isNull(widgetIdentity)){
                return res.badRequest(null,  null, 'bad widget identity');
            }

            // Load profile for current user
            Profile.findOne({user: req.user.id, id: profileId})
                .then(function(profile){

                    if(!profile){
                        return res.badRequest(null, null, "This profile doesn't exist");
                    }

                    return ProfileWidget.destroy({
                        profile: profile.id,
                        widget: widgetIdentity
                    })
                        .then(function(){
                           return res.ok();
                        });

                })
                .catch(res.serverError);
        },

        /**
         * Update a widget for a specific user for a specific profile
         * @param req
         * @param res
         */
        updateProfileWidget: function(req, res){
            var user = req.user;
            var widgetID = req.param('widget');
            var profileId = req.param('profile', null);

            var query = {
                user: user.id
            };

            if( !profileId ){
                query.default = true;
            }
            else{
                query.id = profileId;
            }

            // Get default activated profile
            Profile.findOne(query)
                .then(function(profile){

                    // Load widget profile
                    return ProfileWidget.findOne({profile:profile.id, widget: widgetID});
                })
                .then(function(profileWidget){

                    if(!profileWidget){
                        return res.badRequest(util.format('Widget %s not found for profile %s', widgetID, profile));
                    }

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

                    return profileWidget.save();
                })
                .then(function(profileWidgetUpdated){
                    return res.ok(profileWidgetUpdated.toJSON());
                })
                .catch(res.serverError);
        },

    };
})();
