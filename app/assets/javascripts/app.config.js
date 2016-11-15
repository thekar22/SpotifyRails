var app = angular.module('MusicApp', ['templates', 'ngRoute', 'navigationModule', 'tagModule', 'songModule', 'sandboxModule', 'ng-rails-csrf', 'ngMaterial', 'angular-loading-bar', 'ngAnimate'])
.config(
	[
		'$routeProvider',
		function($routeProvider) {
			// set up routes
			$routeProvider
				.when('/', {
					templateUrl: 'tags/tagView.html',
					controller: 'tagController'
			})
				.when('/tags/', {
					templateUrl: 'tags/tagView.html',
					controller: 'tagController'
			})
				.when('/sandbox', {
					templateUrl: 'sandbox/sandboxView.html',
					controller: 'sandboxController'
			})
				.when('/song/:id', {
					templateUrl: 'song/songView.html',
					controller: 'songController'
			})
				.otherwise({
					redirectTo: '/'
			});
		}
	]
)
.config(
	[
		'tagsInputConfigProvider',
		function(tagsInputConfigProvider) {
			tagsInputConfigProvider.setDefaults('tagsInput', { placeholder: '' });
			tagsInputConfigProvider.setActiveInterpolation('tagsInput', { placeholder: true });
		}
	]
)
.config(
	[
		'cfpLoadingBarProvider', 
		function(cfpLoadingBarProvider) {
			cfpLoadingBarProvider.includeSpinner = false;
		}
	]
);