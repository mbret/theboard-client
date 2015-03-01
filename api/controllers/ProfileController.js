(function(){
    var Promise = require('bluebird');

    module.exports = {

        /**
         * Return the list of user profiles
         * The user must be logged
         * @param req
         * @param res
         */
        findAll: function(req, res){
            var user = req.user;
            var data = [];
            Profile.find({user: user.id}).populate('widgets').then(function(results){
                return res.ok(results);
            }).catch(function(err){
                return res.serverError(err);
            });
        },

        find: function(req, res){
            var id = req.param('id', null);
            Profile.findOne(id).populate('widgets')
                .then(function(result){
                    if(!result){
                        return res.notFound();
                    }
                    return res.ok(result);
                })
                .catch(res.serverError);
        },
        
        /**
         * Update a user profile
         * WARNING this method is not transactional and should be
         * @todo use transactions here
         * @todo see http://blog.evizija.si/sails-js-waterline-mysql-transactions/ for transaction support
         * @param req
         * @param res
         */
        update: function(req, res){
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
                    if(! profile || profile.length < 1){
                        return res.notFound();
                    }

                    // save profile for this session
                    if( wantToActivate === true ){
                        req.session.profile = profile[0].id;
                    }

                    return Profile.findOne(profile[0].id).populate('widgets').then(function(profile){
                        return res.ok(profile);
                    });
                })
                .catch(res.serverError);
        },

        updateAll: function(req, res){
            return res.ok();
        }

    };
})();
