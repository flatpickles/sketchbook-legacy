precision highp float;

uniform float time;
uniform vec2 renderSize;

uniform float drainTime;
uniform float noiseTime;
uniform float colorCycles;
uniform float noiseAmount;
uniform float noiseDensity;
uniform float noiseCycles;

varying vec2 vUv;

#define PI 3.1415926538

#pragma glslify: simplexNoise = require(glsl-noise/simplex/3d)
#pragma glslify: classicNoise = require(glsl-noise/classic/3d)

// https://gist.github.com/983/e170a24ae8eba2cd174f
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()	{
    // Coordinate system conversion
	float aspectRatio = float(renderSize.x) / float(renderSize.y);
	vec2 uv = vUv;
	uv = uv * 2.0 - 1.;
	uv.x *= aspectRatio;

    // Polar coordinates
    float r = sqrt(uv.x * uv.x + uv.y * uv.y);
    float theta = atan(uv.y, uv.x);

    // Noise calculations
    float timeSeed = noiseTime;
    float thetaSeed = sin(theta * noiseCycles);
    float rSeed = r * noiseDensity + drainTime;
    vec3 noiseSeed = vec3(timeSeed, thetaSeed, rSeed);
    float noise = noiseAmount * classicNoise(noiseSeed);

    // Color calculations
    vec3 color = hsv2rgb(vec3(noise + theta * colorCycles / PI / 2.0, 1.0, 1.0));
	gl_FragColor = vec4(color, 1.0);
}
