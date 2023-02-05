precision highp float;

#pragma glslify: noise = require(glsl-noise/classic/4d)
#pragma glslify: blend = require(glsl-blend/add)

uniform float time;
uniform vec2 renderSize;

uniform float mixMin;
uniform float mixMax;
uniform float seedOffset;
uniform float scaledTime;

varying vec2 vUv;

vec3 addLayer(vec3 background, vec3 layerColor, vec2 uv, float seed) {
	float noiseVal = noise(vec4(uv, scaledTime, seed));
	noiseVal = mix(mixMin, mixMax, noiseVal);

	return mix(background, layerColor, noiseVal);
}

void main()	{
	float aspectRatio = float(renderSize.x) / float(renderSize.y);
	vec2 uv = vUv;
	uv = uv * 2.0 - 1.;
	uv.x *= aspectRatio;

	// todo: paramify aspect ratios
	uv.x /= 2.0;
	uv.y *= 4.0;

	vec3 blended = vec3(0.066, 0.163, 0.522);
	// blended = addLayer(blended, vec3(0.066, 0.163, 0.522), uv, 0.0);
	blended = addLayer(blended, vec3(0.1412, 0.3961, 0.8078), uv, seedOffset * 1.0);
	// blended = addLayer(blended, vec3(0.458, 0.336, 0.849), uv, seedOffset * 2.0);
	blended = addLayer(blended, vec3(0.236, 0.058, 0.339), uv, seedOffset * 2.0);
	blended = addLayer(blended, vec3(0.0, 0.0, 0.0), uv, seedOffset * 3.0);
	// blended = addLayer(blended, vec3(0.085, 0.001, 0.471), uv, seedOffset * 4.0);

	gl_FragColor = vec4(blended, 1.0);
}
