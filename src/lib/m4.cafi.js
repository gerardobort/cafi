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
        1, 0, 0, v3[0],
        0, 1, 0, v3[1],
        0, 0, 1, v3[2],
        0, 0, 0, 1
    ];
};

Array.m4_getRotation = function (deg, v3) {
    var rads = deg * Math.PI / 180.0,
        e=v3.v3_getModule(),
        x=v3[0]/e, y=v3[1]/e, z=v3[2]/e,
        s=Math.sin(rads), c=Math.cos(rads), t=1-c;

    return [
        t*x*x+c,   t*x*y-s*z, t*x*z+s*y, 0,
        t*x*y+s*z, t*y*y+c,   t*y*z-s*x, 0,
        t*x*z-s*y, t*y*z+s*x, t*z*z+c,   0,
        0,         0,         0,         1
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
        X, 0, A, 0,
        0, Y, B, 0,
        0, 0, C, D,
        0, 0, -1, 0
    ];
};

Array.prototype.m4_toFloat32Array = function () {
    return new Float32Array(this);
};
