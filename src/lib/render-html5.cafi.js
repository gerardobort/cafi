/**
 * Cafi HTML5 Render
 */
Cafi.Render = function () {
    // reference system
    Cafi.systemDomElement = document.createElement('div');
    Cafi.systemDomElement.id = 'system';

    // X axis
    Cafi.xAxisDomElement = document.createElement('div');
    Cafi.xAxisDomElement.className = 'axis x';

    // Y axis
    Cafi.yAxisDomElement = document.createElement('div');
    Cafi.yAxisDomElement.className = 'axis y';

    // Z axis
    Cafi.zAxisDomElement = document.createElement('div');
    Cafi.zAxisDomElement.className = 'axis z';

    // compose tree structure
    Cafi.systemDomElement.appendChild(Cafi.xAxisDomElement);
    Cafi.systemDomElement.appendChild(Cafi.yAxisDomElement);
    Cafi.systemDomElement.appendChild(Cafi.zAxisDomElement);
    Cafi.universeDomElement.appendChild(Cafi.systemDomElement);

    // base styling
    Cafi.styleDomElement = document.createElement('link');
    Cafi.styleDomElement.rel = 'stylesheet';
    Cafi.styleDomElement.type = 'text/css';
    Cafi.styleDomElement.href = '/lib/render-html5.cafi.css';
    document.body.appendChild(Cafi.styleDomElement);

    // some dynamic styling
    Cafi.systemDomElement.style.width = Cafi.universeWidth + 'px';
    Cafi.systemDomElement.style.height = Cafi.universeHeight + 'px';
    Cafi.universeDomElement.style.webkitPerspective = Cafi.universeDepth + 'px';
};

Cafi.Render.prototype.cleanCanvas = function () {
    
};

Cafi.Render.prototype.initializeModel = function (model) {
    var system = Cafi.systemDomElement,   
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
