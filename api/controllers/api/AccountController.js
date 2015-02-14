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
            
            // Check if okay ...
            // @todo do that

            // Update user attribute
            user.firstName = firstName;
            user.lastName = lastName;
            user.address = address;
            
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
        }

    };
})();
