var app = angular.module('MusicApp', ['templates', 'ngRoute', 'playlistModule', 'songsModule', 'audioFeaturesModule', 'ng-rails-csrf']);

app.config(function($routeProvider) {
	// set up routes
	$routeProvider
		.when('/', {
			templateUrl: 'tagCloud/tagView.html' // tagController specified in index.html.erb
	})
		.when('/songs', {
			templateUrl: 'songs/songsView.html',
			controller: 'songsController'
	})
		.when('/audioFeatures', {
			templateUrl: 'audioFeatures/audioFeaturesView.html',
			controller: 'audioFeaturesController'
	})
		.otherwise({
			redirectTo: '/'
	});
});
