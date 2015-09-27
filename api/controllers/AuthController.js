'use strict';

var request = require('request');

module.exports = {

    signin: function (req, res) {
        var strategies = sails.config.passport.strategies;
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

        // Render the `auth/login.ext` view
        res.ok({
            title:  ViewsService.buildTitle(req.__('i18n_Login')),
            layout: 'auth/layout-auth',
            errors    : req.flash('error'),
            successes : req.flash('success'),
            copy: sails.config.views.copy,
            providers: providers,
        }, 'auth/login');
    },

    signup: function (req, res) {
        res.ok({
            title: ViewsService.buildTitle(req.__('i18n_Register')),
            layout: 'auth/layout-auth',
            errors: req.flash('error'),
            copy: sails.config.views.copy,
        }, 'auth/register');
    },

    signinProceed: function(req, res){
        request
            .post('http://localhost:1337/auth/signin', {
                form: {
                    "email": req.param('email', null),
                    "password": req.param('password', null)
                }
            }, function(err, response, body){
                if(err){
                    return res.serverError(err);
                }
                if(response.statusCode !== 200){
                    return res.negociateApi(response);
                }
                req.login(body.user, function (err) {
                    if (err){
                        return res.serverError(err);
                    }
                    req.session.token = body.token;
                    req.flash('success', 'Success.Auth.Login');
                    return res.ok();
                });
            });
    },

    signupProceed: function(req, res){
        request
            .post('http://localhost:1337/auth/signup', {
                form: {
                    "email": req.param('email', null),
                    "password": req.param('password', null)
                }
            }, function(err, response, body){
                if(err){
                    return res.serverError(err);
                }
                if(response.statusCode !== 200){
                    return res.negociateApi(response);
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

};