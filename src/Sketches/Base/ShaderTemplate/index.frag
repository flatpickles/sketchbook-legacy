precision highp float;

uniform float time;
uniform vec2 renderSize;

uniform float demoFloat;
uniform vec4 demoColor;

varying vec2 vUv;

void main()	{
	float aspectRatio = float(renderSize.x) / float(renderSize.y);
	vec2 uv = vUv;
	uv = uv * 2.0 - 1.;
	uv.x *= aspectRatio;

    float r = sqrt(uv.x * uv.x + uv.y * uv.y);
    float theta = atan(uv.y, uv.x);

    vec4 color = mix(vec4(0), demoColor, step(r, demoFloat));
	gl_FragColor = color;
}
