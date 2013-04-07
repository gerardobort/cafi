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

    Array.m4_getLookAt = function (eye, center, up) {
        var z = eye.v3_substract(center).v3_getVersor(),
            x = up.v3_product(z).v3_getVersor(),
            y = z.v3_product(x).v3_getVersor(),
            m = [
                x[0], y[0], z[0], 0,
                x[1], y[1], z[1], 0,
                x[2], y[2], z[2], 0,
                0,    0,    0,    1
            ];
        return m.m4_product(Array.m4_getTranslation(eye));
    };

    Array.prototype.m4_product = function (b) {
        var a = this, i, j, p = [];
        for (i = 0; i < 16; i+=4) {
            for (j = 0; j < 4; j++) {
                p.push(a[i]*b[j] + a[i+1]*b[j+4] + a[i+2]*b[j+8] + a[i+3]*b[j+12]);
            }
        }
        return p;
    };

    Array.prototype.m4_transpose = function () {
        var a = this;
        return [
            a[0], a[4], a[8],  a[12],
            a[1], a[5], a[9],  a[13],
            a[2], a[6], a[10], a[14],
            a[3], a[7], a[11], a[15]
        ];
    };

    return Array;

});
