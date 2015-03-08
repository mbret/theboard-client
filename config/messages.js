(function(){
    'use strict';

    var path = require('path');
    var _ = require('lodash');
    
    /**
     *
     */
    module.exports = {
        
        messages: messages('server'),
        
        app: {
            messages: messages('app')
            
        }
    };
    
    function messages(label){
        var messages = {

            default: {


            },

            server: {


            },

            // There are the list of all message the app could use
            // @todo this should be done in another way ..
            app: {
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
        
        return _.assign(messages.default, messages[label]);
    }
})();


