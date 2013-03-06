var ball1 = new Cafi.Model({
    mass: 5, 
    position: [0, 0, -200],
    velocity: [0, 5, 0],
    debugDomElement: document.getElementById('ball1')
});


var ball2 = new Cafi.Model({
    mass: 10,
    position: [0, 600, 0],
    velocity: [0, -10, 0],
    debugDomElement: document.getElementById('ball2')
});

Cafi.run();
