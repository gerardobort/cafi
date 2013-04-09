define('cafi/bounding/box', ['cafi', 'cafi/v3', 'cafi/m4'], function (Cafi, V3, M4) {


    Cafi.Bounding = Cafi.Bounding || {};

    Cafi.Bounding.Box = function (options) {
        this.model = options.model;
        this.width = options.width;
        this.height = options.height;
        this.depth = options.depth;

        this.model.setBounding(this);
    };

    Cafi.Bounding.Box.prototype.getType = function () {
        return 'box';
    };

    return Cafi.Bounding.Box;

});
