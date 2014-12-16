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
/* exported Polygon */

var Polygon = (function () {
	'use strict';

	//poly is [[x,y], ... ]
	function area(poly) {
		var p = poly[poly.length - 1];

		return poly.reduce(function (total, n) {
			var t = (p[0] - n[0]) * (p[1] + n[1]);
			p = n;
			return total + t;
		}, 0) / 2;
	}

	function split(poly, line) {
		var polyWithSide = poly.map(function (point) {
			var side = getSide(point, line);

			return {
				point: point,
				side: side
			};
		});

		var a = [],
		    b = [];

		var prevPoint = polyWithSide[polyWithSide.length - 1];

		polyWithSide.forEach(function (point) {
			if (prevPoint.side !== point.side) {
				var intersect = intersection(
					[prevPoint.point, point.point],
					line);

				a.push(intersect);
				b.push(intersect);
			}

			(point.side ? a : b).push(point.point);

			prevPoint = point;
		});

		return [a, b];
	}

	function getSide(point, line) {
		var lx = line[0][0] - line[1][0],
		    ly = line[0][1] - line[1][1],
		    px = point[0] - line[0][0],
		    py = point[1] - line[0][1];

		return lx * py > ly * px;
	}

	function intersection(a, b) {
		var ax = a[0][0] - a[1][0],
		    ay = a[0][1] - a[1][1],
		    bx = b[0][0] - b[1][0],
		    by = b[0][1] - b[1][1],

		    ca = a[0][0] * a[1][1] - a[0][1] * a[1][0],
		    cb = b[0][0] * b[1][1] - b[0][1] * b[1][0],

		    l = ax*by - ay*bx;

		return [
			(ca * bx - cb * ax) / l,
			(ca * by - cb * ay) / l
		];
	}

	return {
		area: area,
		split: split
	};

}());