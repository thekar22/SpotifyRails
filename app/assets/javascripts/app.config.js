var app = angular.module('MusicApp', ['templates', 'ngRoute', 'navigationModule', 'tagModule', 'songModule', 'audioFeaturesModule', 'searchModule', 'ng-rails-csrf', 'ngMaterial', 'angular-loading-bar', 'ngAnimate'])
.config(
	[
		'$routeProvider',
		function($routeProvider) {
			// set up routes
			$routeProvider
				.when('/', {
					templateUrl: 'tagCloud/tagView.html' // tagController specified in index.html.erb
			})
				.when('/tagCloud/:id', {
					templateUrl: 'tagCloud/tagView.html',
					controller: 'tagController'
			})
				.when('/audioFeatures', {
					templateUrl: 'audioFeatures/audioFeaturesView.html',
					controller: 'audioFeaturesController'
			})
				.when('/search', {
					templateUrl: 'search/searchView.html',
					controller: 'searchController'
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
		'cfpLoadingBarProvider', 
		function(cfpLoadingBarProvider) {
			cfpLoadingBarProvider.includeSpinner = false;
		}
	]
);