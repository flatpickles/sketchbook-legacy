precision highp float;

uniform float time;
uniform vec2 resolution;

uniform float zoom;
uniform vec2 renderOffset;

varying vec2 vUv;

const float PI = 3.1415926535897932384626433832795;

const float animationLength = 10.0;
const vec2 zoomBounds = vec2(-1.0, 15.0);

vec3 hsv(float h, float s, float v) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + K.xyz) * 6.0 - K.www);
    return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
}

// References:
// - https://en.wikibooks.org/wiki/Fractals/shadertoy#Mandelbrot_set
// - https://www.codingame.com/playgrounds/2358/how-to-plot-the-mandelbrot-set/adding-some-colors
float mandelbrot(vec2 c) {
    const int maxIter = 100;

    vec2 z = vec2(0.0);
    int escapeTime = 0;
    float absZ = 0.0;
    for (int i = 0; i < maxIter; i++) {
        absZ = sqrt(z.x * z.x + z.y * z.y);
        if (absZ >= 2.) break;
        z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;
        escapeTime += 1;
    }

    if (escapeTime == maxIter) {
        return float(maxIter);
    } else {
        return float(escapeTime) + 1.0 - log(log2(absZ));
    }
}

void main(void) {
    vec2 c = vUv;

    // Normalize coordinates
    c = c * 2. - 1.0;
    c.y *= resolution.y / resolution.x;

    // Zoom in
    float zoomGenerator = zoom;// 0.35;// (sin(time * ((2. * PI) / animationLength)) + 1.0) / 2.;
    float zoomLevel = (zoomBounds.y - zoomBounds.x) * zoomGenerator + zoomBounds.x;
    c = c / pow(2.0, zoomLevel);
    c += renderOffset;

    // Calculate Mandelbrot color
    float escapeTime = mandelbrot(c);
    float hue = (0.97 + float(escapeTime)) / 3.;
    gl_FragColor = vec4(vec3(fract(escapeTime)), 1.0);
}
