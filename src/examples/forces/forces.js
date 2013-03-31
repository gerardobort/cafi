Cafi.loadModules(['v3', 'model', 'v3', 'bounding', 'render-html5'], function () {

    Cafi.start();

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


    var i = 2;
    document.onmousedown = function (e) {
        var px = new Cafi.Model({
            mass: 1,
            charge: 1E-2 * (i++%2 ? 1 : -1),
            position: [e.clientX, e.clientY, 400],
            velocity: [parseInt(Math.random()*50*(e.clientX > window.innerWidth/2 ? -1 : 1), 10), parseInt(Math.random()*100, 10), -20],
            name: ''
        });
    };


    document.onmousemove = function (e) {
        Cafi.systemDomElement.style.webkitTransform = 'translate3d(0, -100px, -600px)'
            + ' scaleZ(-1)'
            + ' rotateY(' + ((360/window.innerWidth)*e.clientX*0.5 +270) + 'deg)'
            + ' rotateX(' + ((360/window.innerHeight)*-e.clientY*0.5 -100) + 'deg)';
    };

});
