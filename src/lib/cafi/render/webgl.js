define('cafi/render/webgl', [
    'cafi', 'cafi/v3', 'cafi/m4', 'cafi/model', 
    'shader!./webgl.vert',
    'shader!./webgl.frag',
    'css!./webgl.css'
    ], function (Cafi, V3, M4, Model, vertexShaderSrc, fragmentShaderSrc) {

    Cafi.Render = Cafi.Render || {};

    /**
     * Cafi WebGL Render
     */
    Cafi.Render.WebGL = function (options) {
        this.universeDomElement = document.getElementById(Cafi.containerId);
        this.canvas = document.createElement('canvas');
        this.canvas.width = Cafi.universeWidth;
        this.canvas.height = Cafi.universeHeight;

        var container = document.getElementById(options.containerId);

        this.universeDomElement = document.createElement('div');
        this.universeDomElement.id = 'universe';
        container.appendChild(this.universeDomElement);

        this.universeDomElement.appendChild(this.canvas);

        // start GL context
        try {
            this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        } catch (e) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
        }
       
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

        // error logging
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
        this.scale = options.scale||1;

        this.rotateX = 0;
        this.rotateY = 0;

        Cafi.renders.push(this);
    };

    Cafi.Render.WebGL.prototype.getType = function () {
        return 'webgl';
    };

    Cafi.Render.WebGL.prototype.cleanCanvas = function () {
        var gl = this.gl,
            aspect = this.aspect,
            program = this.program;

        // clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);

        // apply global transformations
        var translationUniform = gl.getUniformLocation(program, "uTranslationMatrix");
        gl.uniformMatrix4fv(translationUniform, false, Array.m4_getTranslation([-0.8, -0.2, 0]).m4_toFloat32Array());

        var rotationYUniform = gl.getUniformLocation(program, "uRotationYMatrix");
        gl.uniformMatrix4fv(rotationYUniform, false, Array.m4_getRotation(this.rotateY||0, [0, 1, 0]).m4_toFloat32Array());

        var rotationXUniform = gl.getUniformLocation(program, "uRotationXMatrix");
        gl.uniformMatrix4fv(rotationXUniform, false, Array.m4_getRotation(this.rotateX||0, [1, 0, 0]).m4_toFloat32Array());

        var scaleUniform = gl.getUniformLocation(program, "uScaleMatrix");
        gl.uniformMatrix4fv(scaleUniform, false, Array.m4_getScale([
            this.scale/Cafi.universeWidth, this.scale/Cafi.universeHeight, this.scale/Cafi.universeDepth
        ]).m4_toFloat32Array());

        var sqrt2 = Math.sqrt(2);

        var perspectiveUniform = gl.getUniformLocation(program, "uPerspectiveMatrix");
        //gl.uniformMatrix4fv(perspectiveUniform, false, Array.m4_getPerspective(45, 1, -2, 2).m4_toFloat32Array());
        //gl.uniformMatrix4fv(perspectiveUniform, false, Array.m4_getIdentity().m4_toFloat32Array());
        //gl.uniformMatrix4fv(perspectiveUniform, false, Array.m4_getLookAt([0, 0, 1], [0,0,0], [0,100,0]).m4_toFloat32Array());
        gl.uniformMatrix4fv(perspectiveUniform, false, Array.m4_getOrtho(-sqrt2, sqrt2, -sqrt2, sqrt2, -sqrt2, sqrt2).m4_toFloat32Array());

        var vertices, w = Cafi.universeWidth, h = Cafi.universeHeight, d = Cafi.universeDepth;

        // render edges
        vertices = new Float32Array([
            0, 0, 0,   w, 0, 0,
            w, 0, 0,   w, h, 0,
            w, h, 0,   0, h, 0,
            0, h, 0,   0, 0, 0,

            0, 0, 0,   w, 0, 0,
            w, 0, 0,   w, 0, d,
            w, 0, d,   0, 0, d,
            0, 0, d,   0, 0, 0
        ]);
         
        vbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);                                       
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
         
        itemSize = 3;
        numItems = vertices.length / itemSize;
         
        program.uColor = gl.getUniformLocation(program, "uColor");
        gl.uniform4fv(program.uColor, [0, 0, 0.3, 1]);

        program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0)

        gl.drawArrays(gl.LINES, 0, numItems);

        // render axis versors
        vertices = new Float32Array([
            0, 0, 0,   30, 0, 0,   1, 0, 0,
            0, 0, 0,   0, 30, 0,   0, 1, 0,
            0, 0, 0,   0, 0, 30,   0, 0, 1
        ]);
         
        vbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);                                       
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
         
        itemSize = 3;
        numItems = vertices.length / itemSize;
         
        program.uColor = gl.getUniformLocation(program, "uColor");
        gl.uniform4fv(program.uColor, [0, 1, 0, 1]);

        program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0)


        gl.drawArrays(gl.LINES, 0, numItems);


        // render floor
        /*
        var vertices = new Float32Array([
            0, 0, 1,   0, 0, 0,   1, 0, 0,
            0, 0, 1,   1, 0, 1,   1, 0, 0
        ]);
         
        vbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);                                       
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
         
        itemSize = 3;
        numItems = vertices.length / itemSize;
         
        program.uColor = gl.getUniformLocation(program, "uColor");
        gl.uniform4fv(program.uColor, [0.05, 0.05, 0.05, 1]);

        program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0)


        gl.drawArrays(gl.TRIANGLES, 0, numItems);
        */
    };

    Cafi.Render.WebGL.prototype.initializeModel = function (model) {
    };

    Cafi.Render.WebGL.prototype.renderModel = function (model) {
        var gl = this.gl,
            aspect = this.aspect,
            program = this.program,
            p = model.position,
            r = model.direction.v3_dotProduct(aspect*30),
            vertices = new Float32Array([
                p[0], p[1], p[2],
                (p[0]+r[0]), (p[1]+r[1]), (p[2]+r[2])
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

    return Cafi.Render.WebGL;

});
