var vertexShaderSrc = '\n\
    attribute vec2 aVertexPosition;\n\
    \n\
    void main() {\n\
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);\n\
    }\n\
';

var fragmentShaderSrc = '\n\
    #ifdef GL_ES\n\
    precision highp float;\n\
    #endif\n\
    \n\
    uniform vec4 uColor;\n\
    \n\
    void main() {\n\
        gl_FragColor = uColor;\n\
    }\n\
';
/**
 * Cafi Canvas Render
 */
Cafi.Render = function () {
    this.universeDomElement = document.getElementById(Cafi.containerId);
    this.canvas = document.createElement('canvas');
    this.canvas.width = Cafi.universeWidth;
    this.canvas.height = Cafi.universeHeight;
    this.universeDomElement.appendChild(this.canvas);

    // base styling
    this.styleDomElement = document.createElement('link');
    this.styleDomElement.rel = 'stylesheet';
    this.styleDomElement.type = 'text/css';
    this.styleDomElement.href = '/lib/render-webgl.cafi.css';
    document.body.appendChild(this.styleDomElement);

    try {
        this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    } catch (e) {}
   
    if (!this.gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
       
    if (this.gl) {
        var gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.

        // compile shaders
        var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertexShaderSrc);
        gl.compileShader(vs);
         
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragmentShaderSrc);
        gl.compileShader(fs);
         
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(vs));
        }
         
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(fs));
        }

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.log(gl.getProgramInfoLog(program));
        }

        this.aspect = this.canvas.width / this.canvas.height;   
    }
};

Cafi.Render.prototype.getType = function () {
    return 'webgl';
};

Cafi.Render.prototype.cleanCanvas = function () {
    var gl = this.gl;
    //gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
};

Cafi.Render.prototype.initializeModel = function (model) {
    var gl = this.gl,
        aspect = this.aspect;

    var vertices = new Float32Array([
        -0.5, 0.5*aspect, 0.5, 0.5*aspect,  0.5,-0.5*aspect,  // Triangle 1
        -0.5, 0.5*aspect, 0.5,-0.5*aspect, -0.5,-0.5*aspect   // Triangle 2
    ]);
     
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);                                       
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
     
    itemSize = 2;
    numItems = vertices.length / itemSize;

    gl.useProgram(program);
     
    program.uColor = gl.getUniformLocation(program, "uColor");
    gl.uniform4fv(program.uColor, [0.0, 0.3, 0.0, 1.0]);
     
    program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, numItems);
};

Cafi.Render.prototype.renderModel = function (model) {
/*
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
*/
};

Cafi.render = new Cafi.Render();
