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
    enableTransitions: true,
    collisionThreshold: 7,
    timeBreakPoint: 120*1000,
    timeScale: 0.01,

    models: [],
    colisionMatrix: [], // upper triangular matrix
    tiemr: null,
    initialize: function () {
        var i, iModel, Cafi__models = Cafi.models;
        for (i = (Cafi__models || []).length-1; i > -1; --i) {
            iModel = Cafi__models[i];
            iModel.render();
        }
    },
    mainLoop: function () {
        var i, j, iModel, jModel, Cafi__models = Cafi.models, Cafi__collisionMatrix = Cafi.colisionMatrix;
        for (i = (Cafi__models || []).length-1; i > -1; --i) {
            iModel = Cafi__models[i];
            iModel.process();
        }

        for (i = (Cafi__models || []).length-1; i > -1; --i) {
            iModel = Cafi__models[i];
            for (j = (Cafi__models || []).length-1; i < j; --j) {
                jModel = Cafi__models[j];
                //console.log(iModel.position.v3_getDistance(jModel.position));
                if (iModel.position.v3_getDistance(jModel.position) < Cafi.collisionThreshold) {
                    //console.log('collision!', iModel.position.v3_getDistance(jModel.position));
                    Cafi.processModelsCollision(i, j);
                }
            }
        }

        for (i = (Cafi__models || []).length-1; i > -1; --i) {
            iModel = Cafi__models[i];
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
    },
    processModelsCollision: function (i, j) {
        var modelA = this.models[i],
            modelB = this.models[j];

        // inelastic collision
        // modelA.velocity = modelB.direction.v3_dotProduct(modelA.velocity.v3_getModule());
        // modelB.velocity = modelA.direction.v3_dotProduct(modelB.velocity.v3_getModule());

        // elastic collision
        var a_v1 = modelA.velocity,
            b_v1 = modelB.velocity,
            a_v2 = modelB.direction.v3_dotProduct(a_v1.v3_getModule()),
            b_v2 = modelA.direction.v3_dotProduct(b_v1.v3_getModule()),
            a_iv2 = 1.4*modelB.mass/(modelA.mass+modelB.mass),
            b_iv2 = 1.4*modelA.mass/(modelA.mass+modelB.mass),
            a_iv1 = 1-a_iv2,
            b_iv1 = 1-b_iv2;

        modelA.velocity = [
            a_v1[0]*a_iv1 + a_v2[0]*a_iv2,
            a_v1[1]*a_iv1 + a_v2[1]*a_iv2,
            a_v1[2]*a_iv1 + a_v2[2]*a_iv2
        ];
        modelB.velocity = [
            b_v1[0]*b_iv1 + b_v2[0]*b_iv2,
            b_v1[1]*b_iv1 + b_v2[1]*b_iv2,
            b_v1[2]*b_iv1 + b_v2[2]*b_iv2
        ];
    }
};


// https://github.com/mono/MonoGame/commit/a840f0e5d8b8b91490a8df0b159dea9975ddb2f6
Array.prototype.v3_reflect = function (normal) {
    // I is the original array
    // N is the normal of the incident plane
    // R = I - (2 * N * ( DotProduct[ I,N] ))
    var reflectedVector = [],
        vector = this,
        dotProduct = ((vector[0] * normal[0]) + (vector[1] * normal[1])) + (vector[2] * normal[2]);
    reflectedVector[0] = vector[0] - (2 * normal[0]) * dotProduct;
    reflectedVector[1] = vector[1] - (2 * normal[1]) * dotProduct;
    reflectedVector[2] = vector[2] - (2 * normal[2]) * dotProduct;
    return reflectedVector;
};
Array.prototype.v3_getVersor = function () {
    var vector = this,
        module = Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2]);
    return [vector[0]/module, vector[1]/module, vector[2]/module];
};
Array.prototype.v3_getModule = function () {
    var vector = this;
    return Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2]);
};
Array.prototype.v3_getDistance = function (b) {
    var a = this,
        ab = b.v3_substract(a);
    return ab.v3_getModule();
};
Array.prototype.v3_substract = function (b) {
    var a = this;
    return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
};
Array.prototype.v3_getAngleX = function () {
    var a = this;
    return Math.atan2(a[2], a[1])/Cafi.PI*180;
};
Array.prototype.v3_dotProduct = function (value) {
    var a = this;
    if (typeof value === 'number') {
        return [a[0]*value, a[1]*value, a[2]*value];
    } else {
        return [a[0]*value[0], a[1]*value[1], a[2]*value[2]];
    } 
};
Array.prototype.v3_product = function (value) {
    var a = this;
    return a[0]*value[0] + a[1]*value[1] + a[2]*value[2];
};
Array.prototype.v3_cos = function (b) {
    var a = this;
    return a.v3_product(b)/(a.v3_getModule()*b.v3_getModule());
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
    this.direction = options.position || [0, 0, 0];

    // Endo Vars
    this.acceleration = options.acceleration || [0, 0, 0];

    this.debugDomElement = options.debugDomElement || null;
    this.debugDomElement_v = options.debugDomElement_v || null;
    if (Cafi.enableTransitions) {
        this.debugDomElement.style.webkitTransition = 'all ' + Cafi.dT + 'ms linear';
        this.debugDomElement_v.style.webkitTransition = 'all ' + Cafi.dT + 'ms linear';
    }

    // register model
    Cafi.models.push(this);
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

    return resultantForce;
};

Cafi.Model.prototype.process = function (skipCollisions) {
    var dt = Cafi.dT * Cafi.timeScale,
        p = this.position,
        p1,
        v = this.velocity,
        m = this.mass,
        f,
        a,
        ce,
        pe = m*Cafi.GRAVITY*p[2];

    f = this.getResultantForce();
    a = [f[0]/m, f[1]/m, f[2]/m];

    if (p[2] > 100) { // TODO floor limit --> potential energy
        a[2] -= Cafi.GRAVITY;
    }

    this.forces = [];
    this.velocity = v = [v[0] + a[0]*dt, v[1] + a[1]*dt, v[2] + a[2]*dt];
    this.position = p1 = [p[0] + v[0]*dt, p[1] + v[1]*dt, p[2] + v[2]*dt];
    this.direction = p1.v3_substract(p).v3_getVersor();
    this.potentialEnergy = pe = m*Cafi.GRAVITY*p1[2];
    this.cineticEnergy = ce = 0.5*m*v[2]*v[2];


    // collisions
    if (!skipCollisions) {
        if (p1[2] < 100) {
            this.processCollision([0, 0, 1]);
        }
        if (p1[2] > 500) {
            this.processCollision([0, 0, -1]);
        }
        if (p1[1] < 0) {
            this.processCollision([0, 1, 0]);
        }
        if (p1[1] > window.innerWidth) {
            this.processCollision([0, -1, 0]);
        }
    }
};

Cafi.Model.prototype.processCollision = function (normal) {
    var v1 = this.velocity,
        v2 = this.velocity.v3_reflect(normal);
    this.velocity = v1.v3_cos(v2) > 0.9 ? [0, 0, 0] : v2;
    this.process(true);
}

Cafi.Model.prototype.render = function () {
    this.debugDomElement.style
        .webkitTransform = 'translate(' + (this.position[1]) + 'px, ' + (this.position[2]) +'px)'
        + ' scale(' + this.mass + ')';

    this.debugDomElement_v.style.webkitTransformOrigin = '0 0';
    this.debugDomElement_v.style
        .webkitTransform = 'translate(' + (this.position[1]) + 'px, ' + (this.position[2]) +'px)'
        + ' rotate(' + (this.direction.v3_getAngleX()) + 'deg)';
};


