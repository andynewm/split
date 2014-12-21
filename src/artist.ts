/**
 * Created by andy on 21/12/14.
 */
module Split.View {

    export interface IArtist {
        drawPoly(polygon : Engine.Polygon);
        addDrawable(drawable : IDrawable);
    }

    export interface IDrawable {
        draw(context : CanvasRenderingContext2D);
    }

    class Bucket<T> {
        private items : { [key : number] : T} = {};
        private pointer : number = 0;

        public add(item : T) {
            var key = this.pointer++;
            this.items[key] = item;

            return () => { delete this.items[key] };
        }

        public empty() {
            this.items = {};
        }

        public forEach(fn : (t : T) => void) {
            Object.keys(this.items).forEach(key => fn(this.items[key]));
        }
    }

    export class Artist implements IArtist{

        private context : CanvasRenderingContext2D;
        private drawables : Bucket<IDrawable>;

        constructor() {
            var canvas = <HTMLCanvasElement> document.getElementById('art');
            this.context = canvas.getContext('2d');

            this.render();
        }

        public addDrawable(drawable : IDrawable) {
            this.drawables.add(drawable);
        }

        private render() {
            this.drawables.forEach(drawable => {
                drawable.draw(this.context);
            });

            window.requestAnimationFrame(this.render);
        }

        public drawPoly(polygon : Split.Engine.Polygon) {
            this.context.beginPath();

            var finalPoint = polygon.points[polygon.points.length - 1];

            this.context.moveTo(finalPoint.x, finalPoint.y);

            polygon.points.forEach(point => {
                this.context.lineTo(point.x, point.y);
            });

            this.context.fill();
            this.context.stroke();
        }

    }

}