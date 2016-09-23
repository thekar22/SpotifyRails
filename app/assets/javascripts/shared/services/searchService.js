angular.module('sharedUtilModule')
.service('searchService', ['$http', function ($http) {

  var service = {  
    searchQuery: function (query) {    	
      return $http({
        method: 'GET',
        url: '/search?' + $.param({query: query})
      });
    }
  };
  return service;
}]);