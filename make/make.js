var poly = [];

(function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    context.fillStyle = 'rgba(255,128,0,0.3)';

    var mx, my;

    $(canvas).on('click', function (event) {
        poly.push([
            event.offsetX,
            event.offsetY
        ]);
    }).on('mousemove', function (event) {
        mx = event.offsetX;
        my = event.offsetY;
    }).on('mouseleave', function () {
        mx = null;
        my = null;
    });

    (function draw() {
        context.clearRect(0, 0, 600, 400);

        if (poly.length) {
            context.beginPath();

            context.moveTo(poly[0][0], poly[0][1]);

            poly.slice(1).forEach(function (p) {
                context.lineTo(p[0], p[1]);
            });

            if (mx) {
                context.lineTo(mx, my);
            }
            else {
                context.closePath();
            }

            context.fill();

            context.stroke();
        }

        window.requestAnimationFrame(draw);
    })();

    $('#save').on('click', function () {
        $.ajax('/polygon', {
            data: JSON.stringify({points: poly}),
            type: 'POST',
            contentType: 'application/json'
        });
    });

    $.get('/polygon')
        .then(function (n) {
            var i;
            for (i = 1; i <= n; i++) {
                (function (i) {
                    $('<a>')
                        .text('Number: ' + i)
                        .on('click', function () {
                            $.get('/polygon/' + i)
                                .then(function (p) {
                                    poly = p.points;
                                });
                        })
                        .appendTo('#puzzles');
                })(i);
            }
        });


})();