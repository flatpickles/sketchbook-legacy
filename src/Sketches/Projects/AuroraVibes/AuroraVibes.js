import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './AuroraVibes.frag';
import presetsObject from './presets.json';

export default class AuroraVibes extends Sketch {
    name = 'Aurora Vibes';
    type = SketchType.GL;
    // date = new Date('10/25/2022');
    description = `
        Wavy foggy subtle vibey aurora sorta thing, if you dig. Seeking dopeness, without being too interesting.
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
        mixMin: new FloatParam('Mix Min', 0.2, 0.0, 1.0),
        mixMax: new FloatParam('Mix Max', 0.4, 0.0, 1.0),
        seedOffset: new FloatParam('Seed Offset', 0.5, 0.0, 10.0),
        timeScale: new FloatParam('Time Scale', 0.2, 0.1, 1.0),
    };

    sketchFn = ({ gl }) => {
        const frag = shaderString;
        let lastFrameTime = Date.now();
        let totalScaledTime = 0;
        return createShader({
            gl,
            frag,
            uniforms: {
                time: ({ time }) => time,
                scaledTime: ({}) => {
                    const curTime = Date.now();
                    const elapsed = lastFrameTime - curTime;
                    lastFrameTime = curTime;
                    totalScaledTime += elapsed * this.params.timeScale.value / 1000.;
                    return totalScaledTime;
                },
                renderSize: ({}) => [window.innerWidth, window.innerHeight],
                mixMin: ({}) => this.params.mixMin.value,
                mixMax: ({}) => this.params.mixMax.value,
                seedOffset: ({}) => this.params.seedOffset.value,
            }
        });
    };
}