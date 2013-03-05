var ball1 = new Cafi.Model({ mass: 5, position: [0, 0, 550] }),
    ball1_el = document.getElementById('ball1');

var ball2 = new Cafi.Model({ mass: 10000, position: [0, 0, 50] }),
    ball2_el = document.getElementById('ball2');

var timer = setInterval(function () {

    //console.log('ball1 - resultantForce', ball1.getResultantForce());
    //console.log('position', ball1.position[2]/Cafi.pixelScale);

    ball1.process();
    ball1.render(ball1_el);

    ball2.process();
    ball2.render(ball2_el);
    

    if ((Cafi.time += Cafi.dT) > 5*1000) {
        clearInterval(timer);
        console.log('finished');
    }

}, Cafi.dT);

/*

    f=m*a
    a=f/m
    y=y0 + v*t + 1/2at2

*/
