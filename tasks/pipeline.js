/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */

// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
    'styles/importer.css'
];

var cssFilesToInjectApp = [
    'styles/importer-app.css'
];

// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

    // Load sails.io before everything else
    'js/dependencies/**/sails.io.js',

    'vendors/jquery/jquery.js',
    'vendors/jquery-ui/jquery-ui.js',
    'vendors/bootstrap/bootstrap.js',
    'vendors/jquery-cookie/jquery.cookie.js',
    'vendors/iCheck/icheck.js',
    'vendors/toastr/toastr.js',
    'vendors/jquery-validation/jquery.validate.js',
    'js/script.auth.js',
];

var jsFilesToInjectApp = [
    
    // Load sails.io before everything else
    'js/dependencies/**/sails.io.js',
    'vendors/pace/pace.js',
    'vendors/URIjs/URI.js',
    'vendors/lodash/lodash.js',
    'js/dependencies/moment.min.js',
    'js/dependencies/hammer.js',
    'js/dependencies/detect-element-resize.js',
    'vendors/dropzone/dropzone.min.js',

    // Jquery
    'vendors/jquery/jquery.js',
    'vendors/jquery-ui/jquery-ui.js',
    
    // Bootstrap
    'vendors/bootstrap/bootstrap.js',

    // Jquery plugins
    'vendors/toastr/toastr.js',
    'vendors/metisMenu/metisMenu.js',
    'vendors/jquery-backstretch/jquery.backstretch.js',
    'vendors/jQuery-Knob/jquery.knob.min.js',
    'vendors/iCheck/icheck.js',
    'vendors/blueimp-gallery/blueimp-gallery.js',


    // Angular + plugins
    'vendors/angular/angular.js',
    'vendors/angular-ui-router/angular-ui-router.js',
    'vendors/angular-ui-bootstrap/angular-ui-bootstrap.js',
    'vendors/angular-gridster/angular-gridster.js',
    'js/dependencies/angular-plugins/**/*.js',
    'vendors/angular-local-storage/angular-local-storage.js',

    // App
    // we need to load all modules
    // then their scripts
    // core first
    'app/core/**/*.module.js',
    'app/core/**/*.js.js',
    // then everything else
    'app/**/*.module.js',
    'app/**/*.js',
    
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
    return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
    return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
    return 'assets/' + path;
});

// APP relative injectors
module.exports.jsFilesToInjectApp = jsFilesToInjectApp.map(function(path){
    return '.tmp/public/' + path;
});
module.exports.cssFilesToInjectApp = cssFilesToInjectApp.map(function(path){
    return '.tmp/public/' + path;
});
