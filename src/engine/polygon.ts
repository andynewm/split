module Split.Engine {
    export class Point {
        constructor(public x : number, public y : number) {}

        public subtract(other : Point) {
            return new Point(this.x - other.x, this.y - other.y);
        }

        public add(other : Point) {
            return new Point(this.x + other.x, this.y + other.y);
        }

        public multiply(scalar : number) {
            return new Point(this.x * scalar, this.y * scalar);
        }

        public shift(other : Point) {
            this.x += other.x;
            this.y += other.y;
        }

        public magnitudeSquared() {
            return this.x * this.x + this.y * this.y;
        }

        public magnitude() {
            return Math.sqrt(this.magnitudeSquared());
        }

        public normal() {
            var magnitude = this.magnitude();

            return new Point(this.x / magnitude, this.y / magnitude);
        }

        public clone() {
            return new Point(this.x, this.y);
        }

        public rotate() {
            var t = this.x;
            this.x = -this.y;
            this.y = t;
        }
    }

    export class Line {
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

        public lengthSquared() {
            return this.a.subtract(this.b).magnitudeSquared();
        }

        public length() {
            return this.a.subtract(this.b).magnitude();
        }

        public normal() {
            return this.a.subtract(this.b).normal();
        }
    }

    export class Polygon implements View.IDrawable {
        constructor(public points : Point[], private colour : string) {}

        public static fromArray(points : number[][], colour : string) {
            return new Polygon(
                points.map(
                    x => new Point(x[0], x[1])),
                colour);
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

                    a.push(intersect.clone());
                    b.push(intersect.clone());
                }

                (side ? a : b).push(point);

                previousPoint = point;
                previousSide = side;
            });

            return [new Polygon(a, this.colour), new Polygon(b, this.colour)];
        }

        public centre() {
            return this.points.reduce((sum, point) =>
                sum.add(point)).multiply(1/this.points.length);
        }

        public draw(context : CanvasRenderingContext2D) {
            context.beginPath();

            var finalPoint = this.points[this.points.length - 1];

            context.moveTo(finalPoint.x, finalPoint.y);

            this.points.forEach(point => {
                context.lineTo(point.x, point.y);
            });

            context.fillStyle = this.colour;

            context.lineWidth = 2;

            context.fill();

            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            var centre = this.centre();

            context.fillText(this.area() + 'px\u00B2', centre.x, centre.y);
        }
    }
}