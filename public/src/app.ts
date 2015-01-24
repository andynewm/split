/**
 * Created by andy on 21/12/14.
 */

/// <reference path="references.ts" />

module Split {
    class Thing implements View.IDrawable {
        private end : Engine.Point;

        constructor(private start : Engine.Point) {
            this.set(start.x, start.y);
        }

        public set(x : number, y : number) {
            this.end = new Engine.Point(x, y);
        }

        public getLine() {
            return new Engine.Line(this.start, this.end);
        }

        public draw(
            context : CanvasRenderingContext2D,
            width : number,
            height : number) {
            var pre = this.preExtend(),
                post = this.postExtend();

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
        }

        private preExtend() {
            return this.start
                .subtract(this.end)
                .multiply(1000)
                .add(this.start);
        }

        private postExtend() {
            return this.end
                .subtract(this.start)
                .multiply(1000)
                .add(this.end);
        }
    }

    interface TweenArgs {
        obj : any;
        property : string;
        target : number;
        time : number;
        delay : number;
        form : (number) => number;
    }

    function tween(args : TweenArgs) {
        var startValue = args.obj[args.property];
        var startTime = Date.now();

        function go() {
            var elapsedTime = Date.now() - startTime;

            args.obj[args.property] =
                startValue + (args.target - startValue) * (elapsedTime / args.time);

            if (elapsedTime < args.time) {
                window.requestAnimationFrame(go);
            }
        }

        window.setTimeout(go, args.delay || 0);
    }

    export var run = () => {
        var artist = new View.Artist();

        var n : number = 0;

        var polygon : Engine.Polygon;
        var removePolygon : () => void;

        $.get('puzzles/2.json')
            .then(puzzle => {
                polygon = Engine.Polygon.fromArray(puzzle.points, '#888');
                removePolygon = artist.register(polygon)
            });

        var canvas = $('#art');

        var removeThing : () => void;
        var thing : Thing;

        canvas
            .on('mousemove', (event : JQueryMouseEventObject) => {
                if (thing) {
                    thing.set(event.offsetX, event.offsetY);
                }
            })
            .on('mousedown', (event : JQueryMouseEventObject) => {
                thing = new Thing(new Engine.Point(event.offsetX, event.offsetY));

                removeThing = artist.register(thing);
            })
            .on('mouseup mouseleave', () => {
                if (removeThing) {
                    removePolygon();

                    var splitLine = thing.getLine();

                    var newPolygons = polygon.split(splitLine);

                    var shiftA = splitLine.normal().multiply(20);
                    
                    shiftA.rotate();

                    var shiftB = shiftA.multiply(-1);

                    newPolygons[0].points.forEach(point =>
                    {
                        tween(<TweenArgs>{
                            obj: point,
                            property: 'x',
                            target: point.x + shiftA.x,
                            time: 1000
                        });
                        tween(<TweenArgs>{
                            obj: point,
                            property: 'y',
                            target: point.y + shiftA.y,
                            time: 1000
                        });
                    });

                    newPolygons[1].points.forEach(point =>
                    {
                        tween(<TweenArgs>{
                            obj: point,
                            property: 'x',
                            target: point.x + shiftB.x,
                            time: 1000
                        });
                        tween(<TweenArgs>{
                            obj: point,
                            property: 'y',
                            target: point.y + shiftB.y,
                            time: 1000
                        });
                    });

                    newPolygons.forEach(polygon => {
                        artist.register(polygon);
                        console.log(polygon.area());
                    });

                    removeThing();
                    removeThing = null;
                }
                thing = null;
            });
    }
}