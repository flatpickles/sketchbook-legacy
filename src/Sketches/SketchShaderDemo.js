import Sketch from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';

// todo: make this a shader demo

export default class SketchShaderDemo extends Sketch {
    name = "Test Sketch 2";

    params = {
        bignessP: new FloatParam('Bigness %', 20, 0, 100),
        isBlue: new BoolParam('Is Blue', false)
    };
    
    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = this.params.isBlue.value ? '#0000ff' : '#000000';
            context.fillRect(0, 0, width * this.params.bignessP.value / 100, height * this.params.bignessP.value / 100); 
        };
    };
}