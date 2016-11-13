app.directive('splitScreen', ['$animate', function($animate) {
  return {
    scope: {
      'splitScreen': '=',
      'afterSplitAnimation': '&',
      'afterFullScreenAnimation': '&'
    },
    link: function(scope, element) {
      scope.$watch('splitScreen', function(split, oldVal) {
        if (!split) {
          $animate.removeClass(element, 'ng-split').then(function(){
            scope.afterFullScreenAnimation();
          });      
        }
        if (split) {
          $animate.addClass(element, 'ng-split').then(function(){
            scope.afterSplitAnimation();
          });
        }
      });
    }
  }
}]);
