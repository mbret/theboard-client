var validator = require('validator');

/**
 *
 *
 * @param {Object}   req
 * @param {string}   identifier
 * @param {string}   password
 * @param {Function} next
 */
module.exports = function (req, identifier, password, next) {
    var query   = {};

    query.email = identifier;

    User.findOne(query, function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return next(null, false, {error: "Error.Passport.Email.NotFound"});
        }

        Passport.findOne({
            protocol : 'local',
         user     : user.id
        }, function (err, passport) {
          if (passport) {
            passport.validatePassword(password, function (err, res) {
              if (err) {
                return next(err);
              }

              if (!res) {
                return next(null, false, {error: 'Error.Passport.Password.Wrong'});
              } else {
                return next(null, user);
              }
            });
          }
          else {
            return next(null, false, {error: 'Error.Passport.Password.NotSet'});
          }
    });
  });
};
