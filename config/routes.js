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
    

var routes = {

    /***************************************************************************
    *                                                                          *
    * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
    * etc. depending on your default view engine) your home page.              *
    *                                                                          *
    * (Alternatively, remove this and add an `index.html` file in your         *
    * `assets` directory)                                                      *
    *                                                                          *
    ***************************************************************************/

    'get /api/users/'               : 'ProfileController.find',
    'get /api/users/profiles'       : 'ProfileController.findAll',
    'get /api/users/profiles/:id'   : 'ProfileController.find',
    'put /api/users/profiles'       : 'ProfileController.updateAll',
    'put /api/users/profiles/:id'   : 'ProfileController.update',
    'post /api/users/backgroudimages': 'AccountController.uploadBackgroundImage',
    
    'get /api/users/widgets': 'WidgetController.findAll', // default activated profile
    'put /api/users/widgets/:id': 'WidgetController.updateProfileWidget', // update for default profile
    'get /api/users/profiles/:profileid/widgets': 'WidgetController.findAll', // specific profile
    'put /api/users/profiles/:profileid/widgets/:id': 'WidgetController.updateProfileWidget', // update for given profile

    'get /api/account': 'AccountController.me',
    'put /api/account': 'AccountController.update',

    // ==============
    // Auth part
    // ==============
    // Views
    'get /signin': 'ViewController.signin',
    'get /signup': 'ViewController.signup',
    
    'get /auth/logout': 'AuthController.logout',
    // local auth
    'get  /auth/token/refresh'   : 'AuthController.issueToken',
    'post /auth/signin'         : 'AuthController.signin',
    'post /auth/signup'         : 'AuthController.signup',
    
    // Providers auth
    'get /auth/:provider': 'AuthController.provider',
    'get /auth/:provider/callback': 'AuthController.callback',
    'get /auth/:provider/:action': 'AuthController.callback',

    // ==============
    // App routes
    // ==============
    'get /helpers/cor/:url': 'ViewController.pipeCOR', // act as proxy for any request out of this domain
    'get /configuration.json': 'ViewController.configurationJSON', // return app settings
    'get /configuration.js': 'ViewController.configurationJS', // return app settings
    'get /flash': 'ViewController.flash',
    'get /': 'ViewController.index' // Home (start point of front end app)

};

module.exports = {
    routes: routes,
    app: {
        routes: getRoutes('app')
    },
    urls: getRoutes('server')
};

function getRoutes(label){
    var routes = {
        default: {
            signin: '/signin',
            app: '/'
        },
        server: {
            data: 'public',
            userBackgroundImages: '/public/users/backgrounds',
            images: 'images'
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
                    updateAll: '/api/users/profiles',
                    update: '/api/users/profiles/:id'
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

    return require('lodash').assign(routes.default, routes[label]);
}