var pathPrefix = document.location.href.match(/github\.(io|com)/) ? '/cafi' : '';
require.config({
    baseUrl: pathPrefix + "/src/lib",
    map:{
        '*': {
            shader: pathPrefix + '/src/build/require-text.js',
            css: pathPrefix + '/src/build/require-css.js'
        }
    }
});

require([
    'cafi', 'cafi/model', 'cafi/bounding/box', 'cafi/render/html5', 'cafi/render/webgl'
    ], function (Cafi, CafiModel, CafiBoundingBox, CafiHTML5Render, CafiWebGLRender) {


    Cafi.start();

    new Cafi.Render.HTML5({ containerId: 'html5-canvas-container', scale: 0.5 });
    new Cafi.Render.WebGL({ containerId: 'webgl-canvas-container', scale: 1 });

    var ramp = new Cafi.Model({
        mass: 10000, 
        position: [300, 300, 200],
        velocity: [0, 0, 0],
        name: '1',
        orientation: [0,1,0]
    });
    var ramp_b = new Cafi.Bounding.Box({ model: ramp, width: 600, height: 2, depth: 600 });

    var e1 = new Cafi.Model({
        mass: 1, 
        charge: 2E-2,
        position: [250, 300, 200],
        velocity: [50, 0, 0],
        name: '1'
    });

    var p1 = new Cafi.Model({
        mass: 1,
        charge: -2E-2,
        position: [750, 500, 100],
        velocity: [-50, 0, 0],
        name: '2'
    });

    var b1 = new Cafi.Model({
        mass: 10, 
        position: [250, 500, 200],
        velocity: [80, 0, 0],
        name: '1'
    });

    var b2 = new Cafi.Model({
        mass: 10,
        position: [750, 500, 200],
        velocity: [-50, 0, 0],
        name: '2'
    });


    var renders = Cafi.renders, moving = false, xi = 0, yi = 0, xf = 0, yf = 0,
        i = 2, j;

    document.oncontextmenu = function (e) {
        e.preventDefault();
    };
    document.onmousedown = function (e) {
        if (0 === e.button) {
            moving = true;
        }
        if (2 === e.button) {
            new Cafi.Model({
                mass: 1,
                charge: 1E-2 * (i++%2 ? 1 : -1),
                position: [e.clientX, e.clientY, 400],
                velocity: [parseInt(Math.random()*50*(e.clientX > window.innerWidth/2 ? -1 : 1), 10), parseInt(Math.random()*100, 10), -20],
                name: ''
            });
        }
    };
    document.onmouseup = function (e) {
        moving = false;
    };
    document.onmousemove = function (e) {
        xf = e.clientX;
        yf = e.clientY;
        if (moving) {
            for (j = 0; j < renders.length; j++) {
                renders[j].rotateX += (yf-yi)*-0.1;
                renders[j].rotateY += (xf-xi)*-0.1;
            }
        }
        xi = e.clientX;
        yi = e.clientY;
    };

});
