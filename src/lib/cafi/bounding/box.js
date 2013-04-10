define('cafi/bounding/box', ['cafi', 'cafi/v3', 'cafi/m4'], function (Cafi, V3, M4) {


    Cafi.Bounding = Cafi.Bounding || {};

    Cafi.Bounding.Box = function (options) {
        this.model = options.model;
        this.width = options.width;
        this.height = options.height;
        this.depth = options.depth;

        var p = this.model.position, w = this.width, h = this.height, d = this.depth;
        this.min = [p[0]-w, p[1]-h, p[2]-d];
        this.max = [p[0]+w, p[1]+h, p[2]+d];

        this.model.setBounding(this);
    };

    Cafi.Bounding.Box.prototype.getType = function () {
        return 'box';
    };

    Cafi.Bounding.Box.prototype.testCollision = function (bounding) { // not oriented AABB AABB detection
        var a = this, b = bounding;
        if ('box' === b.getType()) {
            if (a.max[0] < b.min[0] || a.min[0] > b.max[0]) return false;
            if (a.max[1] < b.min[1] || a.min[1] > b.max[1]) return false;
            if (a.max[2] < b.min[2] || a.min[2] > b.max[2]) return false;
            return true;
        }
    };

    return Cafi.Bounding.Box;

});
