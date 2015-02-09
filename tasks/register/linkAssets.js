module.exports = function (grunt) {
	grunt.registerTask('linkAssets', [
        // relative to app
        'sails-linker:devJsApp',
        'sails-linker:devStylesApp',
        
        // relative to backend
		'sails-linker:devJs',
		'sails-linker:devStyles',
		'sails-linker:devTpl',
		'sails-linker:devJsJade',
		'sails-linker:devStylesJade',
		'sails-linker:devTplJade'
	]);
};
