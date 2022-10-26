precision highp float;

#pragma glslify: noise = require(glsl-noise/classic/3d) 

uniform float time;
uniform vec2 renderSize;

uniform float goopScale;
uniform float offsetX;
uniform float offsetY;
uniform float noiseEdge;
uniform vec4 demoColor;

varying vec2 vUv;

/*
Upon revisiting:
- smoother noise
- finessed colors
- maybe endless cascade?
*/

float TIME_MULT = 0.2;
vec3 EDGE_COLOR = vec3(0.9294, 0.4549, 0.1804);
vec3 FG_COLOR = vec3(0.949, 0.9373, 0.3255);
vec3 BG_COLOR = vec3(0.1412, 0.4392, 0.2667);
vec3 TEST_COLOR = vec3(0.9294, 0.1804, 0.1804);

void main() {
	float aspectRatio = float(renderSize.x) / float(renderSize.y);
	vec2 st = vUv;
	st = st * 2.0 - 1.;
	st.x *= aspectRatio;
    st *= goopScale;

    float noiseVal = noise(vec3(time * TIME_MULT, st.x, st.y));
    float offsetNoiseVal = noise(vec3(time * TIME_MULT, st.x + offsetX, st.y + offsetY));
    float offsetNoiseVal2 = noise(vec3(time * TIME_MULT, st.x + offsetX * 2.0, st.y + offsetY * 2.));

    float scaledNoiseEdge = ((1.0 - noiseEdge) * 2.0) - 1.0;
    float mask = step(scaledNoiseEdge, noiseVal);
    float offsetMask = step(scaledNoiseEdge, offsetNoiseVal);
    float offsetMask2 = step(scaledNoiseEdge, offsetNoiseVal2);

    vec3 bgComponent = (1.0 - mask) * ((1.0 - (1.0 - mask) * offsetMask)) * (1.0 - ((1.0 - mask) * (1.0 - offsetMask) * offsetMask2)) * BG_COLOR;
    vec3 edge2Component = (1.0 - mask) * (1.0 - offsetMask) * offsetMask2 * TEST_COLOR;
    vec3 edgeComponent = (1.0 - mask) * offsetMask * EDGE_COLOR;
    vec3 fgComponent = mask * FG_COLOR;

    vec3 compositeColor = bgComponent + edgeComponent + edge2Component + fgComponent;
    gl_FragColor = vec4(compositeColor,1.0);
}
