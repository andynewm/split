(function () {
	'use strict';

	var canvas = document.getElementById('art');
	var context = canvas.getContext('2d');

	context.fillStyle = 'red';

	function drawPoly(polygon) {
		context.beginPath();

		var finalPoint = polygon[polygon.length - 1];

		context.moveTo(finalPoint[0], finalPoint[1]);
		polygon.forEach(function (point) {
			context.lineTo(point[0], point[1]);
		});

		context.fill();
		context.stroke();
	}

	drawPoly([[10,10], [100, 10], [10,100]]);
}());