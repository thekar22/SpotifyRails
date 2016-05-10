angular.module('testService', [])
.service('testService', ['$http', function ($http) {

  var service = {
    getTestService: function () {
      return "bobby";
    }
  };
  return service;

}]);