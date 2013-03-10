var ball1 = new Cafi.Model({
    mass: 7, 
    position: [0, 0, 400],
    velocity: [0, 20, 0],
    debugDomElement: document.getElementById('ball1'),
    debugDomElement_v: document.getElementById('ball1_v')
});

var ball2 = new Cafi.Model({
    mass: 1,
    position: [0, 400, 400],
    velocity: [0, -20, 0],
    debugDomElement: document.getElementById('ball2'),
    debugDomElement_v: document.getElementById('ball2_v')
});

Cafi.run();
