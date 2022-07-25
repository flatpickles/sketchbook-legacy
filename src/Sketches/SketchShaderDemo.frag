precision highp float;

uniform float time;
uniform float blueness;
varying vec2 vUv;

void main () {
    float anim = sin(time) * 0.5 + 0.5;
    gl_FragColor = vec4(vec2(vUv.x * anim), blueness,  1.0);
}