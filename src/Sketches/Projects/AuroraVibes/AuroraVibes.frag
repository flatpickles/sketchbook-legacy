precision highp float;

#pragma glslify: noise = require(glsl-noise/simplex/3d)

uniform vec2 renderSize;
uniform float seedOffset;
uniform float scaledTime;
uniform float xScale;
uniform float yScale;
uniform float easing;

uniform vec4 baseColor;
uniform vec4 color1;
uniform float mixMin1;
uniform float mixMax1;
uniform vec4 color2;
uniform float mixMin2;
uniform float mixMax2;
uniform vec4 color3;
uniform float mixMin3;
uniform float mixMax3;

varying vec2 vUv;


// Sigmoid easing adapted from:
// https://medium.com/hackernoon/ease-in-out-the-sigmoid-factory-c5116d8abce9

float sigmoidBase(float t, float k) {
	return (1.0 / (1.0 + exp(-k * t))) - 0.5;
}

float sigmoidEasing(float t, float k) {
	float correction = 0.5 / sigmoidBase(1.0, k);
	return correction * sigmoidBase(2.0 * t - 1.0, k) + 0.5;
}

// Mix in a new layerColor over background; mix value is noise, scaled between mixMin & mixMax
vec3 addLayer(vec3 background, vec3 layerColor, vec2 uv, float seed, float mixMin, float mixMax) {
	float noiseVal = (noise(vec3(uv, seed)) + 1.0) / 2.0; // within [0, 1] for easing
	noiseVal = sigmoidEasing(noiseVal, easing);
	noiseVal = noiseVal * 2.0 - 1.0; // back to [-1, 1] - todo
	noiseVal = mix(mixMin, mixMax, noiseVal);
	return mix(background, layerColor, noiseVal);
}

void main()	{
	// Scale the coordinate space
	float aspectRatio = float(renderSize.x) / float(renderSize.y);
	vec2 uv = vUv;
	uv = uv * 2.0 - 1.;
	uv.x *= aspectRatio;
	uv.x *= xScale;
	uv.y *= yScale;

	// Create the blended final color
	vec3 blended = baseColor.rgb;
	blended = addLayer(blended, color1.rgb, uv, scaledTime + seedOffset * 0.0, mixMin1, mixMax1);
	blended = addLayer(blended, color2.rgb, uv, scaledTime + seedOffset * 1.0, mixMin2, mixMax2);
	blended = addLayer(blended, color3.rgb, uv, scaledTime + seedOffset * 2.0, mixMin3, mixMax3);
	gl_FragColor = vec4(blended, 1.0);
}
