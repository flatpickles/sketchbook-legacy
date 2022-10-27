precision highp float;

#pragma glslify: noise = require(glsl-noise/classic/3d) 

uniform float time;
uniform vec2 renderSize;

uniform float goopScale;
uniform float offsetX;
uniform float offsetY;
uniform float noiseEdge;
uniform vec4 bgColor;
uniform vec4 bottomColor;
uniform vec4 topColor;

varying vec2 vUv;

// Color functions: https://www.shadertoy.com/view/XljGzV

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 colorMix(vec3 rgb1, vec3 rgb2, float mixVal) {
    vec3 hsv1 = rgb2hsv(rgb1);
    vec3 hsv2 = rgb2hsv(rgb2);
    vec3 mixed = mix(hsv1, hsv2, mixVal);
    return hsv2rgb(mixed);
}

float TIME_MULT = 0.2;

void main() {
    vec3 BASE_COLOR = bottomColor.rgb;
    vec3 FG_COLOR = topColor.rgb;
    vec3 BG_COLOR = bgColor.rgb;
    vec3 MID_COLOR = colorMix(BASE_COLOR, FG_COLOR, 0.5);

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
    vec3 edge2Component = (1.0 - mask) * (1.0 - offsetMask) * offsetMask2 * BASE_COLOR;
    vec3 edgeComponent = (1.0 - mask) * offsetMask * MID_COLOR;
    vec3 fgComponent = mask * FG_COLOR;

    vec3 compositeColor = bgComponent + edgeComponent + edge2Component + fgComponent;
    gl_FragColor = vec4(compositeColor, 1.0);
}
