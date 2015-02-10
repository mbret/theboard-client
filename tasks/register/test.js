module.exports = function (grunt) {
	grunt.registerTask('test', [
		'mochaTest:test',
		//'mochaTest:coverage',
	]);
};
