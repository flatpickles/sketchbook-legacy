/** Imports assume file is contained within Sketches **/

import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './ShaderTemplate.frag';

export default class ShaderTemplate extends Sketch {
    name = "Test Shaders";
    type = SketchType.Shader;
    // date = new Date("9/23/23");

    settings = {
        context: 'webgl',
        scaleToView: true,
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