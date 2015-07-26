(function(){
    'use strict';

    var Promise = require('bluebird');
    var validator = require('validator');

    module.exports = {

        /**
         * Return widgets of logged user.
         * @param req
         * @param res
         */
        findAll: function(req, res){
            var user = req.user;
            var profileId = req.param('profileid', null);
            var query = { user: user.id };
            var data = [];

            if( profileId === null ){
                query.default = true;
            }
            else{
                query.id = profileId;
            }

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
         * Add a widget to the specific profile
         * - add the widget with its default configuration
         * @param req
         * @param res
         */
        addProfileWidget: function(req, res){
            var profileId       = req.param('profileid', null);
            var widgetIdentity  = req.param('widget', null);
            var location        = req.param('location', 'remote');

            // Validation
            if( ['local', 'remote'].indexOf(location) === -1 ){
                return res.badRequest('bad location');
            }

            if(!validator.isInt(profileId)){
                return res.badRequest('bad profile id');
            }

            if(validator.isNull(widgetIdentity)){
                return res.badRequest('bad widget identity');
            }

            // Add widget to profile
            ProfileWidget
                .addToProfile(widgetIdentity, location)
                .then(function(widget){
                    return res.ok(widget);
                })
                .catch(function(err){
                    // Unable to add this widget because he is invalid
                    // Something went wrong with widget validation
                    if(err.code === 'WIDGET_INVALID'){
                        return res.badRequest('Widget invalid');
                    }
                    return res.serverError(err);
                });

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
            if( req.session.profile ){
                query.id = req.session.profile;
            }
            else{
                query.default = true;
            }

            // Get default activated profile
            Profile.findOne(query).then(function(profile){

                // Load widget profile
                ProfileWidget.findOne({profile:profile.id, widget: widgetID}).then(function(profileWidget){

                    if(!profileWidget){
                        return res.notFound();
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

                    return profileWidget.save().then(function(profileWidget){
                        return res.ok(profileWidget);
                    });
                });
            }).catch(res.serverError);
        },

    };
})();
