import Sketch from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';

import createShader from  'canvas-sketch-util/shader';
// todo: make this a shader demo

export default class SketchShaderDemo extends Sketch {
    name = "Test Sketch 2";

    settings = {
        dimensions: [ 512, 512 ],
        context: 'webgl',
        animate: true
    };

    params = {
        blueness: new FloatParam("Blueness", 0.0, 0.0, 1.0)
    };


    
    sketchFn = ({ gl }) => {
        const frag = `
            precision highp float;

            uniform float time;
            uniform float blueness;
            varying vec2 vUv;

            void main () {
            float anim = sin(time) * 0.5 + 0.5;
            gl_FragColor = vec4(vec2(vUv.x * anim), blueness,  1.0);
            }
        `;
        // Create the shader and return it. It will be rendered by regl.
        return createShader({
          // Pass along WebGL context
          gl,
          // Specify fragment and/or vertex shader strings
          frag,
          // Specify additional uniforms to pass down to the shaders
          uniforms: {
            // Expose props from canvas-sketch
            time: ({ time }) => time,
            blueness: ({}) => this.params.blueness.value
          }
        });
      };
}