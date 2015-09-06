var validator = require('validator');
var async = require('async');
var moment = require('moment');

/**
 * Authentication Controller
 *
 *
 */
var AuthController = {

    /**
     * Signin with local account
     * @param req
     * @param res
     */
    signin: function(req, res){
        passport.authenticate('local', function(err, user, info){
            if (err){
                return res.serverError(err);
            }
            if(!user){
                return res.badRequest();
            }
            // Create login session
            req.login(user, function (err) {
                if (err){
                    return res.serverError(err);
                }
                req.flash('success', 'Success.Auth.Login');
                var token = sails.services.auth.generateToken(user);
                return res.ok({
                    token: token,
                    user: user.toView(),
                    redirect: sails.config.urls.app
                });
            });
        })(req, res);
    },

    /**
     * Register a new user with local account
     * @param req
     * @param res
     * @returns {*|SendStream}
     */
    signup: function(req, res){
        var email = req.param('email');
        var password = req.param('password');

        // Email
        if( !validator.isEmail(email) ){
            return res.badRequest();
        }

        // Password must have at least 3 char
        if ( !validator.isLength(password, 3)) {
            return res.badRequest();
        }

        // Get default values like avatar / banner etc
        var values = {
          email: email
        };

        // Create the user and init everything necessary for application
        User.createAndInit(values, function (err, user) {
            if (err) {
                if (err.code === 'E_VALIDATION') {
                    if (err.invalidAttributes.email) {
                        // This error could be something else but as we validate before we should only get an error because email already taken here
                        return res.badRequest('Email already taken');
                    }
                    else {
                        return res.badRequest(err);
                    }
                }
                return res.serverError(err);
            }
            Passport.create({
                protocol : 'local',
                password : password,
                user     : user.id
            }, function (err, passport) {
                if (err) {
                    // It could be invalid password here but we check before with validator
                    return user.destroy(function (destroyErr) {
                        if(destroyErr){
                            sails.log.error(err);
                        }
                        return res.serverError(err);
                    });
                }

                req.login(user, function(err){
                    if(err){
                        return res.serverError(err);
                    }
                    req.flash('success', 'Success.Auth.Register');
                    var token = sails.services.auth.generateToken(user);
                    return res.ok({
                        token: token,
                        user: user.toView(),
                        redirect: sails.config.urls.app
                    });
                });
            });
        });
    },

    /**
     *
     * @param req
     * @param res
     */
    logout: function (req, res) {
        req.logout();
        req.flash('success', 'Success.Auth.Logout');
        res.redirect( sails.config.urls.signin );
    },

    /**
     * Issue a new valid token.
     * Need a previous valid token
     * The deletion of previous token can be make later, there is possible optimization here.
     *
     * So this method is called only if user is token authenticated so no need to more check
     */
    issueToken: function(req, res){
        var user = req.user;
        var token = sails.services.auth.generateToken(user);
        user.token = token;
        return res.ok({
            token: user.token
        });
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
