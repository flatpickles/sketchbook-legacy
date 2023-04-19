import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './GlamJam.frag';
import presetsObject from './presets.json';

export default class GlamJam extends Sketch {
    name = 'Glam Jam';
    type = SketchType.GL;
    // date = new Date('10/25/2022');
    description = `
        Gaze into the center of the storm. Free your mind, and your ass will follow.
    `;
    showPresets = true;

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true,
        pixelRatio: 2
    };
    bundledPresets = presetsObject;

    params = {
        spin: new FloatParam('Spin Amount', 0, -1.0, 1.0),
        drainSpeed: new FloatParam('Drain Speed', 0.1, -1.0, 1.0),
        noiseAmount: new FloatParam('Noise Amount', 2, 0, 5),
        noiseSpeed: new FloatParam('Noise Speed', 0.2, 0.0, 1.0),
        noiseDensity: new FloatParam('Noise Density', 5, 0, 10),
        noiseCycles: new FloatParam('Noise Cycles', 5, 0, 20, 1.0),
        colorCycles: new FloatParam('Color Cycles', 1, 1, 20, 1),
        rainbow: new BoolParam('Rainbow Colors', true),
        color1: new ColorParam('Color 1', '#FFCB8F'),
        color2: new ColorParam('Color 2', '#1F0075'),
        color3: new ColorParam('Color 3', '#12A566'),
        centerRadius: new FloatParam('Center Radius', 0.2, 0, 1),
        centerColor: new ColorParam('Center Color', '#FFFFFF'),
    };

    sketchFn = ({ gl }) => {
        const frag = shaderString;

        // This allows smooth speed values when changed
        let lastDrainTime = Date.now();
        let lastNoiseTime = Date.now();
        let drainSpeedAcc = 0;
        let noiseSpeedAcc = 0;

        return createShader({
            gl,
            frag,
            uniforms: {
                time: ({ time }) => time,
                renderSize: ({}) => [window.innerWidth, window.innerHeight],
                drainTime: ({}) => {
                    const curTime = Date.now();
                    const elapsed = lastDrainTime - curTime;
                    lastDrainTime = curTime;
                    drainSpeedAcc += elapsed * this.params.drainSpeed.value / 500.;
                    return drainSpeedAcc;
                },
                noiseTime: ({}) => {
                    const curTime = Date.now();
                    const elapsed = lastNoiseTime - curTime;
                    lastNoiseTime = curTime;
                    noiseSpeedAcc += elapsed * this.params.noiseSpeed.value / 1000.;
                    return noiseSpeedAcc;
                },
                spin: ({}) => this.params.spin.value * 3.0,
                colorCycles: ({}) => this.params.colorCycles.value,
                noiseAmount: ({}) => this.params.noiseAmount.value,
                noiseCycles: ({}) => this.params.noiseCycles.value,
                noiseDensity: ({}) => this.params.noiseDensity.value,
                centerRadius: ({}) => this.params.centerRadius.value,
                color1: ({}) => this.params.color1.vec4,
                color2: ({}) => this.params.color2.vec4,
                color3: ({}) => this.params.color3.vec4,
                centerColor: ({}) => this.params.centerColor.vec4,
                rainbow: ({}) => this.params.rainbow.value,
            }
        });
    };
}