var validator = require('validator');
var async = require('async');

/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var AuthController = {

    /**
    * Render the login page
    *
    * We could optionally add CSRF-protection as outlined in the documentation:
    * http://sailsjs.org/#!documentation/config.csrf
    *
    * Looks up a user using the supplied identifier (email or username) and then
    * attempts to find a local Passport associated with the user. If a Passport is
    * found, its password is checked against the password supplied in the form.
    *
    * @param {Object} req
    * @param {Object} res
    */
    login: function (req, res) {
        var strategies = sails.config.passport;
        var providers  = {};

        // Get a list of available providers for use in your templates.
        Object.keys(strategies).forEach(function (key) {
            if (key === 'local') {
                return;
            }
            providers[key] = {
                name: strategies[key].name,
                token: key
            };
        });

        // Form submitted
        if( req.param('email') ){
            passport.authenticate('local', function(err, user, info){
                if (err){
                    sails.log.error(err);
                    return send('Error.Application.Generic');
                }
                if(!user){
                    return send(info.error, true);
                }
                // Create login session
                req.login(user, function (err) {
                    if (err){
                        sails.log.error(err);
                        return send('Error.Application.Generic');
                    }
                    req.flash('success', 'Success.Auth.Login');
                    return res.redirect('/');
                });
            })(req, res);
        }
        else{
            return send();
        }

        function send(err, badRequest){
            if(err){
                req.flash('error', err);
            }
            if(badRequest){
                res.status(400);
            }
            // Render the `auth/login.ext` view
            res.view('auth/login',{
                title: 'Board | Login',
                layout: 'layout-auth',
                errors    : req.flash('error'),
                successes : req.flash('success'),
                copy: sails.config.general.copy,
                providers: providers
            });
        }
    },

    /**
    * Log out a user and return them to the homepage
    *
    * Passport exposes a logout() function on req (also aliased as logOut()) that
    * can be called from any route handler which needs to terminate a login
    * session. Invoking logout() will remove the req.user property and clear the
    * login session (if any).
    *
    * For more information on logging out users in Passport.js, check out:
    * http://passportjs.org/guide/logout/
    *
    * @param {Object} req
    * @param {Object} res
    */
    logout: function (req, res) {
        req.logout();
        req.flash('success', 'Success.Auth.Logout');
        res.redirect('/');
    },

    /**
    * Render the registration page
    *
    * In case of error a simple message is sent to the view.
    * Indeed it's for the view to handle error in front-side
    *
    * @param {Object} req
    * @param {Object} res
    */
    register: function (req, res) {

        if( req.param('email') ){
            var email = req.param('email');
            var password = req.param('password');

            // Email
            if( !validator.isEmail(email) ){
                return send( 'Error.Form.Invalid' );
            }

            // Password must have at least 3 char
            if ( !validator.isLength(password, 3)) {
                return send( 'Error.Form.Invalid' );
            }

            // Create the user and init everything necessary for application
            User.createAndInit({
                email    : email
            }, function (err, user) {
                if (err) {
                    if (err.code === 'E_VALIDATION') {
                        if (err.invalidAttributes.email) {
                            // This error could be something else but as we validate before we should only get an error because emeail already taken here
                            return send( 'Error.Passport.Email.Exists' );
                        } else {
                            return send( 'Error.Passport.User.Exists' );
                        }
                    }
                    sails.log.error(err);
                    return send( 'Error.Application.Generic' );
                }
                Passport.create({
                    protocol : 'local',
                    password : password,
                    user     : user.id
                }, function (err, passport) {
                    if (err) {
                        sails.log.error(err);
                        // It could be invalid password here but we check before with validator
                        return user.destroy(function (destroyErr) {
                            if(destroyErr){
                                sails.log.error(err);
                            }
                            return send('Error.Application.Generic');
                        });
                    }
                    req.login(user, function(err){
                        if(err){
                            return send('Error.Application.Generic');
                        }
                        req.flash('success', 'Success.Auth.Register&Login');
                        return res.redirect('/');
                    });
                });
            });
        }
        else{
            return send();
        }

        function send(err){
            if(err){
                req.flash('error', err);
            }
            res.view('auth/register',{
                title: 'Board | Register',
                layout: 'layout-auth',
                errors: req.flash('error'),
                copy: sails.config.general.copy
            });
        }
    },

    /**
    * Create a third-party authentication endpoint
    *
    * @param {Object} req
    * @param {Object} res
    */
    provider: function (req, res) {
        passport.endpoint(req, res);
    },

  /**
   * Create a authentication callback endpoint
   *
   * This endpoint handles everything related to creating and verifying Pass-
   * ports and users, both locally and from third-aprty providers.
   *
   * Passport exposes a login() function on req (also aliased as logIn()) that
   * can be used to establish a login session. When the login operation
   * completes, user will be assigned to req.user.
   *
   * For more information on logging in users in Passport.js, check out:
   * http://passportjs.org/guide/login/
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: function (req, res) {

    var action = req.param('action');

    function handleError (err) {

      if( err.code === 'E_VALIDATION' ){
          sails.log.error('An error occured when authenticate', err);
      }
      else{
        sails.log.debug('An error occured during register form', err);
      }

      // Only certain error messages are returned via req.flash('error', someError)
      // because we shouldn't expose internal authorization errors to the user.
      // We do return a generic error and the original request body.
      var flashError = req.flash('error')[0];

      if (err && !flashError ) {
        req.flash('error', 'Error.Passport.Generic');
      } else if (flashError) {
        req.flash('error', flashError);
      }
      req.flash('form', req.body);

      // If an error was thrown, redirect the user to the
      // login, register or disconnect action initiator view.
      // These views should take care of rendering the error messages.
      switch (action) {
        case 'register':
          res.redirect('/register');
          break;
        case 'disconnect':
          res.redirect('back');
          break;
        default:
          res.redirect('/login');
      }
    }

    // Authenticate
    passport.callback(req, res, function (err, user) {
      if (err) {
        return handleError(err);
      }

      // Create login session
      req.login(user, function (err) {
        if (err) {
          return handleError(err);
        }

        req.flash('success', 'You have been logged');
        sails.log.debug('User ', user, ' logged!');
        // Upon successful login, send the user to the homepage were req.user
        // will available.
        res.redirect('/');
      });
    });
  },

  /**
   * Disconnect a passport from a user
   *
   * @param {Object} req
   * @param {Object} res
   */
  disconnect: function (req, res) {
    passport.disconnect(req, res);
  }
};

module.exports = AuthController;

/**
 * Assign local Passport to user
 *
 * This function can be used to assign a local Passport to a user who doens't
 * have one already. This would be the case if the user registered using a
 * third-party service and therefore never set a password.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
//exports.connect = function (req, res, next) {
//    var user     = req.user
//        , password = req.param('password');
//
//    Passport.findOne({
//        protocol : 'local'
//        , user     : user.id
//    }, function (err, passport) {
//        if (err) {
//            return next(err);
//        }
//
//        if (!passport) {
//            Passport.create({
//                protocol : 'local'
//                , password : password
//                , user     : user.id
//            }, function (err, passport) {
//                next(err, user);
//            });
//        }
//        else {
//            next(null, user);
//        }
//    });
//};
