var Split;
(function (Split) {
    var Engine;
    (function (Engine) {
        var Point = (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            Point.prototype.subtract = function (other) {
                return new Point(this.x - other.x, this.y - other.y);
            };
            Point.prototype.add = function (other) {
                return new Point(this.x + other.x, this.y + other.y);
            };
            Point.prototype.multiply = function (scalar) {
                return new Point(this.x * scalar, this.y * scalar);
            };
            Point.prototype.shift = function (other) {
                this.x += other.x;
                this.y += other.y;
            };
            Point.prototype.magnitudeSquared = function () {
                return this.x * this.x + this.y * this.y;
            };
            Point.prototype.magnitude = function () {
                return Math.sqrt(this.magnitudeSquared());
            };
            Point.prototype.normal = function () {
                var magnitude = this.magnitude();
                return new Point(this.x / magnitude, this.y / magnitude);
            };
            Point.prototype.clone = function () {
                return new Point(this.x, this.y);
            };
            Point.prototype.rotate = function () {
                var t = this.x;
                this.x = -this.y;
                this.y = t;
            };
            return Point;
        })();
        Engine.Point = Point;
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
            Line.prototype.lengthSquared = function () {
                return this.a.subtract(this.b).magnitudeSquared();
            };
            Line.prototype.length = function () {
                return this.a.subtract(this.b).magnitude();
            };
            Line.prototype.normal = function () {
                return this.a.subtract(this.b).normal();
            };
            return Line;
        })();
        Engine.Line = Line;
        var Polygon = (function () {
            function Polygon(points, colour) {
                this.points = points;
                this.colour = colour;
            }
            Polygon.fromArray = function (points, colour) {
                return new Polygon(points.map(function (x) { return new Point(x[0], x[1]); }), colour);
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
                        a.push(intersect.clone());
                        b.push(intersect.clone());
                    }
                    (side ? a : b).push(point);
                    previousPoint = point;
                    previousSide = side;
                });
                return [new Polygon(a, this.colour), new Polygon(b, this.colour)];
            };
            Polygon.prototype.draw = function (context) {
                context.beginPath();
                var finalPoint = this.points[this.points.length - 1];
                context.moveTo(finalPoint.x, finalPoint.y);
                this.points.forEach(function (point) {
                    context.lineTo(point.x, point.y);
                });
                context.fillStyle = this.colour;
                context.strokeStyle = 'rgba(200, 190, 50, 0.9)';
                context.lineWidth = 2;
                context.fill();
                context.stroke();
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
                var _this = this;
                this.render = function () {
                    _this.context.clearRect(0, 0, _this.width, _this.height);
                    _this.drawables.forEach(function (drawable) {
                        _this.context.save();
                        drawable.draw(_this.context, _this.width, _this.height);
                        _this.context.restore();
                    });
                    window.requestAnimationFrame(_this.render);
                };
                var canvas = document.getElementById('art');
                this.context = canvas.getContext('2d');
                this.width = canvas.width;
                this.height = canvas.height;
                this.drawables = new Bucket();
                this.render();
            }
            Artist.prototype.register = function (drawable) {
                return this.drawables.add(drawable);
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
var Split;
(function (Split) {
    var Thing = (function () {
        function Thing(start) {
            this.start = start;
            this.set(start.x, start.y);
        }
        Thing.prototype.set = function (x, y) {
            this.end = new Split.Engine.Point(x, y);
        };
        Thing.prototype.getLine = function () {
            return new Split.Engine.Line(this.start, this.end);
        };
        Thing.prototype.draw = function (context, width, height) {
            var pre = this.preExtend(), post = this.postExtend();
            context.beginPath();
            context.moveTo(pre.x, pre.y);
            context.lineTo(post.x, post.y);
            context.lineWidth = 1;
            context.stroke();
            context.beginPath();
            context.moveTo(this.start.x, this.start.y);
            context.lineTo(this.end.x, this.end.y);
            context.lineWidth = 3;
            context.stroke();
        };
        Thing.prototype.preExtend = function () {
            return this.start.subtract(this.end).multiply(1000).add(this.start);
        };
        Thing.prototype.postExtend = function () {
            return this.end.subtract(this.start).multiply(1000).add(this.end);
        };
        return Thing;
    })();
    Split.run = function () {
        var artist = new Split.View.Artist();
        var n = 0;
        var polygon;
        var removePolygon;
        $.get('puzzles/1.json').then(function (puzzle) {
            polygon = Split.Engine.Polygon.fromArray(puzzle.points, '#888');
            removePolygon = artist.register(polygon);
        });
        //artist.register(Split.Engine.Polygon.fromArray([[10,10],[100,10],[10,100]]));
        var canvas = $('#art');
        var removeThing;
        var thing;
        canvas.on('mousemove', function (event) {
            if (thing) {
                thing.set(event.offsetX, event.offsetY);
            }
        }).on('mousedown', function (event) {
            thing = new Thing(new Split.Engine.Point(event.offsetX, event.offsetY));
            removeThing = artist.register(thing);
        }).on('mouseup mouseleave', function () {
            if (removeThing) {
                removePolygon();
                var splitLine = thing.getLine();
                var newPolygons = polygon.split(splitLine);
                var shiftA = splitLine.normal().multiply(20);
                shiftA.rotate();
                var shiftB = shiftA.multiply(-1);
                newPolygons[0].points.forEach(function (point) { return point.shift(shiftA); });
                newPolygons[1].points.forEach(function (point) { return point.shift(shiftB); });
                newPolygons.forEach(function (polygon) {
                    artist.register(polygon);
                    console.log(polygon.area());
                });
                removeThing();
                removeThing = null;
            }
            thing = null;
        });
    };
})(Split || (Split = {}));
//# sourceMappingURL=app.js.map