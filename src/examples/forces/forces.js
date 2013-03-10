var ball1 = new Cafi.Model({
    mass: 7, 
    position: [400, 0, 400],
    velocity: [0, 20, -50]
});

var ball2 = new Cafi.Model({
    mass: 1,
    position: [400, 400, 400],
    velocity: [0, -20, -50]
});

var ball3 = new Cafi.Model({
    mass: 3,
    position: [400, 500, 400],
    velocity: [0, -30, 44]
});

document.onmousedown = function (e) {
    var ballx = new Cafi.Model({
        mass: 1,
        position: [0, e.clientX, 500-e.clientY],
        velocity: [10, parseInt(Math.random()*50*(e.clientX > window.innerWidth/2 ? -1 : 1), 10), parseInt(Math.random()*100, 10)]
    });
}

Cafi.run();
