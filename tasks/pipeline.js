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

  'styles/**/angular*.css',
  'styles/**/*.css',

  'app/css/**/*.css'
];

var cssFilesToInjectApp = [

    'styles/dist/angular-gridster.min.css',

    // Bootstrap
    'styles/plugins/bootstrap.min.css',
    
    // Plugins
    'styles/plugins/**/*.css',

    // Theme and own style
    'styles/style.theme.css',
    'styles/style.css',
];

// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

      // Load sails.io before everything else
      'js/dependencies/**/sails.io.js',

      // Dependencies like sails.io.js, jQuery, or Angular
      // are brought in here
      'js/dependencies/dist/jquery.js',
      'js/dependencies/hammer.js',
      'js/dependencies/detect-element-resize.js',
      'js/dependencies/jquery.backstretch.js',
      'js/dependencies/URI.js',
      'js/dependencies/**/*.js',

      // All of the rest of your client-side js files
      // will be injected here in no particular order.
      'js/**/*.js',
];

var jsFilesToInjectApp = [
    
    // Load sails.io before everything else
    'js/dependencies/**/sails.io.js',
    'js/dependencies/pace/pace.min.js',
    'js/dependencies/URI.js',
    'js/dependencies/lodash.js',
    'js/dependencies/moment.min.js',
    'js/dependencies/hammer.js',
    'js/dependencies/detect-element-resize.js',
    'js/dependencies/dropzone.js',
    
    // Jquery
    'js/dependencies/jquery/jquery-2.1.1.min.js',
    'js/dependencies/jquery/jquery-ui.min.js',
    
    // Bootstrap
    'js/dependencies/bootstrap/bootstrap.min.js',

    // Jquery plugins
    'js/dependencies/jquery-plugins/**/*.js',

    // Angular
    'js/dependencies/angular/angular.js',
    'js/dependencies/angular/**/*.js',
    
    // Angular plugins
    'js/dependencies/angular-plugins/**/*.js',

    // App
    // we need to load all modules
    // then their scripts
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
module.exports.jsFilesToInjectApp = jsFilesToInjectApp.map(function(path){
    return '.tmp/public//' + path;
});
module.exports.cssFilesToInjectApp = cssFilesToInjectApp.map(function(path){
    return '.tmp/public/' + path;
});
