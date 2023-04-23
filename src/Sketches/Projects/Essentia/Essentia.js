import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './Essentia.frag';
import presetsObject from './presets.json';

// Copy/pasted from an export...
const defaultPreset = {
    'spin': -0.2,
    'drainSpeed': 0.2,
    'noiseAmount': 0.15,
    'noiseSpeed': 0.2,
    'noiseDensity': 0.7,
    'noiseCycles': 5,
    'colorCycles': 7,
    'rainbow': false,
    'color1': '#a7edfb',
    'color2': '#000E75',
    'color3': '#D77B65',
    'centerColor': '#a7edfb',
    'centerRadius': 0.2
};

export default class Essentia extends Sketch {
    name = 'Essentia';
    type = SketchType.GL;
    date = new Date('4/23/2023');
    experimental = false;
    description = `
        Colorful chaos via polar math and noise functions, as if it were meant to be. Emissions of a mind unwinding, meandering ever closer to the source.
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
        spin: new FloatParam('Spin Amount', defaultPreset.spin, -1.0, 1.0),
        drainSpeed: new FloatParam('Drain Speed', defaultPreset.drainSpeed, -1.0, 1.0),
        noiseAmount: new FloatParam('Noise Amount', defaultPreset.noiseAmount, 0, 1.0),
        noiseSpeed: new FloatParam('Noise Speed', defaultPreset.noiseSpeed, 0.0, 1.0),
        noiseDensity: new FloatParam('Noise Density', defaultPreset.noiseDensity, 0.0, 1.0),
        noiseCycles: new FloatParam('Noise Cycles', defaultPreset.noiseCycles, 0, 20, 1),
        colorCycles: new FloatParam('Color Cycles', defaultPreset.colorCycles, 1, 20, 1),
        rainbow: new BoolParam('Rainbow Mode', defaultPreset.rainbow),
        color1: new ColorParam('Color 1', defaultPreset.color1),
        color2: new ColorParam('Color 2', defaultPreset.color2),
        color3: new ColorParam('Color 3', defaultPreset.color3),
        centerColor: new ColorParam('Center Color', defaultPreset.centerColor),
        centerRadius: new FloatParam('Center Spread', defaultPreset.centerRadius, 0, 1),
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
                spin: ({}) => this.params.spin.value,
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