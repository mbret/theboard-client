(function(){
    var path        = require('path');
    var validator   = require('validator');

    module.exports = {

        update: function(req, res){
            var user = req.user;
            
            var firstName = req.param('firstName', user.firstName);
            var lastName = req.param('lastName', user.lastName);
            var settings = req.param('settings', null); // collection of settings with their value
            var address = req.param('address', user.address);
            var backgroundImages = req.param('backgroundImages', user.backgroundImages);
            
            // Check if okay ...
            // @todo do that

            // Update user attribute
            user.firstName = firstName;
            user.lastName = lastName;
            user.address = address;
            user.backgroundImages = backgroundImages;
            
            // Update settings
            // If one setting doesn't exist it will be added to the list automatically by user
            // If settings doesn't exist and it's not a possible setting nothing happen (we catch it)
            if(!_.isNull(settings)){
                _.forEach(settings, function(value, key){
                    try{
                        user.setSettingValueOrCreate(key, value);
                    }
                    catch(err){
                        if(err.code !== 'INVALID_USER_SETTING'){
                            res.serverError(err);
                        }
                    }
                });
            }

            // Perform update in database
            user.save(function(err, userUpdated){
                if(err){
                    return res.serverError(err);
                }
                return res.ok(userUpdated);
            });
        },

        /**
         *
         * @param req
         * @param res
         */
        uploadBackgroundImage: function(req, res){

            var profile = req.param('profile', null);

            if(!validator.isNumeric(profile)){
                return res.badRequest('Profile is missing');
            }

            req.file('uploadfile').upload({

                dirname: sails.config.paths.publicData,
                // don't allow the total upload size to exceed ~10MB
                maxBytes: 10000000

            }, function (err, files){
                if(err){
                    return res.serverError(err);
                }

                // If no files were uploaded, respond with an error.
                if (files.length === 0){
                    return res.badRequest();
                }

                var file = files[0];
                var fdSplitted = file.fd.split(path.sep); // split with platform-specific separator
                var filename = fdSplitted[fdSplitted.length-1];
                var url = filename;

                // Get already set background images
                sails.models.usersetting.findOrCreate(
                    // search
                    {
                        user: req.user.id,
                        name: 'backgroundImages',
                        profile: profile
                    },
                    // record
                    {
                        user: req.user.id,
                        name: 'backgroundImages',
                        profile: profile,
                        type: 'array',
                        value: JSON.stringify([url])
                    })
                    .then(function(setting){

                        var urls = JSON.parse(setting.value);

                        // Has been created
                        if(urls.indexOf(url) !== -1){
                            return Promise.resolve(setting);
                        }
                        // We need to update
                        else{
                            urls.push(url);
                            setting.value = JSON.stringify(urls);
                            return setting.save();
                        }
                    })
                    .then(function(setting){
                        return res.ok(setting.toView());
                    })
                    .catch(function(err){
                        // @todo supprimer les images envoyés sur ce stream si une erreur survient

                        return res.serverError(err);
                    });

            });
        }
    };
})();
