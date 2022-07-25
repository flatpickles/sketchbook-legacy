import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './SketchShaderDemo.frag';

export default class SketchShaderDemo extends Sketch {
    name = "Test Shader Sketch";
    type = SketchType.Shader;

    settings = {
        dimensions: [ 512, 512 ],
        context: 'webgl',
        animate: true
    };

    params = {
        blueness: new FloatParam("Blueness", 0.0, 0.0, 1.0)
    };

    sketchFn = ({ gl }) => {
        const frag = shaderString;
        return createShader({
          gl,
          frag,
          uniforms: {
            time: ({ time }) => time,
            blueness: ({}) => this.params.blueness.value
          }
        });
      };
}