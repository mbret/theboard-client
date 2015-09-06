/**
 * This task is ran in development mode
 * @param grunt
 */
module.exports = function (grunt) {
	grunt.registerTask('default', [
		'compileAssets',
        'concat:widgetsFramework',
		'linkAssets',
		'watch'
	]);
};
