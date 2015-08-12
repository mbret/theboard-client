/**
 * View Engine Configuration
 * (sails.config.views)
 *
 * Server-sent views are a classic and effective way to get your app up
 * and running. Views are normally served from controllers.  Below, you can
 * configure your templating language/framework of choice and configure
 * Sails' layout support.
 *
 * For more information on views and layouts, check out:
 * http://sailsjs.org/#/documentation/concepts/Views
 */
var copy = 'The Board &copy; 2014';
module.exports.views = {

    preTitle: 'The Board',

    titleSeparator: '|',

    engine: 'ejs',

    layout: 'app/app',

    copy: copy,

    // This config object will be passed directly to the views.
    // Both for webapp and other views.
    // This config should not contain any critical data.
    configToInject: {

        copy: copy,
        pageTitle: 'i18n_Index',
        environment: process.env.NODE_ENV || 'development',

        // configuration for toaster plugin
        // https://github.com/Foxandxss/angular-toastr
        toastr: {
            positionClass: 'toast-top-right',
        },

        routes: {
            signin: '/signin',
            app: '/',
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
                    updateAll: '/api/users/profiles',
                    update: '/api/users/profiles/:id',
                    create: '/api/users/profiles'
                },
                widgets: {
                    getByProfile: '/api/users/profiles/:id/widgets', // get
                    get: '/api/users/widgets/:id', // get
                    getAll: '/api/users/widgets',
                    updateAll: '/api/users/widgets', // put,
                    update: '/api/users/widgets/:id',
                    updateByProfile: '/api/users/profiles/:profileid/widgets/:id',
                    addToProfile: '/api/profiles/:profileid/widgets'
                },
                account: {
                    get: '/api/account', // get
                    update: '/api/account' // put
                },
                repository: {
                    widgets: {
                        getAll: '/api/repository/widgets'
                    }
                }
            }
        }
    }
};
