define('cafi/m4', ['cafi/v3'], function (V3) {

    Array.m4_getIdentity = function (v3) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }
    Array.m4_getTranslation = function (v3) {
        return [
            1,         0,     0,     0,
            0,         1,     0,     0,
            0,         0,     1,     0,
            v3[0], v3[1], v3[2],     1 // they go inverted!
        ];
    };

    Array.m4_getScale = function (v3) {
        return [
            v3[0],     0,     0,    0,
            0,     v3[1],     0,    0,
            0,         0, v3[2],    0,
            0,         0,     0,    1
        ];
    };

    Array.m4_getRotation = function (deg, v3) {
        var rads = deg * Math.PI / 180.0,
            e = v3.v3_getModule(),
            x = v3[0]/e, y = v3[1]/e, z = v3[2]/e,
            s = Math.sin(rads), c = Math.cos(rads), t = 1-c;

        return [
            t*x*x+c,    t*x*y+s*z,  t*x*z-s*y,  0,         
            t*x*y-s*z,  t*y*y+c,    t*y*z+s*x,  0,         
            t*x*z+s*y,  t*y*z-s*x,  t*z*z+c,    0,         
            0,          0,          0,          1
        ];
        /*return [
            t*x*x+c,   t*x*y-s*z, t*x*z+s*y, 0,
            t*x*y+s*z, t*y*y+c,   t*y*z-s*x, 0,
            t*x*z-s*y, t*y*z+s*x, t*z*z+c,   0,
            0,         0,         0,         1
        ];*/
    /*
    function (b,a){if(!a){return Matrix.create([
        [Math.cos(b),-Math.sin(b)],
        [Math.sin(b),Math.cos(b)]
    ])}var d=a.dup();if(d.elements.length!=3){return null}var e=d.modulus();var x=d.elements[0]/e,y=d.elements[1]/e,z=d.elements[2]/e;var s=Math.sin(b),c=Math.cos(b),t=1-c;return Matrix.create([
        [t*x*x+c,t*x*y-s*z,t*x*z+s*y],
        [t*x*y+s*z,t*y*y+c,t*y*z-s*x],
        [t*x*z-s*y,t*y*z+s*x,t*z*z+c]
    ])}
    */
    };

    Array.m4_getPerspective = function (fovy, aspect, znear, zfar) {
        var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;

        return Array.m4_getFrustum(xmin, xmax, ymin, ymax, znear, zfar);
    };

    Array.m4_getFrustum = function (left, right, bottom, top, znear, zfar) {
        var X = 2*znear/(right-left),
            Y = 2*znear/(top-bottom),
            A = (right+left)/(right-left),
            B = (top+bottom)/(top-bottom),
            C = -(zfar+znear)/(zfar-znear),
            D = -2*zfar*znear/(zfar-znear);

        return [
            X, 0, 0, 0,
            0, Y, 0, 0,
            A, B, C, -1,
            0, 0, D, 0
        ];
    };

    Array.prototype.m4_toFloat32Array = function () {
        return new Float32Array(this);
    };

    Array.m4_getOrtho = function (left, right, bottom, top, znear, zfar) {
        var tx = -(right+left)/(right-left);
        var ty = -(top+bottom)/(top-bottom);
        var tz = -(zfar+znear)/(zfar-znear);

        return [
            2/(right-left),   0,               0,               0,
            0,                2/(top-bottom),  0,               0,
            0,                0,               -2/(zfar-znear), 0,
            tx,               ty,              tz,              1
        ];
    };

    return Array;

});
