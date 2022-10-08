/** Imports assume file is contained within Sketches **/

import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './index.frag';

export default class Mandelbrot extends Sketch {
    name = "Mandelbrot Set";
    type = SketchType.Shader;
    date = new Date("9/29/22");
    description = `
        Standard Mandelbrot fare, with basic navigation and a little bit extra. Look, a rainbow! 
    `

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true
    };

    params = {
        zoom: new FloatParam('Zoom', 0.5, 0, 1),
        xOffset: new FloatParam('X Offset', 0.14, -1, 1),
        yOffset: new FloatParam('Y Offset', 0.65, -1, 1),
        colorCycles: new FloatParam('Color Cycles', 8, 1, 100),
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
