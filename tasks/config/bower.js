/**
 * Install bower components.
 *
 * ---------------------------------------------------------------
 *
 * Installs bower components and copies the required files into the assets folder structure.
 *
 */

module.exports = function(grunt) {

	grunt.config.set('bower', {
		install: {
			options: {
				targetDir: './assets/vendors',
				layout: 'byType',
				install: true,
				verbose: true,
				// DO NOT SET TO TRUE. We are using custom vendors so if set to true it will erase all manual plugins
				cleanTargetDir: false,
				cleanBowerDir: false,
				bowerOptions: {}
			}
		}
	});

	grunt.loadNpmTasks('grunt-bower-task');
};
