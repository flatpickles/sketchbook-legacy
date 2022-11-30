/** Imports assume file is contained within Sketches **/

import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './index.frag';
import presetsObject from './presets.json';

export default class Mandelbrot extends Sketch {
    name = "Mandelbrot Set";
    type = SketchType.GL;
    date = new Date("9/29/22");
    experimental = false;
    description = `
        Standard Mandelbrot fare, with basic navigation and a little bit extra. Look, a rainbow! 
    `
    bundledPresets = presetsObject;

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true,
        pixelRatio: 2
    };

    params = {
        zoom: new FloatParam('Zoom', 0.07, 0, 1, 0.001),
        xOffset: new FloatParam('X Offset', -0.7, -1, 1, 0.001),
        yOffset: new FloatParam('Y Offset', 0.0, -1, 1, 0.001),
        colorCycles: new FloatParam('Color Cycles', 42, 1, 100),
    };

    sketchFn = ({ gl }) => {
        const frag = shaderString;
        return createShader({
            gl,
            frag,
            uniforms: {
                time: ({ time }) => time,
                resolution: ({}) => [window.innerWidth, window.innerHeight],
                zoom: () => this.params.zoom.value,
                renderOffset: () => [this.params.xOffset.value, this.params.yOffset.value],
                colorCycles: () => this.params.colorCycles.value,
            }
        });
    };
}
