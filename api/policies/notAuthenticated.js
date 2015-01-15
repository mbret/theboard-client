/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

    // This policy should return forbidden page and not redirect
    // because the redirect could send to location that also match this policy
    // and it could catch a infinite loop.
    if (req.isAuthenticated()) {
        return res.forbidden();
    }

    return next();
};
