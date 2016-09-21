var app = angular.module('MusicApp', ['templates', 'ngRoute', 'navigationModule', 'tagModule', 'songModule', 'audioFeaturesModule', 'customTagModule', 'ng-rails-csrf', 'ngMaterial', 'angular-loading-bar', 'ngAnimate'])
.config(
	[
		'$routeProvider',
		function($routeProvider) {
			// set up routes
			$routeProvider
				.when('/', {
					templateUrl: 'tags/tagView.html' // tagController specified in index.html.erb
			})
				.when('/tags/:id', {
					templateUrl: 'tags/tagView.html',
					controller: 'tagController'
			})
				.when('/audioFeatures', {
					templateUrl: 'audioFeatures/audioFeaturesView.html',
					controller: 'audioFeaturesController'
			})
				.when('/customTag', {
					templateUrl: 'customTag/customTagView.html',
					controller: 'customTagController'
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