module Split.Engine {
    class Point {
        constructor(public x : number, public y : number) {}
    }

    class Line {
        constructor(private a : Point, private b : Point) {}

        public getSide(point : Point) {
            var lx = this.a.x - this.b.x,
                ly = this.a.y - this.b.y,
                px = point.x - this.a.x,
                py = point.y - this.a.y;

            return lx * py > ly * px;
        }

        public intersection(other : Line) {
            var ax = this.a.x - this.b.x,
                ay = this.a.y - this.b.y,
                bx = other.a.x - other.b.x,
                by = other.a.y - other.b.y,

                ca = this.a.x * this.b.y - this.a.y * this.b.x,
                cb = other.a.x * other.b.y - other.a.y * other.b.x,

                l = ax*by - ay*bx;

            return new Point(
                (ca * bx - cb * ax) / l,
                (ca * by - cb * ay) / l
            )
        }
    }

    export class Polygon {
        constructor(public points : Point[]) {}

        public static fromArray(points : number[][]) {
            return new Polygon(points.map(x => new Point(x[0], x[1])));
        }

        public area() {
            var previousPoint = this.points[this.points.length - 1];

            var unsignedArea = this.points.reduce((total, point) => {
                    var t = (previousPoint.x - point.x)
                        * (previousPoint.y + point.y);
                    previousPoint = point;
                    return total + t;
                }, 0) / 2;

            return Math.abs(unsignedArea);
        }

        public split(line : Line) {
            var a = [],
                b = [];

            var previousPoint = this.points[this.points.length - 1];
            var previousSide = line.getSide(previousPoint);

            this.points.forEach(point => {
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
        }
    }
}