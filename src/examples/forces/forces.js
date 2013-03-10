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


document.onmousemove = function (e) {
    Cafi.containerDomElement.style.webkitTransform = 'rotate3d(0, -1, 1, 180deg) scaleX(-1) translate3d(0px, 0px, -100px) rotate3d(0,0,1,' + (360/window.innerWidth)*e.clientX + 'deg) rotate3d(0,1,0,' + -(e.clientY-180)*0.02 + 'deg)' ;
}


Cafi.run();
