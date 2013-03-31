/**
 * Cafi HTML5 Render
 */
Cafi.Render = function () {
    this.universeDomElement = document.getElementById(Cafi.containerId);
console.log(this.universeDomElement)

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
    this.universeDomElement.appendChild(this.systemDomElement);

    // base styling
    this.styleDomElement = document.createElement('link');
    this.styleDomElement.rel = 'stylesheet';
    this.styleDomElement.type = 'text/css';
    this.styleDomElement.href = '/lib/render-html5.cafi.css';
    document.body.appendChild(this.styleDomElement);

    // some dynamic styling
    this.systemDomElement.style.width = Cafi.universeWidth + 'px';
    this.systemDomElement.style.height = Cafi.universeHeight + 'px';
    this.universeDomElement.style.webkitPerspective = Cafi.universeDepth + 'px';
};

Cafi.Render.prototype.getType = function () {
    return 'html5';
};

Cafi.Render.prototype.cleanCanvas = function () {
    
};

Cafi.Render.prototype.initializeModel = function (model) {
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

Cafi.Render.prototype.renderModel = function (model) {
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

Cafi.render = new Cafi.Render();
