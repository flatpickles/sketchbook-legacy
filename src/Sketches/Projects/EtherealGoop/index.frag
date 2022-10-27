precision highp float;

#pragma glslify: noise = require(glsl-noise/classic/3d) 

uniform float time;
uniform vec2 renderSize;

uniform float goopScale;
uniform float offsetX;
uniform float offsetY;
uniform float layerCount;
uniform float noiseEdge;
uniform float edgeTaper;
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
    // todo: rename / distribute these
    vec3 BASE_COLOR = bottomColor.rgb;
    vec3 FG_COLOR = topColor.rgb;
    vec3 BG_COLOR = bgColor.rgb;
    vec3 MID_COLOR = colorMix(BASE_COLOR, FG_COLOR, 0.5);

    // Adjust coordinate space
	float aspectRatio = float(renderSize.x) / float(renderSize.y);
	vec2 st = vUv;
	st = st * 2.0 - 1.;
	st.x *= aspectRatio;
    st *= goopScale;

    // Useful calculations for use within the layering loop
    // int numLayers = 7; // todo: paramify! must match for loop size, for now
    float scaledNoiseEdge = ((1.0 - noiseEdge) * 2.0) - 1.0;
    float mixIncrement = (layerCount > 1.0) ? 1.0 / (layerCount - 1.0) : 0.0;
    float taperIncrement = (layerCount > 1.0) ? edgeTaper / (layerCount - 1.0) : 0.0;
    vec2 offsetIncrement = (layerCount > 1.0) ? vec2(offsetX, offsetY) / (layerCount - 1.0) : vec2(0.0);

    // Calculate and add each layer
    float previousMaskInverse = 1.0;
    vec3 compositeColor = vec3(0.0);
    for (int i = 0; i < 10; i += 1) { // must run to max value for layerCount
        vec3 color = colorMix(FG_COLOR, BASE_COLOR, mixIncrement * float(i));
        vec2 stOffset = st + offsetIncrement * float(i);
        float noiseVal = noise(vec3(time * TIME_MULT, stOffset.x, stOffset.y));
        float mask = step(scaledNoiseEdge + taperIncrement * float(i), noiseVal);

        compositeColor += mask * previousMaskInverse * color;
        previousMaskInverse *= (1.0 - mask);

        if (float(i + 1) >= layerCount) break;
    }

    // Add background color and output
    compositeColor += previousMaskInverse * BG_COLOR;
    gl_FragColor = vec4(compositeColor, 1.0);
}
