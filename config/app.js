/**
 * App configuration
 * 
 * These config are relative to web app only.
 * The purpose is to inject them directly to the webapp.
 */
module.exports.app = {
    
    copy: 'The Board &copy; 2014',
    pageTitle: 'Board',
    environment: process.env.NODE_ENV || 'development',

    // configuration for toaster plugin
    // https://github.com/Foxandxss/angular-toastr
    toastr: {
        positionClass: 'toast-top-right',
    }
}