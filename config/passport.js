var path = require('path');

/**
 * Passport configuration
 *
 * This if the configuration for your Passport.js setup and it where you'd
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */
module.exports.passport = {

    // Set it to true to be auto logged each request
    // Do not use in production environment
    autoLogin: false,
    autoLoginEmail: 'bret.maxime@gmail.com',

    strategies: {
        // https://github.com/ryanwebber/sails-authorization/blob/master/client/www/js/views.js
        local: {
            strategy: require('passport-local').Strategy
        },

        //basic: {
        //    protocol: 'basic',
        //    strategy: require('passport-http').BasicStrategy
        //},

        //oauth2: {
        //    protocol: 'oauth2',
        //    strategy: require('passport-oauth').OAuth2Strategy,
        //    options: {
        //        authorizationURL: 'https://www.provider.com/oauth2/authorize',
        //        tokenURL: 'https://www.provider.com/oauth2/token',
        //        clientID: '123-456-789',
        //        clientSecret: 'shhh-its-a-secret'
        //    }
        //},

        twitter: {
            name: 'Twitter',
            protocol: 'oauth',
            strategy: require('passport-twitter').Strategy,
            options: {
                consumerKey: 'your-consumer-key',
                consumerSecret: 'your-consumer-secret'
            }
        },

        github: {
            name: 'GitHub',
            protocol: 'oauth2',
            strategy: require('passport-github').Strategy,
            options: {
                clientID: 'your-client-id',
                clientSecret: 'your-client-secret'
            }
        },

        facebook: {
            name: 'Facebook',
            protocol: 'oauth2',
            strategy: require('passport-facebook').Strategy,
            options: {
                clientID: 'foo',
                clientSecret: 'foo'
            }
        },

        google: {
            name: 'Google',
            protocol: 'oauth2',
            strategy: require('passport-google-oauth').OAuth2Strategy,
            options: {
                clientID: 'your-client-id',
                clientSecret: 'your-client-secret'
            }
        }
    }

};
