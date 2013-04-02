define('cafi/model', ['cafi', 'cafi/v3'], function (Cafi, V3) {

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
        this.charge = options.charge || 0;

        // Endo Vars
        this.acceleration = options.acceleration || [0, 0, 0];
        this.id = Cafi.models.length;

        this.name = options.name || 'model_' + this.id;

        // register model
        Cafi.models.push(this);

        Cafi.render.initializeModel(this);
    };


    /**
     * Cafi Model : Physics
     */
    Cafi.Model.prototype.getResultantForce = function () {
        var resultantForce = [0, 0, 0],
            Cafi__models = Cafi.models,
            G = Cafi.G,
            K = Cafi.K,
            modelA = this, modelB, m = this.mass, q = this.charge, dg, de, rg, re, R,
            i, fe, fg;

        for (i = (Cafi__models || []).length-1; i > -1; --i) {
            modelB = Cafi__models[i];
            if (modelB === modelA) {
                continue;
            }

            dg = de = modelB.position.v3_substract(modelA.position);
            if (modelA.charge * modelB.charge > 0) {
                de = modelA.position.v3_substract(modelB.position);
            }

            R = dg.v3_getModule();
            re = de.v3_getVersor();
            rg = dg.v3_getVersor();
            fg = (1E12*G*m*modelB.mass)/(R*R +1E3);
            fe = (K*Math.abs(q*modelB.charge))/(R*R +1E4);

            resultantForce[0] += fg*rg[0] + fe*re[0];
            resultantForce[1] += fg*rg[1] + fe*re[1];
            resultantForce[2] += fg*rg[2] + fe*re[2];
        }
        return resultantForce;
    };

    Cafi.Model.prototype.process = function (skipCollisions) {
        var dt = Cafi.dT * Cafi.timeScale,
            p = this.position,
            p1,
            v = this.velocity,
            m = this.mass,
            f = this.getResultantForce(),
            a = [f[0]/m, f[1]/m, f[2]/m],
            ce,
            pe = m*Cafi.GRAVITY*p[2];

        if ((p[1] + (v[1] + a[1]*dt)*dt)  > 0) { // TODO floor limit --> potential energy
            a[1] -= Cafi.GRAVITY;
        }

        this.forces = [];
        this.velocity = v = [v[0] + a[0]*dt, v[1] + a[1]*dt, v[2] + a[2]*dt];
        this.position = p1 = [p[0] + v[0]*dt, p[1] + v[1]*dt, p[2] + v[2]*dt];
        this.direction = p1.v3_substract(p).v3_getVersor();
        this.potentialEnergy = pe = m*Cafi.GRAVITY*p1[1];
        this.cineticEnergy = ce = 0.5*m*v[1]*v[1];

        // main container edge collisions
        if (!skipCollisions) {
            if (p1[0] < 0) {
                this.processCollision([1, 0, 0]);
            }
            if (p1[0] > Cafi.universeWidth) {
                this.processCollision([-1, 0, 0]);
            }
            if (p1[1] < 0) {
                this.processCollision([0, 1, 0]);
            }
            if (p1[1] > Cafi.universeHeight) {
                this.processCollision([0, -1, 0]);
            }
            if (p1[2] < 0) {
                this.processCollision([0, 0, 1]);
            }
            if (p1[2] > Cafi.universeDepth) {
                this.processCollision([0, 0, -1]);
            }
        }
    };

    Cafi.Model.prototype.processCollision = function (normal) {
        var v1 = this.velocity,
            v2 = this.velocity.v3_reflect(normal);
        this.velocity = v1.v3_cos(v2) > 0.987 ? [0, 0, 0] : v2.v3_dotProduct(0.89); // velocity decreases by 11%
        this.process(true); // re-calculate positioning
    }

    Cafi.Model.prototype.initializeRender = function () {
        throw "No render engine initialized, try loading html5 or canvas Cafi modules.";
    };

    return Cafi.Model;

});
