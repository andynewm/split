var Split;
(function (Split) {
    var Engine;
    (function (Engine) {
        var Point = (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            return Point;
        })();
        var Line = (function () {
            function Line(a, b) {
                this.a = a;
                this.b = b;
            }
            Line.prototype.getSide = function (point) {
                var lx = this.a.x - this.b.x, ly = this.a.y - this.b.y, px = point.x - this.a.x, py = point.y - this.a.y;
                return lx * py > ly * px;
            };
            Line.prototype.intersection = function (other) {
                var ax = this.a.x - this.b.x, ay = this.a.y - this.b.y, bx = other.a.x - other.b.x, by = other.a.y - other.b.y, ca = this.a.x * this.b.y - this.a.y * this.b.x, cb = other.a.x * other.b.y - other.a.y * other.b.x, l = ax * by - ay * bx;
                return new Point((ca * bx - cb * ax) / l, (ca * by - cb * ay) / l);
            };
            return Line;
        })();
        var Polygon = (function () {
            function Polygon(points) {
                this.points = points;
            }
            Polygon.fromArray = function (points) {
                return new Polygon(points.map(function (x) { return new Point(x[0], x[1]); }));
            };
            Polygon.prototype.area = function () {
                var previousPoint = this.points[this.points.length - 1];
                var unsignedArea = this.points.reduce(function (total, point) {
                    var t = (previousPoint.x - point.x) * (previousPoint.y + point.y);
                    previousPoint = point;
                    return total + t;
                }, 0) / 2;
                return Math.abs(unsignedArea);
            };
            Polygon.prototype.split = function (line) {
                var a = [], b = [];
                var previousPoint = this.points[this.points.length - 1];
                var previousSide = line.getSide(previousPoint);
                this.points.forEach(function (point) {
                    var side = line.getSide(point);
                    if (previousSide !== side) {
                        var intersect = line.intersection(new Line(point, previousPoint));
                        a.push(intersect);
                        b.push(intersect);
                    }
                    (side ? a : b).push(point);
                    previousPoint = point;
                    previousSide = side;
                });
                return [new Polygon(a), new Polygon(b)];
            };
            return Polygon;
        })();
        Engine.Polygon = Polygon;
    })(Engine = Split.Engine || (Split.Engine = {}));
})(Split || (Split = {}));
/**
 * Created by andy on 21/12/14.
 */
var Split;
(function (Split) {
    var View;
    (function (View) {
        var Bucket = (function () {
            function Bucket() {
                this.items = {};
                this.pointer = 0;
            }
            Bucket.prototype.add = function (item) {
                var _this = this;
                var key = this.pointer++;
                this.items[key] = item;
                return function () {
                    delete _this.items[key];
                };
            };
            Bucket.prototype.empty = function () {
                this.items = {};
            };
            Bucket.prototype.forEach = function (fn) {
                var _this = this;
                Object.keys(this.items).forEach(function (key) { return fn(_this.items[key]); });
            };
            return Bucket;
        })();
        var Artist = (function () {
            function Artist() {
                var canvas = document.getElementById('art');
                this.context = canvas.getContext('2d');
                this.render();
            }
            Artist.prototype.addDrawable = function (drawable) {
                this.drawables.add(drawable);
            };
            Artist.prototype.render = function () {
                var _this = this;
                this.drawables.forEach(function (drawable) {
                    drawable.draw(_this.context);
                });
                window.requestAnimationFrame(this.render);
            };
            Artist.prototype.drawPoly = function (polygon) {
                var _this = this;
                this.context.beginPath();
                var finalPoint = polygon.points[polygon.points.length - 1];
                this.context.moveTo(finalPoint.x, finalPoint.y);
                polygon.points.forEach(function (point) {
                    _this.context.lineTo(point.x, point.y);
                });
                this.context.fill();
                this.context.stroke();
            };
            return Artist;
        })();
        View.Artist = Artist;
    })(View = Split.View || (Split.View = {}));
})(Split || (Split = {}));
/**
 * Created by andy on 21/12/14.
 */
/**
 * Created by andy on 21/12/14.
 */
/// <reference path="references.ts" />
var artist = new Split.View.Artist();
artist.drawPoly(Split.Engine.Polygon.fromArray([[10, 10], [100, 10], [10, 100]]));
var canvas = $('#art');
canvas.on('mousemove', function (event) {
    console.log('%s : %s', event.offsetX, event.offsetY);
});
//# sourceMappingURL=app.js.map