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
Cafi.styleDomElement.href = '/lib/html5.cafi.css';
document.body.appendChild(Cafi.styleDomElement);

// some dynamic styling
Cafi.systemDomElement.style.width = Cafi.universeWidth + 'px';
Cafi.systemDomElement.style.height = Cafi.universeHeight + 'px';
Cafi.universeDomElement.style.webkitPerspective = Cafi.universeDepth + 'px';


Cafi.initializeRender = function () {
};


Cafi.Model.prototype.initializeRender = function () {
    var system = Cafi.systemDomElement,   
        styleSheet = document.styleSheets[0],
        debugDomElement = document.createElement('div'),
        debugDomElement_direction = document.createElement('div');

    debugDomElement.id = 'model-' + this.id;
    debugDomElement.className = 'model';
    debugDomElement_direction.id = 'model-' + this.id + '-vector-direction-z';
    debugDomElement_direction.className = 'vector direction';
    debugDomElement_direction.style.webkitTransformOrigin = '0 0 0';
    debugDomElement_direction.dataset.label = this.name;

    if (Cafi.enableTransitions) {
        debugDomElement.style.webkitTransition = 'all ' + Cafi.dT + 'ms linear';
        //debugDomElement_direction.style.webkitTransition = 'all ' + Cafi.dT + 'ms linear';
    }

    system.appendChild(debugDomElement);
    system.appendChild(debugDomElement_direction);

    this.debugDomElement = debugDomElement;
    this.debugDomElement_direction = debugDomElement_direction;
};

Cafi.Model.prototype.render = function () {
    var translate3d = 'translate3d(' + this.position.join('px, ') + 'px)',
        mScale = this.mass/10,
        directionVersor = this.direction.v3_getVersor();

    this.debugDomElement.style.webkitTransform = translate3d
        + ' scale3d(' + mScale + ', ' + mScale + ', ' + mScale +')';

    this.debugDomElement_direction.style.webkitTransform = translate3d 
        + ' rotate3d(' + directionVersor.v3_product([0,1,0]).v3_getVersor().join(',') + ', ' + (directionVersor.v3_getAngleXZ()-90) + 'deg)';

    if (this.charge) {
        this.debugDomElement_direction.style.background = (this.charge < 0 ? 'blue' : 'red');
    }
};
