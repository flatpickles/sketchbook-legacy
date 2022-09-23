precision highp float;

uniform float time;
uniform vec2 renderSize;

uniform float innerSize;
uniform float outerSize;
uniform float wobbleShape1;
uniform float wobbleFactor1;
uniform float wobbleShape2;
uniform float wobbleFactor2;
uniform vec4 centerColor;
uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;
uniform vec4 backgroundColor;

varying vec2 vUv;

const float smoothing = 0.005;
const int layerCount = 12;
const int colorCount = 3;
const float wobbleMotion1 = 1.0;
const float wobbleMotion2 = -1.0;

float incrementalMask(float r, float theta, float threshold) {
    float borderOffset1 = sin(theta * floor(wobbleShape1) + wobbleMotion1 * time) * wobbleFactor1;
    float borderOffset2 = sin(theta * floor(wobbleShape2) + wobbleMotion2 * time) * wobbleFactor2;
    float border = threshold + borderOffset1 + borderOffset2;
    return smoothstep(border + smoothing / 2., border - smoothing / 2., r);
}

vec4 blend(vec4 top, vec4 bottom) {
    return vec4(mix(bottom.rgb, top.rgb, top.a), bottom.a);
}

void main()	{
	float aspectRatio = float(renderSize.x) / float(renderSize.y);
	vec2 uv = vUv;
	uv = uv * 2.0 - 1.;
	uv.x *= aspectRatio;

    float r = sqrt(uv.x * uv.x + uv.y * uv.y);
    float theta = atan(uv.y, uv.x);

    vec4 color = backgroundColor;
    for (int layer = layerCount; layer >= 0; layer -= 1) {
        float layerSize = (outerSize - innerSize) / float(layerCount);
        float mask = incrementalMask(r, theta, float(layer) * layerSize + innerSize);
        int layerDegree = int(mod(float(layer), float(colorCount)));
        vec3 currentColor = (layerDegree == 0) ? color3.rgb : ((layerDegree == 1) ? color1.rgb : color2.rgb);
        currentColor = (layer == 0) ? centerColor.rgb : currentColor;
        color = blend(vec4(currentColor, mask), color);
    }
	
	gl_FragColor = color;
}
