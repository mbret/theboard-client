module.exports = function (grunt) {
	grunt.registerTask('check', [
		'jshint:dev',
		//'mochaTest:coverage',
	]);
};
