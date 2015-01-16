'use strict';

/**
 * - Bet practice for directory structure (http://scotch.io/tutorials/angularjs-best-practices-directory-structure)
 * - Here is the official angular styleguide: (https://github.com/johnpapa/angularjs-styleguide)
 */

(function () {
	angular.module('app',[
			'ui.router',
			'ui.bootstrap',

			//'ngRoute',
			//'ngMaterial',
			'gridster',

			// modules
			// modules are loaded at the time
			'app.services',
			'app.controllers',
			'app.directives',
	]);
})();
