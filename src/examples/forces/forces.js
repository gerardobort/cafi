var ball1 = new Cafi.Model({
    mass: 7, 
    position: [0, 400, 400],
    velocity: [20, -50, 0]
});

var ball2 = new Cafi.Model({
    mass: 1,
    position: [400, 400, 400],
    velocity: [-20, -50, 0]
});

var ball3 = new Cafi.Model({
    mass: 3,
    position: [500, 400, 400],
    velocity: [-30, 44, 0]
});

var ball4 = new Cafi.Model({
    mass: 7, 
    position: [0, 600, 0],
    velocity: [60, 0, 60]
});

document.onmousedown = function (e) {
    var ballx = new Cafi.Model({
        mass: 2,
        position: [e.clientX, e.clientY, 400],
        velocity: [parseInt(Math.random()*50*(e.clientX > window.innerWidth/2 ? -1 : 1), 10), parseInt(Math.random()*100, 10), -20]
    });
}


document.onmousemove = function (e) {
    Cafi.containerDomElement.style.webkitTransform = 'translate3d(0, -100px, -600px)'
        + ' scaleZ(-1)'
        + ' rotateY(' + ((360/window.innerWidth)*e.clientX*0.5 +270) + 'deg)'
        + ' rotateX(' + ((360/window.innerHeight)*-e.clientY*0.5 -100) + 'deg)';
}


Cafi.run();
