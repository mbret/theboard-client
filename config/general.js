var path = require('path');

/**
 *
 */
module.exports = {

    dataPath: __dirname + '/../data',
    dataURL: '/public',
    imagesURL: '/images',
    
    user: {
        default: {
            avatar: 'avatar.jpg',
            banner: 'user_banner.jpg',
            backgroundImages: [ 'board_wall_default.jpg', 'board_wall1_default.jpg', 'board_wall2_default.jpg' ],
            backgroundImagesInterval: 5000,
            settings: {
                widgetsBorders: false
            }
        },
        settings: {
            widgetsBorders: {
                type: 'boolean'
            }
            
        }
    },

    general: {
        // Web site copy
        copy: 'The Board &copy; 2014'
    },
    
    // Correspond to the settings of the front side app
    // These settings are retrieved by app on bootstrap
    frontApp: {
        pageTitle: 'Board',
        environment: process.env.NODE_ENV || 'development',
        user: {}, // This attribute is filled with the current logged user

        // configuration for toaster plugin
        // https://github.com/Foxandxss/angular-toastr
        toastr: {
            positionClass: 'toast-top-right',
        },
        
        // Define all routes needed by the front side
        routes: {
            server: '/',
            icons: '/app/icons',
            images: '/app/img',
            flash: '/flash',
            widgets: {
                get: '/widgets', // get
                update: '/widgets' // put
            },
            account: {
                get: '/account', // get
                update: '/account' // put
            }
        },
        
        // There are the list of all message the app could use
        // @todo this should be done in another way ..
        messages: {
            errors: {
                form: {
                    invalid: 'Your form contain some errors, please check it before submit!',
                },
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
                }
            },
            widgets: {
                updated: 'Widgets updated!'
            }
        }

    }
};
