angular.module('sharedUtilModule')
.factory('tagCloudService', [function(){
	var factory = {};
	factory.tagCloud = [];

	factory.filterTags = function($query) {
		return factory.tagCloud.filter(function(tag) {
			return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
		});
	};

  return factory;
}]);