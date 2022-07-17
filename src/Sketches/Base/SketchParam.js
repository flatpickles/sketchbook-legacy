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
    // todo: step property -> UI
    constructor(name, defaultValue, minValue, maxValue) {
        super(name, defaultValue);
        this.min = minValue;
        this.max = maxValue;
    }
}
