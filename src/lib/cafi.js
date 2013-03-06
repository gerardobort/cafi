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
    dT: 1000/30,
    timeBreakPoint: 120*1000,
    timeScale: 0.005,

    models: [],
    run: function () {
        var Cafi__models = this.models;
        var timer = setInterval(function () {
            var i, iModel;
            for (i = (Cafi__models || []).length-1; i > -1; --i) {
                iModel = Cafi__models[i];
                iModel.process();
                iModel.render();
            }
            

            if ((Cafi.time += Cafi.dT) > Cafi.timeBreakPoint) {
                clearInterval(timer);
                console.log('finished');
            }

        }, Cafi.dT);
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
        v = this.velocity,
        m = this.mass,
        f,
        a;

    v = this.velocity;
    f = this.getResultantForce();
    a = [f[0]/m, f[1]/m, f[2]/m];

    this.forces = [];
    this.velocity = [v[0] + a[0]*dt, v[1] + a[1]*dt, v[2] + a[2]*dt];
    this.position = [p[0] + v[0]*dt, p[1] + v[1]*dt, p[2] + v[2]*dt];


    // collisions
    if (this.position[2] <= -390) {
        this.forces.push([0, 0, -98.9]);
        var ec = 0.5*m*v[2]*v[2],
            vAbs1 = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]),
            vAbs2 = Math.sqrt(2*ec/m),
            vVers = [v[0]/vAbs1, v[1]/vAbs1, v[2]/vAbs1];
        if (vAbs1 < 0.1)  {
            this.velocity = [0, 0, 0];
        } else {
            this.velocity = [vVers[0]*vAbs2, vVers[1]*vAbs2, -vVers[2]*vAbs1];
        }
    }
};

Cafi.Model.prototype.render = function () {
    this.debugDomElement.style
        .webkitTransform = 'translate(' + (this.position[1]) + 'px, ' + (-this.position[2]) +'px)';
};


