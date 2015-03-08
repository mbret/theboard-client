(function(){
    var Promise = require('bluebird');

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
