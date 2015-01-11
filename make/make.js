(function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var poly = [], mx, my;

    $(canvas).on('click', function (event) {
        poly.push([
            event.offsetX,
            event.offsetY
        ]);
    }).on('mousemove', function (event) {
        mx = event.offsetX;
        my = event.offsetY;
    });

    (function draw() {
        context.clearRect(0, 0, 600, 400);

        if (poly.length) {
            context.beginPath();

            context.moveTo(mx, my);

            poly.forEach(function (p) {
                context.lineTo(p[0], p[1]);
            });

            context.closePath();

            context.stroke();
        }

        window.requestAnimationFrame(draw);
    })();

    $('#save').on('click', function () {
        $.ajax('/polygon', {
            data: JSON.stringify({poly: poly}),
            type: 'POST',
            contentType: 'application/json'
        });
    })


})();