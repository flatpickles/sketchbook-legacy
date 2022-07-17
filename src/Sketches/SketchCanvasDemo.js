import Sketch from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';

export default class SketchCanvasDemo extends Sketch {
    name = 'Test Sketch 1';

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
