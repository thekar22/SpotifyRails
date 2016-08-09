var app = angular.module('MusicApp', ['templates', 'ngRoute', 'tagModule', 'songModule', 'audioFeaturesModule', 'searchModule', 'ng-rails-csrf'])
.config(
	[
		'$routeProvider',

		function($routeProvider) {
			// set up routes
			$routeProvider
				.when('/', {
					templateUrl: 'tagCloud/tagView.html' // tagController specified in index.html.erb
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
);