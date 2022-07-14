export class SketchParam {
    constructor(name, defaultValue) {
        this.name = name;
        this.value = defaultValue;
    }
}

export class ColorParam extends SketchParam {
}

export class BoolParam extends SketchParam {
}

export class FloatParam extends SketchParam {
    constructor(name, defaultValue, minValue, maxValue) {
        super(name, defaultValue);
        this.min = minValue;
        this.max = maxValue;
    }
}

export class Sketch {
    name = "Unnamed Sketch";
    params = {};
    settings = {
        scaleToView: true,
        dimensions: [ 1280, 1280 ]
    };
    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, width, height);
        }
    };
}

export class SketchDemo1 extends Sketch {
    name = "Test Sketch 1";

    params = {
        bigness: new FloatParam('Bigness', 0, 0, 1),
        isGreen: new BoolParam('Is Green', true)
    };
    
    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = this.params.isGreen.value ? '#00ff00' : 'ffffff';
            context.fillRect(0, 0, width * this.params.bigness.value, this.params.bigness.value); 
        };
    };
}

export class SketchDemo2 extends Sketch {
    name = "Test Sketch 2";

    params = {
        bignessP: new FloatParam('Bigness %', 0, 0, 100),
        isBlue: new BoolParam('Is Blue', true)
    };
    
    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = this.params.Blue.value ? '#0000ff' : 'ffffff';
            context.fillRect(0, 0, width * this.params.bignessP.value / 100, this.params.bignessP.value / 100); 
        };
    };
}
