/**
 * Concatenate files.
 *
 * ---------------------------------------------------------------
 *
 * Concatenates files javascript and css from a defined array. Creates concatenated files in
 * .tmp/public/contact directory
 * [concat](https://github.com/gruntjs/grunt-contrib-concat)
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-concat
 */
module.exports = function(grunt) {

	grunt.config.set('concat', {
		js: {
			src: require('../pipeline').jsFilesToInject,
			dest: '.tmp/public/concat/production.js'
		},
		css: {
			src: require('../pipeline').cssFilesToInject,
			dest: '.tmp/public/concat/production.css'
		},
		widgetsFramework: {
			src: [
                '.tmp/public/widgets-framework/lib/utils.js',
                '.tmp/public/widgets-framework/lib/**/*.js',
                '.tmp/public/widgets-framework/index.js'
            ],
			dest: '.tmp/public/widgets-framework/production.js'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
};
