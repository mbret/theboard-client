/**
 * https://github.com/gruntjs/grunt-contrib-jshint
 * @param grunt
 */
module.exports = function(grunt) {

	grunt.config.set("jshint", {
		dev: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				}
			},
			src: ['api/**/*.js', 'assets/app/**/*.js'],
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
};
