precision highp float;

#pragma glslify: noise = require(glsl-noise/classic/4d)
#pragma glslify: blend = require(glsl-blend/add)

uniform float time;
uniform vec2 renderSize;

uniform float demoFloat;
uniform vec4 demoColor;

varying vec2 vUv;

vec3 addLayer(vec3 background, vec3 layerColor, vec2 uv, float seed) {
	// todo: make speed a param
	float t = time * 0.2;

	float noiseVal = noise(vec4(uv, t, seed));
	noiseVal = mix(0.1, 0.7, noiseVal);

	vec3 layer = layerColor * noiseVal;
	return blend(background, layer);
}

void main()	{
	float aspectRatio = float(renderSize.x) / float(renderSize.y);
	vec2 uv = vUv;
	uv = uv * 2.0 - 1.;
	uv.x *= aspectRatio;

	// todo: paramify aspect ratios
	uv.x /= 2.0;
	uv.y *= 4.0;

	float seedIncrement = 0.5;
	vec3 blended = vec3(0.038, 0.0, 0.304);
	blended = addLayer(blended, vec3(0.066, 0.163, 0.522), uv, 0.0);
	blended = addLayer(blended, vec3(0.1412, 0.3961, 0.8078), uv, seedIncrement * 1.0);
	blended = addLayer(blended, vec3(0.458, 0.336, 0.849), uv, seedIncrement * 2.0);
	blended = addLayer(blended, vec3(0.236, 0.058, 0.339), uv, seedIncrement * 3.0);
	blended = addLayer(blended, vec3(0.085, 0.001, 0.471), uv, seedIncrement * 4.0);

	gl_FragColor = vec4(blended, 1.0);
}
