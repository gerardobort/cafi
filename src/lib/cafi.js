/**
 * Cafi is an experimental Physics Engine based on Continuous DeltaT
 * @author gerardobort <gerardobort@gmail.com>
 */
var Cafi = {
    modules: [],
    loadModules: function (moduleNames, callback) {
        if ('string' === typeof moduleNames) {
            moduleNames = [moduleNames];
        }
        var i, l = moduleNames.length;
        for (i = 0; i < l; i++) {
            var moduleName = moduleNames[i],
                lastScriptElement = document.scripts[document.scripts.length-1],
                scriptElement = document.createElement('script');
            scriptElement.src = '/lib/' + moduleName + '.cafi.js';
            if (i === l-1) {
                scriptElement.onload = function () {
                    callback && callback.apply(this, arguments);
                    Cafi.modules.push(moduleName);
                };
            }
            if (!~Cafi.modules.indexOf(moduleName)) {
                console.log('module loaded: ' + moduleName)
                lastScriptElement.parentNode.appendChild(scriptElement);
            } else {
                console.log('module repeated: ' + moduleName)
            }
            Cafi.modules.push(moduleName);
        }
    },
    PI: Math.PI,
    E: Math.E,
    GRAVITY: 9.81,
    time: 0,
    dT: 1000/29,
    G: 6.67E-11,
    K: 9E9,
    em: 9.1E-28, 
    eq: -1.6E-19,
    pm: 1.67E-24,
    pq: 1.6E-19,
    enableTransitions: true,
    collisionThreshold: 7,
    timeBreakPoint: 5*60*1000,
    timeScale: 0.003,
    universeDomElement: document.getElementById('universe'),
    models: [],
    colisionMatrix: [], // upper triangular matrix
    tiemr: null,
    octree: [], // multidimentional octree
    octreeMaxDepth: 4,
    universeWidth: window.screen.width,
    universeHeight: window.screen.height,
    universeDepth: window.screen.height,
    mainLoop: function () {
        var i, j, iModel, jModel, Cafi__models = Cafi.models, Cafi__collisionMatrix = Cafi.colisionMatrix, 
        Cafi__render__renderModel = Cafi.render.renderModel;

        Cafi.resetOctree();
        for (i = (Cafi__models || []).length-1; i > -1; --i) {
            iModel = Cafi__models[i];
            iModel.process();
            Cafi.setModelInOctree(iModel);
        }

        // @TODO traverse the Cafi.octree rather than the Cafi_models
        for (i = (Cafi__models || []).length-1; i > -1; --i) {
            iModel = Cafi__models[i];
            for (j = (Cafi__models || []).length-1; i < j; --j) {
                jModel = Cafi__models[j];
                if (iModel.position.v3_getDistance(jModel.position) < Cafi.collisionThreshold) {
                    Cafi.processModelsCollision(i, j);
                }
            }
        }

        Cafi.render.cleanCanvas();
        for (i = (Cafi__models || []).length-1; i > -1; --i) {
            iModel = Cafi__models[i];
            Cafi__render__renderModel(iModel);
        }
        
        if ((Cafi.time += Cafi.dT) > Cafi.timeBreakPoint) {
            clearInterval(Cafi.timer);
            console.log('finished');
        }
    },
    start: function () {
        var started = true;
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

        // plastic collision
        // modelA.velocity = modelB.direction.v3_dotProduct(modelA.velocity.v3_getModule());
        // modelB.velocity = modelA.direction.v3_dotProduct(modelB.velocity.v3_getModule());

        // inelastic collision
        var a_v1 = modelA.velocity,
            b_v1 = modelB.velocity,
            a_v2 = modelB.direction.v3_dotProduct(a_v1.v3_getModule()),
            b_v2 = modelA.direction.v3_dotProduct(b_v1.v3_getModule()),
            a_iv2 = 1.4*modelB.cineticEnergy/(modelA.cineticEnergy+modelB.cineticEnergy), // 1.4 is hardcoded :P 
            b_iv2 = 1.4*modelA.cineticEnergy/(modelA.cineticEnergy+modelB.cineticEnergy),
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
    },
    resetOctree: function () {
        delete this.octree;
        this.octree = [];
    },
    setModelInOctree: function (model) {
        var p = model.position, binaryPosition, modelOctreePath = [],
            parentOctree = Cafi.octree, currentOctree, octreeDepth, octreeMaxDepth = Cafi.octreeMaxDepth, divisor;
            width = Cafi.universeWidth, height = Cafi.universeHeight, depth = Cafi.universeDepth;

        for (octreeDepth = 1; octreeDepth < octreeMaxDepth; ++octreeDepth) {
            /*
             * binary space cut:
             * x(0): left=0 - right=1
             * y(1): bottom=0 - top=1
             * z(2): back=0 - front=1
             */
            binaryPosition = parseInt('0' 
                + (p[2] > (depth=depth/2) ? 1 : 0)
                + (p[1] > (height=height/2) ? 1 : 0)
                + (p[0] > (width=width/2) ? 1 : 0), 2);

            if (octreeDepth === octreeMaxDepth-1) {
                if ('array' === typeof currentOctree[binaryPosition]) {
                    currentOctree[binaryPosition].push(model);
                } else {
                    currentOctree[binaryPosition] = [model];
                }
            } else {
                parentOctree = currentOctree || parentOctree;
                currentOctree = []; // new octree depth
                parentOctree[binaryPosition] = currentOctree;
            }
            modelOctreePath.push(binaryPosition);
        }
        model._Cafi_octreePath = modelOctreePath;
        model._Cafi_currentOctree = currentOctree;
    },
    getNearModelsInOctree: function (model) {
        return model._Cafi_currentOctree;
    }
};
