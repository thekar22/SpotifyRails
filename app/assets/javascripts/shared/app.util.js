angular
  .module('sharedUtilModule', ['ngMaterial'])
  .service('sharedUtilService', ['$location', function ($location) {
    var service = {
      getMean: getMean,
      getMedian: getMedian,
      redirect: redirect
    };

    function getMedian(nums) 
    {
      nums.sort( function(a,b) { 
        return a - b; 
      });

      var half = Math.floor(values.length/2);
      if (nums.length % 2)
          return nums[half];
      else
          return (nums[half-1] + nums[half]) / 2.0;
    }

    function getMean(nums) 
    {
      var sum = 0;
      for(var i = 0; i < nums.length; i++)
      {
        sum += nums[i];
      }
      return sum / nums.length;
    }

    function redirect($path)
    {      
      $location.path($path);
    }
    
    return service;
  }]);