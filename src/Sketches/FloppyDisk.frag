precision highp float;

uniform float time;

uniform float innerSize;
uniform float outerSize;
uniform float wobbleShape1;
uniform float wobbleFactor1;
uniform float wobbleShape2;
uniform float wobbleFactor2;
uniform vec4 centerColor;
uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;
uniform vec4 backgroundColor;

varying vec2 vUv;

void main () {
    float anim = sin(time) * 0.5 + 0.5;
    gl_FragColor = backgroundColor;//vec4(vec2(vUv.x * anim), blueness,  1.0);
}