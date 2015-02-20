(function(){
    var Promise = require('bluebird');

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
            // If settings doesn't exist and it's not a possible setting nothing happen
            if(!_.isNull(settings)){
                _.forEach(settings, function(value, key){
                    user.setSettingValueOrCreate(key, value);
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
                dirname: sails.config.dataPublicPath + '/user/background',
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

                console.log(files);
                var image = req.user.addBackgroundImage(files[0]);
                req.user.save(function(err, user){
                    if(err){
                        return res.serverError(err);
                    }
                    return res.ok(image);
                })

            }
        }
    };
})();
