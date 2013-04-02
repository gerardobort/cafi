attribute vec3 aVertexPosition;
//attribute vec4 aVertexColor;

uniform mat4 uTranslationMatrix;
uniform mat4 uRotationYMatrix;
uniform mat4 uRotationXMatrix;
uniform mat4 uScaleMatrix;
uniform mat4 uPerspectiveMatrix;

//varying lowp vec4 vColor;

void main(void) {
    gl_Position = uTranslationMatrix * uRotationYMatrix * uRotationXMatrix * uScaleMatrix * uPerspectiveMatrix * vec4(aVertexPosition, 1);
    //vColor = aVertexColor;
}
