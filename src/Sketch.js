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

/// todo separate these!

export class Sketch {
    name = "Unnamed Sketch";
    params = {};
    settings = {
        scaleToView: true,
        dimensions: [ 1280, 1280 ],
        // animate: true,
        // duration: Infinity
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

export class SketchDemo2 extends Sketch {
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
