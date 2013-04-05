define('cafi/render/html5', ['cafi', 'cafi/v3', 'cafi/m4', 'cafi/model', 'css!./html5.css'], function (Cafi, V3, M4, Model) {

    Cafi.Render = Cafi.Render || {};

    /**
     * Cafi HTML5 Render
     */
    Cafi.Render.HTML5 = function (options) {
        var container = document.getElementById(options.containerId);

        this.canvas = document.createElement('div');
        this.canvas.id = 'universe';
        container.appendChild(this.canvas);

        // reference system
        this.systemDomElement = document.createElement('div');
        this.systemDomElement.id = 'system';

        // X axis
        this.xAxisDomElement = document.createElement('div');
        this.xAxisDomElement.className = 'axis x';

        // Y axis
        this.yAxisDomElement = document.createElement('div');
        this.yAxisDomElement.className = 'axis y';

        // Z axis
        this.zAxisDomElement = document.createElement('div');
        this.zAxisDomElement.className = 'axis z';

        // compose tree structure
        this.systemDomElement.appendChild(this.xAxisDomElement);
        this.systemDomElement.appendChild(this.yAxisDomElement);
        this.systemDomElement.appendChild(this.zAxisDomElement);
        this.canvas.appendChild(this.systemDomElement);

        // some dynamic styling
        this.systemDomElement.style.width = Cafi.universeWidth + 'px';
        this.systemDomElement.style.height = Cafi.universeHeight + 'px';
        this.canvas.style.webkitPerspective = Cafi.universeDepth + 'px';

        this.rotateX = 180;
        this.rotateY = 0;

        Cafi.renders.push(this);
    };

    Cafi.Render.HTML5.prototype.getType = function () {
        return 'html5';
    };

    Cafi.Render.HTML5.prototype.cleanCanvas = function () {
        this.systemDomElement.style.webkitTransform = 'translate3d(0, -100px, -600px)'
            + ' scaleZ(-1)'
            + ' rotateY(' + (this.rotateY) + 'deg)'
            + ' rotateX(' + (-this.rotateX) + 'deg)';
    };

    Cafi.Render.HTML5.prototype.initializeModel = function (model) {
        var system = this.systemDomElement,   
            debugDomElement = document.createElement('div'),
            debugDomElement_direction = document.createElement('div');

        debugDomElement.id = 'model-' + model.id;
        debugDomElement.className = 'model';
        debugDomElement_direction.id = 'model-' + model.id + '-vector-direction-z';
        debugDomElement_direction.className = 'vector direction';
        debugDomElement_direction.style.webkitTransformOrigin = '0 0 0';
        debugDomElement_direction.dataset.label = model.name;

        if (Cafi.enableTransitions) {
            debugDomElement.style.webkitTransition = 'all ' + Cafi.dT + 'ms linear';
            //debugDomElement_direction.style.webkitTransition = 'all ' + Cafi.dT + 'ms linear';
        }

        system.appendChild(debugDomElement);
        system.appendChild(debugDomElement_direction);

        model.debugDomElement = debugDomElement;
        model.debugDomElement_direction = debugDomElement_direction;
    };

    Cafi.Render.HTML5.prototype.renderModel = function (model) {
        var translate3d = 'translate3d(' + model.position.join('px, ') + 'px)',
            mScale = model.mass/10,
            directionVersor = model.direction.v3_getVersor();

        model.debugDomElement.style.webkitTransform = translate3d
            + ' scale3d(' + mScale + ', ' + mScale + ', ' + mScale +')';

        model.debugDomElement_direction.style.webkitTransform = translate3d 
            + ' rotate3d(' + directionVersor.v3_product([0,1,0]).v3_getVersor().join(',') + ', ' + (directionVersor.v3_getAngleXZ()-90) + 'deg)';

        if (model.charge) {
            model.debugDomElement_direction.style.background = (model.charge < 0 ? 'blue' : 'red');
        }
    };

    return Cafi.Render.HTML5;

});
