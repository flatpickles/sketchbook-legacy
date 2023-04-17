import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './GlamJam.frag';
import presetsObject from './presets.json';

export default class GlamJam extends Sketch {
    name = 'Glam Jam';
    type = SketchType.GL;
    // date = new Date('10/25/2022');
    description = `
        This is a template project for a shader-based sketch.
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
        drain: new FloatParam('Drain', 1, -10, 10),
        colorCycles: new FloatParam('Color Cycles', 1, 1, 20, 1),
        noiseAmount: new FloatParam('Noise Amount', 2, 0, 5),
        noiseSpeed: new FloatParam('Noise Speed', 0.1, 0, 1),
        noiseCycles: new FloatParam('Noise Cycles', 5, 0, 20, 1.0),
        noiseDensity: new FloatParam('Noise Density', 5, 0, 10),
    };

    sketchFn = ({ gl }) => {
        const frag = shaderString;
        return createShader({
            gl,
            frag,
            uniforms: {
                time: ({ time }) => time,
                renderSize: ({}) => [window.innerWidth, window.innerHeight],
                drain: ({}) => this.params.drain.value,
                colorCycles: ({}) => this.params.colorCycles.value,
                noiseAmount: ({}) => this.params.noiseAmount.value,
                noiseSpeed: ({}) => this.params.noiseSpeed.value,
                noiseCycles: ({}) => this.params.noiseCycles.value,
                noiseDensity: ({}) => this.params.noiseDensity.value,
            }
        });
    };
}