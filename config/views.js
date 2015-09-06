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
            flash: '/helpers/flash',
            signup: '/signup',
            logout: '/auth/logout',
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
                    get: '/api/users/widgets/:id', // get
                    getAll: '/api/widgets',
                    //updateAll: '/api/users/widgets', // put,
                    //update: '/api/users/widgets/:id',
                    updateByProfile: '/api/profiles/:profile/widgets/:widget',
                    addToProfile: '/api/widgets',
                    removeFromProfile: '/api/profiles/:profile/widgets/:widget'
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
        },

        messages: {
            errors: {
                unableToUpdate: 'Sorry but we were unable to update',
                unableToLoad: 'Sorry but we were unable to load',
                geolocation: {
                    unsupportedBrowser:'Browser does not support location services',
                    permissionDenied:'You have rejected access to your location',
                    positionUnavailable:'Unable to determine your location',
                    timeout:'Service timeout has been reached'
                },
                widgets: {
                    unableToUpdate: 'Sorry but we were unable to save your new widget organization!',
                    unableToLoad: 'Sorry but we were unable to load your widgets!'
                }
            },
            success: {
                form:{
                    updated: 'Update completed successfully!'
                },
                widget: {
                    updated: 'Widget updated!'
                },
                deleted: 'Deleted with success!'
            },
            form: {
                invalid: 'Your form contain some errors, please check it before submit!',
                updated: 'Update completed successfully!',
            },
            nochange: 'No change',
            profile:{
                activated: 'New profile activated!',
                updated: 'Profile updated',
                created: 'Profile created'
            },
            widgets: {
                updated: 'Widgets updated!'
            }
        }
    }
};
