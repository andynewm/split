/**
 * Created by andy on 20/12/14.
 */

describe('Polygon', function () {

    describe('Area function', function () {

        it('should give 0 for empty polygon', function () {
            var empty = Split.Engine.Polygon.fromArray([[0,0], [0,0], [0,0]]);

            expect(empty.area()).toBe(0);
        });

        it('should give 100 for a clockwise 10x10 square', function () {
            var square =  Split.Engine.Polygon.fromArray([[-5,-5], [5, -5], [5, 5], [-5, 5]]);

            expect(square.area()).toBe(100);
        });

        it('should give 100 for a anti-clockwise 10x10 square', function () {
            var square =  Split.Engine.Polygon.fromArray([[-5,-5], [-5, 5], [5, 5], [5, -5]]);

            expect(square.area()).toBe(100);
        });

    });

});