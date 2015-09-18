(function(){
    var validator = require('validator');
    
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

            if(!validator.isNumeric(id)){
                return res.badRequest();
            }

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
            var id = req.param('id', null);
            
            if(!validator.isNumeric(id)){
                return res.badRequest();
            }
            
            // Check profile
            Profile.findOne(id)
                .then(function(profile){
                    if(!profile){
                        return res.notFound();
                    }

                    profile.name = req.param('name', profile.name);
                    profile.description = req.param('description', profile.description);
                    profile.default = req.param('default', profile.default);

                    return profile.save();
                })
                .then(function(profile){
                    return res.ok(profile);
                })
                .catch(function(error){
                    return res.serverError(error);
                });
        },

        updateAll: function(req, res){
            return res.ok();
        },

        /**
         *
         * @param req
         * @param res
         */
        create: function(req, res){
            var data = {
                name: req.param('name'),
                description: req.param('description'),
                default: req.param('default', false),
                user: req.user.id
            };
            
            Profile.create(data)
                .then(function(profile){
                    return res.ok(profile.toView());
                })
                .catch(function(err){
                    // Validation error
                    if(err.ValidationError){
                        return res.badRequest(err.ValidationError);
                    }
                    else{
                        return res.serverError(err);
                    }
                });
        }

    };
})();
