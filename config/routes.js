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

module.exports.routes = {

    /***************************************************************************
    *                                                                          *
    * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
    * etc. depending on your default view engine) your home page.              *
    *                                                                          *
    * (Alternatively, remove this and add an `index.html` file in your         *
    * `assets` directory)                                                      *
    *                                                                          *
    ***************************************************************************/

    'get /api/users/widgets': 'api/WidgetController.findAll', // default activated profile
    'put /api/users/widgets/:id': 'api/WidgetController.updateProfileWidget', // update for default profile
    'get /api/users/profiles/:profileid/widgets': 'api/WidgetController.findAll', // specific profile
    'put /api/users/profiles/:profileid/widgets/:id': 'api/WidgetController.updateProfileWidget', // update for given profile

    'get /api/users/'               : 'api/ProfileController.find',
    'get /api/users/profiles'       : 'api/ProfileController.findAll',
    'get /api/users/profiles/:id'   : 'api/ProfileController.find',
    'put /api/users/profiles'       : 'api/ProfileController.updateAll',
    'put /api/users/profiles/:id'   : 'api/ProfileController.update',
    'post /api/users/backgroudimages': 'api/AccountController.uploadBackgroundImage',
    
    'get /api/account': 'api/AccountController.me',
    'put /api/account': 'api/AccountController.update',

    // ==============
    // Auth part
    // ==============
    // Views
    'get /signin': 'app/ViewController.signin',
    'get /signup': 'app/ViewController.signup',
    
    'get /auth/logout': 'app/AuthController.logout',
    // local auth
    'get  /auth/token/refresh'   : 'app/AuthController.issueToken',
    'post /auth/signin'         : 'app/AuthController.signin',
    'post /auth/signup'         : 'app/AuthController.signup',
    
    // Providers auth
    'get /auth/:provider': 'app/AuthController.provider',
    'get /auth/:provider/callback': 'app/AuthController.callback',
    'get /auth/:provider/:action': 'app/AuthController.callback',

    // ==============
    // App routes
    // ==============
    'get /helpers/cor/:url': 'app/ViewController.pipeCOR', // act as proxy for any request out of this domain
    'get /configuration.json': 'app/ViewController.configurationJSON', // return app settings
    'get /configuration.js': 'app/ViewController.configurationJS', // return app settings
    'get /flash': 'app/ViewController.flash',
    'get /': 'app/ViewController.index' // Home (start point of front end app)

};
