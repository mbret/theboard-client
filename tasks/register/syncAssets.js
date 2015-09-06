module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'jst:dev',
		'less:dev',
		'less:widgetsFramework',
		'sync:dev',
		'coffee:dev'
	]);
};
