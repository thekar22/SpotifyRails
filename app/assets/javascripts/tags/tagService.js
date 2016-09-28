angular.module('tagService', [])
.service('tagService', ['$http', function ($http) {

  var service = {
    getUserPlaylists: function (sync) {      
      return $http({
        method: 'GET',
        url: '/playlists'
      });
    },
    getPlaylistUnion: function (ids) {
    	return $http({
		    method: 'GET',
		    url: '/tagUnion?' + $.param({playlistids: ids})
      });
    },
  	getPlaylistIntersection: function (ids) {
    	return $http({
        	method: 'GET',
        	url: '/tagIntersection?' + $.param({playlistids: ids})
      	});
    },
    addNewTag: function (tagname, songid) {
      return $http({
        method: 'GET',
        url: '/addNewTag?' + $.param({tagName: tagname, songId: songid})
      });
    },
    deleteTag: function (tagid) {
      return $http({
        method: 'GET',
        url: '/deleteTag?' + $.param({tagId: tagid})
      });
    },
    addTagToSelectedSongs: function (tagid, songids) {
      return $http({
        method: 'GET',
        url: '/addTagToSongs?' + $.param({tagId: tagid, songIds: songids})
      });
    }
  };
  return service;
}]);