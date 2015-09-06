module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'bower:install',
		'jst:dev',
		'less:dev',
		'less:widgetsFramework',
		'copy:dev',
		'coffee:dev'
	]);
};
