precision highp float;

#pragma glslify: noise = require(glsl-noise/classic/4d)
#pragma glslify: blend = require(glsl-blend/add)

uniform vec2 renderSize;
uniform float seedOffset;
uniform float scaledTime;

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

vec3 addLayer(vec3 background, vec3 layerColor, vec2 uv, float seed, float mixMin, float mixMax) {
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

	vec3 blended = baseColor.rgb;
	blended = addLayer(blended, color1.rgb, uv, 0.0, mixMin1, mixMax1);
	blended = addLayer(blended, color2.rgb, uv, seedOffset * 1.0, mixMin2, mixMax2);
	blended = addLayer(blended, color3.rgb, uv, seedOffset * 2.0, mixMin3, mixMax3);

	// blended = addLayer(blended, vec3(0.066, 0.163, 0.522), uv, 0.0);
	// vec3(0.1412, 0.3961, 0.8078)
	// blended = addLayer(blended, vec3(0.458, 0.336, 0.849), uv, seedOffset * 2.0);
	// vec3(0.236, 0.058, 0.339)
	// blended = addLayer(blended, vec3(0.085, 0.001, 0.471), uv, seedOffset * 4.0);

	gl_FragColor = vec4(blended, 1.0);
}
