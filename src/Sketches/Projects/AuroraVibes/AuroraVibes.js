import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam, BoolParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './AuroraVibes.frag';
import presetsObject from './presets.json';

export default class AuroraVibes extends Sketch {
    name = 'Aurora Vibes';
    type = SketchType.GL;
    date = new Date('2/15/2023');
    experimental = false;
    description = `
        A washy aurora sorta thing, mixing between colors with a series of offset noise functions. Whatever you're looking for, maybe it's in here somewhere.
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
        timeScale: new FloatParam('Time Scale', 0.2, 0.0, 1.0),
        xScale: new FloatParam('X Scale', 1.0, 0.01, 10.0),
        yScale: new FloatParam('Y Scale', 4.0, 0.01, 10.0),
        simplexNoise: new BoolParam('Simplex Noise', true),
        seedOffset: new FloatParam('Noise Offset', 0.3, 0.0, 3.0),
        easing: new FloatParam('Mix Easing', 1.5, 0.01, 10.0),
        baseColor: new ColorParam('Base Color', '#000000'),
        mixMin1: new FloatParam('Mix Min 1', -0.1, -1.0, 1.0),
        mixMax1: new FloatParam('Mix Max 1', 0.9, -1.0, 1.0),
        color1: new ColorParam('Color 1', '#FF0000'),
        mixMin2: new FloatParam('Mix Min 2', -0.4, -1.0, 1.0),
        mixMax2: new FloatParam('Mix Max 2', 0.9, -1.0, 1.0),
        color2: new ColorParam('Color 2', '#00FF00'),
        mixMin3: new FloatParam('Mix Min 3', -0.1, -1.0, 1.0),
        mixMax3: new FloatParam('Mix Max 3', 0.5, -1.0, 1.0),
        color3: new ColorParam('Color 3', '#0000FF'),
    };

    sketchFn = ({ gl }) => {
        const frag = shaderString;
        let lastFrameTime = Date.now();
        let totalScaledTime = 0;
        return createShader({
            gl,
            frag,
            uniforms: {
                renderSize: ({}) => [window.innerWidth, window.innerHeight],
                scaledTime: ({}) => {
                    const curTime = Date.now();
                    const elapsed = lastFrameTime - curTime;
                    lastFrameTime = curTime;
                    totalScaledTime += elapsed * this.params.timeScale.value / 1000.;
                    return totalScaledTime;
                },
                xScale: ({}) => this.params.xScale.value,
                yScale: ({}) => this.params.yScale.value,
                seedOffset: ({}) => this.params.seedOffset.value,
                baseColor: ({}) => this.params.baseColor.vec4,
                color1: ({}) => this.params.color1.vec4,
                mixMin1: ({}) => this.params.mixMin1.value,
                mixMax1: ({}) => this.params.mixMax1.value,
                color2: ({}) => this.params.color2.vec4,
                mixMin2: ({}) => this.params.mixMin2.value,
                mixMax2: ({}) => this.params.mixMax2.value,
                color3: ({}) => this.params.color3.vec4,
                mixMin3: ({}) => this.params.mixMin3.value,
                mixMax3: ({}) => this.params.mixMax3.value,
                easing: ({}) => this.params.easing.value,
                useSimplex: ({}) => this.params.simplexNoise.value,
            }
        });
    };
}