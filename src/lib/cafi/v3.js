define([], function () {

    // https://github.com/mono/MonoGame/commit/a840f0e5d8b8b91490a8df0b159dea9975ddb2f6
    Array.prototype.v3_reflect = function (normal) {
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
        return Math.atan2(a[1], a[0])/Cafi.PI*180;
    };
    Array.prototype.v3_getAngleZ = function () {
        var a = this;
        return Math.atan2(a[1], a[2])/Cafi.PI*180;
    };
    Array.prototype.v3_getAngleXZ = function () {
        var a = this;
        return Math.atan2(a[1], Math.sqrt(a[0]*a[0] + a[2]*a[2]))/Cafi.PI*180;
    };
    Array.prototype.v3_dotProduct = function (value) {
        var a = this;
        if (typeof value === 'number') {
            return [a[0]*value, a[1]*value, a[2]*value];
        } else {
            return [a[0]*value[0], a[1]*value[1], a[2]*value[2]];
        } 
    };
    Array.prototype.v3_product = function (b) {
        var a = this;
        return [
            a[1]*b[2] - b[1]*a[2],
            -(a[0]*b[2] - b[0]*a[2]),
            a[0]*b[1] - b[0]*a[1]
        ];
    };
    Array.prototype.v3_cos = function (b) {
        var a = this;
        return a.v3_dotProduct(b)/(a.v3_getModule()*b.v3_getModule());
    };

    // @help plane and point operations
    // https://github.com/mono/MonoGame/blob/develop/MonoGame.Framework/Plane.cs
    Array.prototype.v3_classifyPlaneSide = function (plane) {
        var a = this;
        return a[0]*plane[0] + a[1]*plane[1] + a[2]*plane[2] + plane[3]; // plane[3] == D
    };

    return Array;

});
