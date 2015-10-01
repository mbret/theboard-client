'use strict';

var request = require('request');

module.exports = {

    /**
     *
     * @param req
     * @param res
     */
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
            title       :  ViewsService.buildTitle(req.__('i18n_Login')),
            layout      : 'auth/layout-auth',
            errors      : req.flash('error'),
            successes   : req.flash('success'),
            copy        : sails.config.views.copy,
            providers   : providers,
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
        ApiService.login(req.param('email', null), req.param('password', null), function(err, response, body){

            if(err){
                return res.serverError(err);
            }

            if(response.statusCode !== 200){
                return res.negociateApi(response);
            }

            req.login(body.user, function (err) {
                if(err){
                    return res.serverError(err);
                }
                req.flash('success', 'Success.Auth.Login');
                req.session.token = body.token;
                return res.ok();
            });
        });
    },

    signupProceed: function(req, res){
        ApiService.register(req.param('email', null), req.param('password', null), function(err, response, body){

            if(err){
                return res.serverError(err);
            }

            if(response.statusCode !== 201){
                return res.negociateApi(response);
            }

            req.login(body.user, function(err){
                if(err){
                    return res.serverError(err);
                }
                req.flash('success', 'Success.Auth.Register');
                req.session.token = body.token;
                return res.created();
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