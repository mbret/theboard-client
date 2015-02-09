module.exports = function (grunt) {
	grunt.registerTask('linkAssetsBuild', [
        // relative to app
        'sails-linker:devJsRelativeApp',
        'sails-linker:devStylesRelativeApp',
        
        // relative to backend
		'sails-linker:devJsRelative',
		'sails-linker:devStylesRelative',
		'sails-linker:devTpl',
		'sails-linker:devJsRelativeJade',
		'sails-linker:devStylesRelativeJade',
		'sails-linker:devTplJade'
	]);
};
