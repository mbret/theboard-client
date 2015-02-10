/**
 * https://github.com/pghalliday/grunt-mocha-test
 * @param grunt
 */
module.exports = function(grunt) {

	grunt.config.set('mochaTest', {
		test: {
			options: {
				reporter: 'spec',
				timeout: 100000, // we need a high timeout because of sails lift that may take long time
				colors: true,
				ignoreLeaks: true,
				recursive: true,

				// Require blanket wrapper here to instrument other required
				// files on the fly.
				//
				// NB. We cannot require blanket directly as it
				// detects that we are not running mocha cli and loads differently.
				//
				// NNB. As mocha is 'clever' enough to only run the tests once for
				// each file the following coverage task does not actually run any
				// tests which is why the coverage instrumentation has to be done here
				//require: 'coverage/blanket'
			},
			src: ['test/**/*.js']
		},
		coverage: {
			options: {
				reporter: 'html-cov',
				// use the quiet flag to suppress the mocha console output
				quiet: true,
				// specify a destination file to capture the mocha
				// output (the quiet option does not suppress this)
				captureFile: 'coverage.html'
			},
			src: ['test/**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');
};
