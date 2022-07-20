import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';

export default class SketchCanvasDemo2 extends Sketch {
    name = 'Test Sketch 3';
    type = SketchType.Canvas;

    params = {
        bigness: new FloatParam('Bigness', 0.3, 0, 1),
        isRed: new BoolParam('Is Red', true)
    };
    
    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = this.params.isRed.value ? '#ff0000' : '#000000';
            context.fillRect(0, 0, width * this.params.bigness.value, height * this.params.bigness.value);
        };
    };
}
