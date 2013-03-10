var ball1 = new Cafi.Model({
    mass: 7, 
    position: [0, 0, 400],
    velocity: [0, 20, 0]
});

var ball2 = new Cafi.Model({
    mass: 1,
    position: [0, 400, 400],
    velocity: [0, -20, 0]
});

var ball3 = new Cafi.Model({
    mass: 3,
    position: [0, 200, 400],
    velocity: [0, 10, -30]
});

Cafi.run();
