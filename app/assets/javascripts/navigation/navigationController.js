angular
	.module('navigationModule', ['sharedUtilModule'])
	.controller('navigationController', ['$scope', '$mdSidenav', '$location', 'songPlayingService', 'tagCloudService', '$route', 'sandboxService', 
	function navigationController($scope, $mdSidenav, $location, songPlayingService, tagCloudService, $route, sandboxService) {
		initModule();

		function setupLoading() {
			$scope.$on('$locationChangeStart', function(event) {
				if (($location.path().substr(0,5) == "/tags") || $location.path() == "/")
				{
					$scope.navView = "tag-view";
				}
				else
				{
					$scope.navView = "other-view";
				}
			});

			$scope.loadingItems = {};
			$scope.dataLoading = false;

			$scope.$on('loading.loading', function (event, arg) {
				$scope.loadingItems[arg.key] = arg.val;
				$scope.dataLoading = true;
				$scope.message = arg.val;
			});

			$scope.$on('loading.loaded', function (event, arg) {
				if ($scope.loadingItems[arg.key])
				{
					delete $scope.loadingItems[arg.key]
				}
				if (Object.keys($scope.loadingItems).length == 0) {
					$scope.dataLoading = false;
				}
			});
		}
		
		function setupSongPlaying()
		{
			$scope.songForWidget = songPlayingService.song;
			$scope.tab = {};
			$scope.$watch('songForWidget', function (nv, ov, scope){
				$scope.tab.refresh = nv.songUrl;
			}, true);
		}

		$scope.openLeftMenu = function() {
			$mdSidenav('left').toggle();
		};	
		$scope.openRightMenu = function() {
			$mdSidenav('right').toggle();
		};

		$scope.toggle = function(side) {
			$mdSidenav(side).toggle();
		}

		$scope.afterFullScreenAnimation = function() {
			$scope.hide = false;
			if ($scope.firstLoad) {
				$scope.firstLoad = false;
			}
			$route.reload();
		}

		$scope.afterSplitAnimation = function() {			
			if ($scope.firstLoad) {
				$scope.firstLoad = false;
			}
			$route.reload();
		}

		$scope.toggleSplitScreen = function (splitScreen) {			
			$scope.splitScreen = !$scope.splitScreen;
		}

		$scope.toggleSplit = function () {
			$scope.splitScreen = !$scope.splitScreen;
		}

		function initWatchVars() {			
			$scope.splitScreen = false;
			$scope.firstLoad = true;

			$scope.sandboxSongs = sandboxService.sandboxSongs;
		}

		function initModule() {
			setupLoading();
			setupSongPlaying();
			initWatchVars();
		}
}]);

