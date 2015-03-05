module.exports = function (grunt) {
	grunt.registerTask('prod', [
		'compileAssets',
		// 'concat',
		// 'uglify',
		// 'cssmin',
		'sails-linker:prodJsApp',
		'sails-linker:prodStylesApp',
		'sails-linker:prodJs',
		'sails-linker:prodStyles',
		'sails-linker:devTpl',
		'sails-linker:prodJsJade',
		'sails-linker:prodStylesJade',
		'sails-linker:devTplJade'
	]);
};
