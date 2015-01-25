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

    // ==============
    // App routes
    // ==============
    'GET /helpers/cor/:url': 'AppController.pipeCOR', // act as proxy for any request out of this domain
    'get /configuration.json': 'AppController.getConfiguration', // return app settings
    
    'get /widgets': 'AppController.getWidgets',
    'put /widgets/:id': 'AppController.updateWidget',

    'get /account': 'AppController.getAccountData',
    'put /account': 'AppController.updateAccountData',

    // Login & register
    '/login': 'AuthController.login', // login form
    '/register': 'AuthController.register',
    'get /logout': 'AuthController.logout',
    // Authentication via providers
    //'post /auth/local': 'AuthController.callback',
    //'post /auth/local/:action': 'AuthController.callback',
    'get /auth/:provider': 'AuthController.provider',
    'get /auth/:provider/callback': 'AuthController.callback',
    'get /auth/:provider/:action': 'AuthController.callback',

    'get /': 'AppController.index' // Home (start point of front end app)

};
