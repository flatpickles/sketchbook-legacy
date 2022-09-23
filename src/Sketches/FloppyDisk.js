/** Imports assume file is contained within Sketches **/

import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, ColorParam } from './Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './FloppyDisk.frag';

export default class FloppyDisk extends Sketch {
    name = 'Floppy Disk';
    type = SketchType.Shader;
    // date = new Date('9/23/23');

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true
    };

    params = {
        innerSize: new FloatParam('Inner Size', 0.3, 0.0, 1.0),
        outerSize: new FloatParam('Outer Size', 0.8, 0.0, 1.0),
        wobbleShape1: new FloatParam('Shape 1', 5.0, 3.0, 10.0),
        wobbleFactor1: new FloatParam('Factor 1', 0.02, 0.0, 0.2),
        wobbleShape2: new FloatParam('Shape 2', 5.0, 3.0, 10.0),
        wobbleFactor2: new FloatParam('Factor 2', 0.02, 0.0, 0.2),
        centerColor: new ColorParam('Center Color', '#431F0E'),
        color1: new ColorParam('Color 1', '#CC8154'),
        color2: new ColorParam('Color 2', '#96542E'),
        color3: new ColorParam('Color 3', '#622E0F'),
        backgroundColor: new ColorParam('BG Color', '#431F0E'),
    };

    sketchFn = ({ gl }) => {
        const frag = shaderString;
        return createShader({
            gl,
            frag,
            uniforms: {
                time: ({ time }) => time,
                renderSize: ({}) => [window.innerWidth, window.innerHeight],
                innerSize: ({}) => this.params.innerSize.value,
                outerSize: ({}) => this.params.outerSize.value,
                wobbleShape1: ({}) => this.params.wobbleShape1.value,
                wobbleFactor1: ({}) => this.params.wobbleFactor1.value,
                wobbleShape2: ({}) => this.params.wobbleShape2.value,
                wobbleFactor2: ({}) => this.params.wobbleFactor2.value,
                centerColor: ({}) => this.params.centerColor.vec4,
                color1: ({}) => this.params.color1.vec4,
                color2: ({}) => this.params.color2.vec4,
                color3: ({}) => this.params.color3.vec4,
                backgroundColor: ({}) => this.params.backgroundColor.vec4
            }
        });
    };
}