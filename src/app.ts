/**
 * Created by andy on 21/12/14.
 */

/// <reference path="references.ts" />

var artist = new Split.View.Artist();

artist.drawPoly(Split.Engine.Polygon.fromArray([[10,10],[100,10],[10,100]]));

var canvas = $('#art');

canvas.on('mousemove', (event : JQueryMouseEventObject) => {
    console.log('%s : %s', event.offsetX, event.offsetY);
});