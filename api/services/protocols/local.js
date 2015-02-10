var validator = require('validator');

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
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
