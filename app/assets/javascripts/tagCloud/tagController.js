angular
	.module('tagModule', ['tagService', 'ngTagsInput', 'songCardDirective', 'ng-rails-csrf', 'angular-jqcloud', 'ui.grid', 'ui.grid.selection', 'sharedUtilService'])
	.controller('tagController', ['$scope', 'tagService', '$http', 'sharedUtilService', function tagController($scope, tagService, $http, sharedUtilService) {
		initModule();

		$scope.loadTags = function($query) {
			var tags = $scope.tagCloud;
			return tags.filter(function(tag) {
				return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
			});
		};

		$scope.onTagAdded = function($tag) {
			$scope.queryResults();		
		}

		$scope.onTagRemoved = function($tag) {	
			$scope.queryResults();
		}

		$scope.queryResults = function() {
			if ($scope.tags.length > 0)
			{
				$scope.tagView = "tag-results";	
				$scope.getPlaylistSongs($scope.filter.name);	
			}
		}

		$scope.getPlaylistSongs = function(filterType) {
			$scope.songs = {};
			if ($scope.tags.length != 0)
			{
				playlistIds = [];
				for (var tag in $scope.tags)
				{
					playlistIds.push($scope.tags[tag].id);
				}

				$scope.loading.text = 'Loading...';
				tagService["getPlaylist" + filterType](playlistIds).then(function(response){ 
					$scope.loading.text = '';			
					var allSongs = response.data;
					$scope.gridOptions.data = allSongs;
				});
			}
		}

		function setupGrid()
		{ //TODO share code with search view
			$scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
			$scope.gridOptions.columnDefs = [
				{ name: 'name', displayName: 'Title'},
				{ name: 'artist'},
				{ name: 'song_id', visible: false}
			];
			$scope.gridOptions.multiSelect = false;
			$scope.gridOptions.modifierKeysToMultiSelect = false;
			$scope.gridOptions.noUnselect = true;
			$scope.gridOptions.data = [];
			$scope.gridOptions.onRegisterApi = function( gridApi ) {
				$scope.gridApi = gridApi;
				gridApi.selection.on.rowSelectionChanged($scope, function(row){
					console.log(row.entity.song_id);
					sharedUtilService.redirect('#/song/' + row.entity.song_id);
					//Do something when a row is selected
				});
			};
		}

		function initModule(){		

			setupGrid();

			// for tag cloud
			$scope.colors = ["#111111", "#333333", "#555555", "#777777", "#999999", "#bbbbbb", "#dddddd"];
			// all tags
			$scope.tagCloud = [];
			// chosen tags
			$scope.tags = [];
			// songs from chosen tags
			$scope.songs = {};
			// default filter union
			$scope.filter = {
				name: 'Union'
			};

			//watch variables
			$scope.$watch('filter.name', function () {
				$scope.queryResults();
			});
			$scope.$watch('tags', function (newVal, oldVal) { 
				if ($scope.tags.length < 1)
				{
					$scope.tagView = "tag-cloud";
				}
			}, true);

			// initial load
			$scope.loading = {text: 'Loading...'};
			tagService.getUserPlaylists().then(function(response){
				$scope.loading.text = '';
				var playlists = response.data;

				for(var i = 0; i < playlists.length; i++){
					$scope.tagCloud[i] = { text: playlists[i].name, weight: playlists[i].total, id: playlists[i].id};
				}			
				$scope.tagView = "tag-cloud";
			});
		}
	}
]);