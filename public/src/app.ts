/**
 * Created by andy on 21/12/14.
 */

/// <reference path="references.ts" />

module Split {
    export var run = () => {
        var artist = new View.Artist();

        var n : number = 0;

        //artist.drawPoly(Split.Engine.Polygon.fromArray([[10,10],[100,10],[10,100]]));

        var clear = artist.register({
            draw: context => {
                context.beginPath();

                context.moveTo(0, 0);
                context.lineTo(40, n++);

                context.stroke();
            }
        });

        artist.register({
            draw: context => {
                context.beginPath();

                context.moveTo(0, 0);
                context.lineTo(x, y);

                context.stroke();
            }
        });

        var y : number = 0, x : number = 0;

        var canvas = $('#art');

        canvas
            .on('mousemove', (event : JQueryMouseEventObject) => {
                x = event.offsetX;
                y = event.offsetY;

                console.log('%s : %s', event.offsetX, event.offsetY);
            })
            .on('mousedown', () => {
                clear();
            });
    }
}