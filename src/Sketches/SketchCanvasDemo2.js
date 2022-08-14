import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';

export default class SketchCanvasDemo2 extends Sketch {
    name = 'Test 3';
    type = SketchType.Canvas;
    date = new Date("12/4/2021");
    description = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        
        Fusce eleifend massa a dolor viverra, et varius nisi molestie. Duis finibus porttitor erat, et hendrerit mi rhoncus quis. Integer ut pellentesque massa.
        
        Ut venenatis sapien quis nisl dignissim, nec sodales est posuere. Pellentesque congue porta mi, vitae rutrum diam volutpat in. Aenean libero orci, placerat ac scelerisque in, posuere sed libero.
    `;
    params = {
        bigness: new FloatParam('Bigness', 0.3, 0, 1),
        isRed: new BoolParam('Is Red', true)
    };

    settings = {
        scaleToView: true,
    }
    
    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = this.params.isRed.value ? '#ff0000' : '#000000';
            context.fillRect(0, 0, width * this.params.bigness.value, height * this.params.bigness.value);
        };
    };
}
