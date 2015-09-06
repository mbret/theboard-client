module.exports = function (grunt) {
	grunt.registerTask('build', [
		'compileAssets',
		'concat:widgetsFramework',
		'linkAssetsBuild',
		'clean:build',
		'copy:build'
	]);
};
