(function(){
    var Promise = require('bluebird');
    var path = require('path');
    
    module.exports = {

        me: function(req, res){
            var user = req.user;
            res.ok( user.toView() );
        },

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

        uploadBackgroundImage: function(req, res){
            req.file('uploadfile').upload({
                dirname: sails.config.paths.publicData,
                // don't allow the total upload size to exceed ~10MB
                maxBytes: 10000000
            }, whenDone);

            function whenDone(err, files){
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
                var url = require('util').format('%s/%s', '/' + sails.config.urls.data, filename);
                console.log(sails.config.urls.data);
                console.log(url);
                console.log(sails.config.paths.publicData);
                req.user.backgroundImages.push(url);
                req.user.save(function(err, user){
                    if(err){
                        return res.serverError(err);
                    }
                    return res.ok(url);
                });

            }
        }
    };
})();
