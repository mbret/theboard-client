var jwt = require('jsonwebtoken');

/**
 *
 *
 */
module.exports = function(req, res, next) {

    var passport = sails.services.passport;
    var secret = sails.config.token.secret;
    var token;
    
    if (req.headers && req.headers.authorization) {
        // token should looks like 'Bearer 45qs56d4qs56d4qsd...'
        var parts = req.headers.authorization.split(' ');
        token = parts[1];
        if( typeof token === "undefined" ){
            return res.forbidden({error: (new Error('Token malformed')).message});
        }
    }
    else{
        return res.forbidden();
    }
    
    // decoded.iat = issued at (unix)
    // decoded.exp = expire at (unix)
    jwt.verify(token, secret, function(err, decoded) {
        sails.log.debug('token', decoded);
        if (err){
            if(err.name === "TokenExpiredError"){
                sails.log.debug('TokenExpiredError');
            }
            if(err.name === "JsonWebTokenError"){
                sails.log.debug('JsonWebTokenError');
            }
            return res.forbidden({error: err.message});
        }

        var user = decoded.user;
        passport.token.deserializeUser(user, function( err, object ){
            if(err){
                return res.serverError(err);
            }
            if(!object){
                return res.forbidden({error: 'Token invalid'});
            }
            req.user = object;
            req.token = token;
            next();
        });

    });

};
