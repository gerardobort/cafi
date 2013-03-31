// 3d vertex shader
var vertexShaderSrc = '\n\
    attribute vec3 aVertexPosition;\n\
    \n\//attribute vec4 aVertexColor;\n\
    \n\
    uniform mat4 uMVMatrix;\n\
    uniform mat4 uPMatrix;\n\
    \n\
    \n\//varying lowp vec4 vColor;\n\
    \n\
    void main(void) {\n\
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 0.1);\n\
        \n\//vColor = aVertexColor;\n\
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
         
        var program = this.program = gl.createProgram();
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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var gl = this.gl,
        aspect = this.aspect,
        program = this.program,
        vertices = new Float32Array([
            0, 0, 0,   100, 0, 0,
            0, 0, 0,   0, 100, 0,
            0, 0, 0,   0, 0, 100,
        ]);
     
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);                                       
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
     
    itemSize = 3;
    numItems = vertices.length / itemSize;

    gl.useProgram(program);
     
    program.uColor = gl.getUniformLocation(program, "uColor");
    gl.uniform4fv(program.uColor, [1.0, 0.0, 0.0, 1.0]);


    var pUniform = gl.getUniformLocation(program, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, Array.m4_getPerspective(45, this.aspect, -5, 300.0).m4_toFloat32Array());

    var mvUniform = gl.getUniformLocation(program, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, Array.m4_getRotation(90, [0, 1, 0]).m4_toFloat32Array());


     
    program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.LINES, 0, numItems);

};

Cafi.Render.prototype.initializeModel = function (model) {
};

Cafi.Render.prototype.renderModel = function (model) {
    var gl = this.gl,
        aspect = this.aspect,
        program = this.program,
        p = model.position,
        d = model.direction.v3_dotProduct(100),
        vertices = new Float32Array([
            p[0], p[1], p[2],
            (p[0]+d[0]), (p[1]+d[1]), (p[2]+d[2])
        ]);
     
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);                                       
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
     
    itemSize = 3;
    numItems = vertices.length / itemSize;

    gl.useProgram(program);
     
    program.uColor = gl.getUniformLocation(program, "uColor");
    if (!model.charge) {
        gl.uniform4fv(program.uColor, [0, 1, 0, 1]);
    } else if (model.charge < 0) {
        gl.uniform4fv(program.uColor, [0, 0, 1, 1]);
    } else if (model.charge > 0) {
        gl.uniform4fv(program.uColor, [1, 0, 0, 1]);
    }
     
    program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.LINES, 0, numItems);

};

Cafi.render = new Cafi.Render();
