precision highp float;

uniform float time;
uniform vec2 renderSize;

uniform float spin;
uniform float drainTime;
uniform float noiseTime;
uniform float colorCycles;
uniform float noiseAmount;
uniform float noiseDensity;
uniform float noiseCycles;
uniform float centerRadius;
uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;
uniform vec4 centerColor;
uniform bool rainbow;

varying vec2 vUv;

#define PI 3.1415926538

#pragma glslify: simplexNoise = require(glsl-noise/simplex/3d)
#pragma glslify: classicNoise = require(glsl-noise/classic/3d)
#pragma glslify: ease = require(glsl-easings/quadratic-out)

// HSV to RGB adapted from:
// https://gist.github.com/983/e170a24ae8eba2cd174f

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Sigmoid easing adapted from:
// https://medium.com/hackernoon/ease-in-out-the-sigmoid-factory-c5116d8abce9

float sigmoidBase(float t, float k) {
	return (1.0 / (1.0 + exp(-k * t))) - 0.5;
}

float sigmoidEasing(float t, float k) {
	float correction = 0.5 / sigmoidBase(1.0, k);
	return correction * sigmoidBase(2.0 * t - 1.0, k) + 0.5;
}

void main()	{
    // Coordinate system conversion
	float aspectRatio = float(renderSize.x) / float(renderSize.y);
	vec2 uv = vUv;
	uv = uv * 2.0 - 1.;
	uv.x *= aspectRatio;

    // Polar coordinates (with spin)
    float r = sqrt(uv.x * uv.x + uv.y * uv.y);
    float theta = atan(uv.y, uv.x) + r * spin;

    // Noise calculations
    float timeSeed = noiseTime;
    float thetaSeed = sin(theta * noiseCycles);
    float rSeed = r * noiseDensity + drainTime;
    vec3 noiseSeed = vec3(timeSeed, thetaSeed, rSeed);
    float noise = noiseAmount * classicNoise(noiseSeed);

    // Color calculations
    float colorTheta = mod(theta * colorCycles + noise, 2.0 * PI);
    float color1Mask = step(0.0, colorTheta) * step(colorTheta, 2.0 * PI / 3.0);
    float color2Mask = step(2.0 * PI / 3.0, colorTheta) * step(colorTheta, 4.0 * PI / 3.0);
    float color3Mask = step(4.0 * PI / 3.0, colorTheta) * step(colorTheta, 2.0 * PI);
    vec4 color123 = color1Mask * color1 + color2Mask * color2 + color3Mask * color3;

    // Rainbow calculations
    float rainbowTheta = noise + theta * colorCycles / PI / 2.0;
    vec3 colorRainbow = hsv2rgb(vec3(rainbowTheta, 1.0, 1.0));

    // Center calculations
    float centerMixVal = smoothstep(0.0, centerRadius, r);
    centerMixVal = ease(centerMixVal);

    // Final color
    vec4 finalColor = rainbow ? vec4(colorRainbow, 1.0) : color123;
    vec4 colorWithCenter = mix(centerColor, finalColor, centerMixVal);
	gl_FragColor = colorWithCenter;
}
