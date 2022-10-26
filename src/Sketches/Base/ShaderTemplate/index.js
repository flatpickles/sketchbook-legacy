import Sketch, { SketchType } from '../Sketch.js';
import { FloatParam, ColorParam } from '../SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './index.frag';
import presetsObject from './presets.json';

export default class ShaderTemplate extends Sketch {
    name = 'Shader Template';
    type = SketchType.Shader;
    // date = new Date('10/25/2022');
    description = `
        This is a demo shader sketch that can be used as a starting point.
    `;
    showPresets = false;

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true
    };
    bundledPresets = presetsObject;

    params = {
        demoFloat: new FloatParam('Demo Float', 0.5, 0.0, 1.0),
        demoColor: new ColorParam('Demo Color', '#00FF00'),
    };

    sketchFn = ({ gl }) => {
        const frag = shaderString;
        return createShader({
            gl,
            frag,
            uniforms: {
                time: ({ time }) => time,
                renderSize: ({}) => [window.innerWidth, window.innerHeight],
                demoFloat: ({}) => this.params.demoFloat.value,
                demoColor: ({}) => this.params.demoColor.vec4,
            }
        });
    };
}