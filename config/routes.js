/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */
module.exports = {

    routes: {

        'get /api/users/'                   : 'ProfileController.find',
        'get /api/users/profiles'           : 'ProfileController.findAll',
        'get /api/users/profiles/:id'       : 'ProfileController.find',
        'put /api/users/profiles'           : 'ProfileController.updateAll',
        'post /api/users/profiles'          : 'ProfileController.create',
        'put /api/users/profiles/:id'       : 'ProfileController.update',
        'post /api/users/backgroudimages'   : 'AccountController.uploadBackgroundImage',
        'put /api/users/widgets/:id'        : 'WidgetController.updateProfileWidget', // update for default profile

        'get /api/widgets'                  : 'WidgetController.findAll', // get all widgets
        'post /api/widgets'                 : 'WidgetController.addWidgetToProfile',

        'put /api/profiles/:profile/widgets/:widget'    : 'WidgetController.updateProfileWidget', // update for given profile
        'delete /api/profiles/:profile/widgets/:widget' : 'WidgetController.removeWidgetFromProfile', // remove for given profile

        'put /api/account': 'AccountController.update',

        'get /api/repository/widgets': 'RepositoryController.findAll',

        // ==============
        // Auth part
        // ==============
        // Views


        'get /auth/logout': 'AuthController.logout',
        // local auth
        'get  /auth/token/refresh'   : 'AuthController.issueToken',
        'post /auth/signin'         : 'AuthController.signin',
        'post /auth/signup'         : 'AuthController.signup',

        // Providers auth
        'get /auth/:provider': 'AuthController.provider',
        'get /auth/:provider/callback': 'AuthController.callback',
        'get /auth/:provider/:action': 'AuthController.callback',

        // ------------------------------------------------------------------
        //
        // These routes are relative to the front end app.
        // They are used as helper. They are not relevant for api.
        //
        // ------------------------------------------------------------------
        'get /helpers/cor/:url'             : 'HelperController.pipeCOR', // act as proxy for any request out of this domain
        'get /helpers/configuration.json'   : 'HelperController.configuration', // return app settings
        'get /helpers/configuration.js'     : 'HelperController.configuration', // return app settings
        'get /helpers/user.js'              : 'HelperController.user', // return the user object
        'get /helpers/flash'                : 'HelperController.flash',


        'get /signin'   : 'AuthController.signin',
        'post /signin'  : 'AuthController.signinProceed',
        'get /signup'   : 'AuthController.signup',
        'post /signup'  : 'AuthController.signupProceed',
        'get /'         : 'ViewController.index', // Home (start point of front end app)
    },

    // Server urls
    // These urls are not available inside app configuration
    urls: {
        signin: '/signin',
        signup: '/signup',
        app: '/',
        data: 'public',
        backgroundImages: '/images/board-bg-sample',
        images: '/images',
        configuration: '/helpers/configuration.js',
        user: '/helpers/user.js',
    }
};