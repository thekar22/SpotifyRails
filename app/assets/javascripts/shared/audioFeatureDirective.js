angular.module('sharedUtilModule')
  .directive('audioFeatures', ['d3Service', function(d3Service) {
     return {
      restrict: 'EA',
      scope: {},
      link: function(scope, element, attrs) {
        console.log(d3Service);
        var d3 = d3Service.d3;

        var svg = d3.select(element[0])
            .append("svg")
            .style('width', '100%');


      }};
  }]);