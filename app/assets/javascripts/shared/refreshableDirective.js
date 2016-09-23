angular.module('sharedUtilModule')
.directive('refreshable', ['$sce', function ($sce) {
    return {
        restrict: 'A',
        scope: {
            refresh: "=refreshable"
        },
        link: function (scope, element, attr) {
            var refreshMe = function (newSrc) {       
                element.attr('src', newSrc);
            };

            scope.$watch('refresh', function (newVal, oldVal) {                
                refreshMe($sce.trustAsResourceUrl(newVal));
            });
        }
    };
}])