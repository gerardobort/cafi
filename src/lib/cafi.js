/**
 * Cafi is an experimental Physics Engine based on Continuous DeltaT
 * @author gerardobort <gerardobort@gmail.com>
 */

var Cafi = {

    // Consts
    PI: Math.PI,
    E: Math.E,
    GRAVITY: 9.81,
    time: 0,
    dT: 1000/10,
    timeBreakPoint: 40*1000,
    timeScale: 0.005,

    models: [],
    tiemr: null,
    initialize: function () {
        var i, iModel, Cafi__models = Cafi.models;
        for (i = (Cafi__models || []).length-1; i > -1; --i) {
            iModel = Cafi__models[i];
            iModel.render();
        }
    },
    mainLoop: function () {
        var i, iModel, Cafi__models = Cafi.models;
        for (i = (Cafi__models || []).length-1; i > -1; --i) {
            iModel = Cafi__models[i];
            iModel.process();
            iModel.render();
        }
        
        if ((Cafi.time += Cafi.dT) > Cafi.timeBreakPoint) {
            clearInterval(Cafi.timer);
            console.log('finished');
        }
    },
    run: function () {
        var started = true;

        this.initialize();
        console.log('start')
        this.timer = setInterval(this.mainLoop, Cafi.dT);
        window.onkeydown = function (e) {
            switch (e.keyCode) {
                case 40: // down arrow
                    if (started = !started) {
                        console.log('continue')
                        Cafi.timer = setInterval(Cafi.mainLoop, Cafi.dT);
                    } else {
                        console.log('pause')
                        clearInterval(Cafi.timer);
                    }
                    break;
                case 37: // left arrow
                     console.log('rwd')
                     Cafi.dT *= -1;
                     Cafi.mainLoop();
                     Cafi.dT *= -1;
                    break;
                case 39: // right arrow
                     console.log('fwd')
                     Cafi.mainLoop();
                    break;
            }
        };
    }
};

/**
 * Cafi Model
 * uses ISU as convention
 * @see http://en.wikipedia.org/wiki/International_System_of_Units
 */
Cafi.Model = function (options) {
    // Endo Vars: Status
    this.mass = options.mass || 1;
    this.forces = options.forces || [];
    this.potentialEnergy = options.potentialEnergy || 0;
    this.cineticEnergy = options.cineticEnergy || 0;
    this.normal = options.normal || [0, 0, 1];
    this.velocity = options.velocity || [0, 0, 0];
    this.position = options.position || [0, 0, 0];

    // Endo Vars
    this.acceleration = options.acceleration || [0, 0, 0];

    this.debugDomElement = options.debugDomElement || null;
    this.debugDomElement.style.webkitTransition = 'all ' + Cafi.dT + 'ms linear';

    // register model
    Cafi.models.push(this);
};


/**
 * Cafi Model : Math
 */
Cafi.Model.prototype.getDistance = function (model) {
    var a = this.position,
        b = model.position;
    return Math.sqrt((a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]) + (a[2]-b[2])*(a[2]-b[2]));
};


/**
 * Cafi Model : Physics
 */
Cafi.Model.prototype.getResultantForce = function () {
    var resultantForce = [0, 0, 0],
        forces = this.forces,
        i, f;

    for (i = (forces || []).length-1; i > -1; --i) {
        f = forces[i];
        resultantForce[0] += f[0];
        resultantForce[1] += f[1];
        resultantForce[2] += f[2];
    }

    // gravity
    resultantForce[2] += -this.mass*Cafi.GRAVITY;
    return resultantForce;
};

Cafi.Model.prototype.process = function () {
    var dt = Cafi.dT * Cafi.timeScale,
        p = this.position,
        p1,
        v = this.velocity,
        m = this.mass,
        f,
        a,
        ce,
        pe;

    f = this.getResultantForce();
    a = [f[0]/m, f[1]/m, f[2]/m];

    this.forces = [];
    this.velocity = v = [v[0] + a[0]*dt, v[1] + a[1]*dt, v[2] + a[2]*dt];
    this.position = p1 = [p[0] + v[0]*dt, p[1] + v[1]*dt, p[2] + v[2]*dt];
    this.potentialEnergy = pe = m*Cafi.GRAVITY*p1[2];
    this.cineticEnergy = ce = 0.5*m*v[2]*v[2];

    //console.log(pe, ce, pe+ce);

    // collisions
    if (p1[2] < 100) {
        var mod_v = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]),
            mod_v2 = Math.sqrt(2*ce/m),
            ver_v = [v[0]/mod_v, v[1]/mod_v, v[2]/mod_v];

        if (mod_v < 0.1) {
            this.velocity = [0, 0, 0];
        } else {
            //this.velocity = [ver_v[0]*mod_v, ver_v[1]*mod_v, -ver_v[2]*mod_v];
            this.velocity = [v[0], v[1], -v[2]];
        }
        this.position = [p[0], p[1], 100];
    }
};

Cafi.Model.prototype.render = function () {
    this.debugDomElement.style
        .webkitTransform = 'translate(' + (this.position[1]) + 'px, ' + (this.position[2]) +'px)';
};


