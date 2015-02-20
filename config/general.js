(function(){
    'use strict';
    
    var path = require('path');
    var _ = require('lodash');
    
    /**
     *
     */
    var config = {

        general: {

            // Routes as a variable to be used everywhere without need to refactor
            // Use these variable in backend and front end instead of write directly
            routes: routes('server')
        },

        // SSL configuration
        // http://www.cert-depot.com/
        // http://www.mobilefish.com/services/ssl_certificates/ssl_certificates.php
        ssl: {
            ca: require('fs').readFileSync(__dirname + '/ssl/app.csr'),
            key: require('fs').readFileSync(__dirname + '/ssl/app.private.key'),
            cert: require('fs').readFileSync(__dirname + '/ssl/app.cert')
        },

        dataPath: __dirname + '/../data',
        dataPublicPath: __dirname + '/../data/statics/public',
        dataURL: 'public',
        imagesURL: 'images',

        user: {
            default: {
                avatar: 'avatar.jpg',
                banner: 'user_banner.jpg',
                backgroundImages: [ 'board_wall_default.jpg', 'board_wall1_default.jpg', 'board_wall2_default.jpg' ],
                settings: {
                    widgetsBorders: false,
                    backgroundImagesInterval: 5000
                }
            },
            settings: {
                widgetsBorders: {
                    type: 'boolean'
                },
                backgroundImagesInterval: {
                    type: 'integer'
                }
            }
        },

        // Correspond to the settings of the front side app
        // These settings are retrieved by app on bootstrap
        app: {
            copy: 'The Board &copy; 2014',
            pageTitle: 'Board',
            environment: process.env.NODE_ENV || 'development',
            user: {}, // This attribute is filled with the current logged user

            // configuration for toaster plugin
            // https://github.com/Foxandxss/angular-toastr
            toastr: {
                positionClass: 'toast-top-right',
            },

            routes: routes('app')
        }
    };
    
    function routes(label){
        var routes = {
            default: {
                signin: '/signin',
                app: '/'
            },
            server: {

            },
            app: {
                views: '/app/views',
                server: '/',
                icons: '/app/icons',
                images: '/app/img',
                flash: '/flash',
                signup: '/signup',
                logout: '/auth/logout',
                configurationJS: '/configuration.js',
                api: {
                    auth: {
                        signin: '/auth/signin',
                        signup: '/auth/signup'
                    },
                    me: '/api/account',
                    user: {

                    },
                    profiles: {
                        get: '/api/users/profiles/:id',
                        getAll: '/api/users/profiles',
                        update: '/api/users/profiles'
                    },
                    widgets: {
                        getByProfile: '/api/users/profiles/:id/widgets', // get
                        get: '/api/users/widgets/:id', // get
                        getAll: '/api/users/widgets',
                        updateAll: '/api/users/widgets', // put,
                        update: '/api/users/widgets/:id',
                        updateByProfile: '/api/users/profiles/:profileid/widgets/:id'
                    },
                    account: {
                        get: '/api/account', // get
                        update: '/api/account' // put
                    }
                }
            }

        };
        
        return _.assign(routes.default, routes[label]);
    }
    

    module.exports = config;
})();

