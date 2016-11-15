angular.module('sharedUtilModule')
	.directive('audioFeatures', ['d3Service', function(d3Service) {
		return {
		restrict: 'EA',
		scope: {
			data: "=",
			label: "@",
			onClick: "&"
		},
		link: function(scope, element, attrs) {		
			var d3 = d3Service.d3;
			var svg = d3.select(element[0])
				.append("svg")
				.style('width', '100%');

			// Browser onresize event
			window.onresize = function() {
				scope.$apply();
			};

			// hard-code data
			scope.data = [
				{name: "Valence", score: .01},
				{name: 'Instrumentalness', score: .01},
				{name: "Energy", score: .01},
				{name: "Acousticness", score: .01},
				{name: "Danceability", score: .01} 
			];

			var colorDict = {
				"Valence": "#FFD1DC",
				"Instrumentalness": "#AEC6CF",
				"Energy": "#77DD77",
				"Acousticness": "#FFB347",
				"Danceability": "#B39EB5"
			}

			// Watch for resize event
			scope.$watch(function() {
				return angular.element(window)[0].innerWidth;
			}, function() {
				scope.render(scope.data);
			});

			scope.$watch('data', function (newVal, oldVal) { 
				if (scope.data && scope.data.length !== 0) {					
					scope.render(scope.data);
				}
			}, true);

			scope.render = function(data){
			// remove all previous items before render
			svg.selectAll("*").remove();

			// setup variables
			var width, height, max, color;
			color = d3.scale.category20(),
			width = d3.select(element[0])[0][0].offsetWidth - 20;
				// 20 is for margins and can be changed
			height = scope.data.length * 40;
				// 35 = 30(bar height) + 5(margin between bars)
			max = 98;
				// this can also be found dynamically when the data is not static
				// max = Math.max.apply(Math, _.map(data, ((val)-> val.count)))

			// set the height based on the calculations above
			svg.attr('height', height);

			//create the rectangles for the bar chart
			svg.selectAll("rect")
				.data(data)
				.enter()
					.append("rect")
					.on("click", function(d, i){return scope.onClick({item: d});})
					.attr("height", 35) // height of each bar
					.attr("width", 0) // initial width of 0 for transition
					.attr("x", 10) // half of the 20 side margin specified above
					.attr("y", function(d, i){
						return i * 40;
					}) // height + margin between bars
					.attr('fill', function(d) {return colorDict[d[scope.label]]; })
					.transition()
						.duration(1000) // time of duration
						.attr("width", function(d){
						  return (d.score*100)/(max/width);
						}); // width based on scale

					svg.selectAll("text")
					.data(data)
					.enter()
						.append("text")
						.attr("fill", "#000")
						.attr("y", function(d, i){return i * 40 + 22;})
						.attr("x", 15)
						.text(function(d){return d[scope.label];});
			};
		}};
	}]);