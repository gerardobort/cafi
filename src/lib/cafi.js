/**
 * Cafi is an experimental Physics Engine based on Continuous DeltaT
 * @author gerardobort <gerardobort@gmail.com>
 */

var Cafi;

Cafi = function () {};
Cafi.prototype = { };

/**
 * Cafi Model : Constants
 */
Cafi.PI = Math.PI;
Cafi.E = Math.E;
Cafi.GRAVITY = 9.81;
Cafi.time = 0;
Cafi.dT = 1000/10;
Cafi.pixelScale = 13000*1000;


/**
 * Cafi Model
 * uses ISU as convention
 * @see http://en.wikipedia.org/wiki/International_System_of_Units
 */
Cafi.Model = function (options) {
    // Endo Vars: Status
    this.mass = options.mass || 1;
    this.potentialEnergy = options.potentialEnergy || 0;
    this.cineticEnergy = options.cineticEnergy || 0;
    this.normal = options.normal || [0, 0, 1];
    this.velocity = options.velocity || [0, 0, 0];
    this.position = options.position || [0, 0, 0];
    //this.acceleration = options.acceleration || [0, 0, 0];
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
Cafi.Model.prototype.getResultantForce = function (externalModels) {
    var resultantForce = [0, 0, 0], i;

    // TODO summarize all external forces
    for (i = (externalModels || []).length; i > 0; --i) {
    }

    // gravity
    resultantForce[2] -= this.mass*Cafi.GRAVITY;
    return resultantForce;
};

Cafi.Model.prototype.getVelocity = function () {
    var v = this.velocity,
        f = this.getResultantForce(),
        m = this.mass,
        t = Cafi.dT;
    return [v[0] + f[0]/m*t,v[1] + f[1]/m*t, v[2] + f[2]/m*t];
};

/*
Cafi.Model.prototype.getAcceleration = function () {
    var v = this.velocity,
        f = this.getResultantForce(),
        k1 = (Cafi.time*Cafi.time)/(2*this.mass);
    // TODO review
    return [v[0] + f[0]*k1, v[1] + f[1]*k1, v[2] + f[2]*k1];
};
*/

Cafi.Model.prototype.process = function () {
    var p = this.position,
        v = this.velocity = this.getVelocity(),
        f = this.getResultantForce(),
        t = Cafi.time,
        ka = (t*t)/(2*this.mass);
    this.position = [p[0] + v[0]*t + f[0]*ka, p[1] + v[1]*t + f[1]*ka, p[2] + v[2]*t + f[2]*ka];
};

Cafi.Model.prototype.render = function (domElement) {
    var s = Cafi.pixelScale;
    domElement.style.webkitTransform = 'translate(' + (this.position[1]/s) + 'px, ' + (-this.position[2]/s) +'px)';
};
