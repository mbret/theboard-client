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
   * @param {Object} req
   * @param {Object} res
   */
  login: function (req, res) {
      var strategies = sails.config.passport;
      var providers  = {};

      var form = req.flash('form')[0]; // get previous posted form

      // Render the `auth/login.ext` view
      res.view('auth/login',{
            title: 'Board | Login',
            layout: 'layout-auth',
            errors    : req.flash('error'),
            successes : req.flash('success'),
            identifier: (form && form.identifier) ? form.identifier : null,
            copy: 'The Board &copy; 2014'
      });
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
        req.flash('success', 'You have been logout!');
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
                send( 'Form invalid' );
            }

            // Password must have at least 3 char
            if ( !validator.isLength(password, 3)) {
                send( 'Form invalid' );
            }

            User.create({
                email    : email
            }, function (err, user) {
                if (err) {
                    if (err.code === 'E_VALIDATION') {
                        if (err.invalidAttributes.email) {
                            // This error could be something else but as we validate before we should only get an error because emeail already taken here
                            send( 'Error.Passport.Email.Exists' );
                        } else {
                            send( 'Error.Passport.User.Exists' );
                        }
                    }
                    sails.log.error(err);
                    send( 'An unexpected error happened, try again' );
                }
                Passport.create({
                    protocol : 'local'
                    , password : password
                    , user     : user.id
                }, function (err, passport) {
                    if (err) {
                        sails.log.error(err);
                        // It could be invalid password here but we check before with validator
                        return user.destroy(function (destroyErr) {
                            if(destroyErr){
                                sails.log.error(err);
                            }
                            send('An unexpected error happened, try again');
                        });
                    }
                    req.flash('success', 'Account created');
                    res.redirect('/');
                });
            });
        }
        else{
            send();
        }

        function send(err){
            if(err){
                req.flash('error', err);
            }
            res.view('auth/register',{
                title: 'Board | Register',
                layout: 'layout-auth',
                errors: req.flash('error'),
                copy: 'The Board &copy; 2014'
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

      if( !err.code == 'E_VALIDATION' ){
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
