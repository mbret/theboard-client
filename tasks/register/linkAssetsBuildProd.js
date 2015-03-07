module.exports = function (grunt) {
	grunt.registerTask('linkAssetsBuildProd', [

		// relative to web app
		'sails-linker:prodJsRelativeApp',
		'sails-linker:prodStylesRelativeApp',

		// relative to backend (login, signup, etc)
		'sails-linker:prodJsRelative',
		'sails-linker:prodStylesRelative',
		'sails-linker:devTpl',
		'sails-linker:prodJsRelativeJade',
		'sails-linker:prodStylesRelativeJade',
		'sails-linker:devTplJade'
	]);
};
