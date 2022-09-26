precision highp float;

uniform float time;
uniform vec2 resolution;

varying vec2 vUv;

const float PI = 3.1415926535897932384626433832795;

const float animationLength = 10.0;
const vec2 zoomBounds = vec2(-1.0, 15.0);

vec3 hsv(float h, float s, float v) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + K.xyz) * 6.0 - K.www);
    return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
}

void main(void) {
    vec2 c = vUv;

    // Normalize coordinates
    c = c * 2. - 1.0;
    c.y *= resolution.y / resolution.x;

    // Zoom in
    float zoomGenerator = 0.35;// (sin(time * ((2. * PI) / animationLength)) + 1.0) / 2.;
    float zoomLevel = (zoomBounds.y - zoomBounds.x) * zoomGenerator + zoomBounds.x;
    c = c / pow(2.0, zoomLevel);
    c += vec2(-0., 0.752);

    // https://en.wikibooks.org/wiki/Fractals/shadertoy#Mandelbrot_set

    vec2 z = vec2(0);
    int escapeTime = 0;
    
    for (int i=0; i<100; i++) {
        if (z.x * z.x + z.y * z.y >= 4.) break;
        z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;
        escapeTime += 1;
    }

    float hue = (0.97 + float(escapeTime)) / 3.;
    gl_FragColor = vec4(hsv(hue, 0.99, 0.9), 1.0);
}
