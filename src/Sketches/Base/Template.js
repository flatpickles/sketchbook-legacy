/** Imports assume file is contained within Sketches **/

import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';

export default class SketchTemplate extends Sketch {
    name = 'Sketch Name';
    type = SketchType.Canvas;
    date = new Date("8/15/2022");
    description = `
        Include a multiline description here, or leave it empty.
    `;

    params = {
        bigness: new FloatParam('Bigness', 0.7, 0, 1),
        isGreen: new BoolParam('Is Green', true)
    };
    
    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = this.params.isGreen.value ? '#00ff00' : '#000000';
            context.fillRect(0, 0, width * this.params.bigness.value, height * this.params.bigness.value);
        };
    };
}