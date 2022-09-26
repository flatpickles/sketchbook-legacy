/** Imports assume file is contained within Sketches **/

import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './Mandelbrot.frag';

export default class Mandelbrot extends Sketch {
    name = "Mandelbrot";
    type = SketchType.Shader;
    // date = new Date("9/23/23");
    description = `
        Mandelbrot set sandbox, building off of a project from June 2022.
    `

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true
    };

    params = {
    };

    sketchFn = ({ gl }) => {
        const frag = shaderString;
        return createShader({
            gl,
            frag,
            uniforms: {
                time: ({ time }) => time,
                resolution: ({}) => [window.innerWidth, window.innerHeight]
            }
        });
    };
}