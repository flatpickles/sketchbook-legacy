import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './__name__.frag';
import presetsObject from './presets.json';

export default class __name__ extends Sketch {
    name = '__name__(noCase)';
    type = SketchType.GL;
    // date = new Date('10/25/2022');
    description = `
        This is a shader-based sketch.
    `;
    showPresets = false;

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true,
        pixelRatio: 2
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