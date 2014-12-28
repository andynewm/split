/**
 * Created by andy on 21/12/14.
 */
module Split.View {

    export interface IArtist {
        register(drawable : IDrawable);
    }

    export interface IDrawable {
        draw(context : CanvasRenderingContext2D, width: number, height : number);
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
        private width : number;
        private height : number;

        constructor() {
            var canvas = <HTMLCanvasElement> document.getElementById('art');
            this.context = canvas.getContext('2d');
            this.width = canvas.width;
            this.height = canvas.height;

            this.drawables = new Bucket<IDrawable>();

            this.render();
        }

        public register(drawable : IDrawable) {
            return this.drawables.add(drawable);
        }

        private render = () => {
            this.context.clearRect(0, 0, this.width, this.height);

            this.drawables.forEach(drawable => {
                this.context.save();
                drawable.draw(this.context, this.width, this.height);
                this.context.restore();
            });

            window.requestAnimationFrame(this.render);
        };

    }

}