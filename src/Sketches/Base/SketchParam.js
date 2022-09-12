export class SketchParam {
    constructor(name, defaultValue) {
        this.name = name;
        this.value = defaultValue;
    }

    storeValue(parentKey) {
        localStorage.setItem(parentKey + ' ' + this.name, JSON.stringify(this.value));
    }

    restoreValue(parentKey) {
        const storedString = localStorage.getItem(parentKey + ' ' + this.name);
        if (storedString) {
            this.value = JSON.parse(storedString);
        }
    }
}

export class EventParam extends SketchParam {
    // EventParam values (functions) are always defined within the Sketch
    storeValue() {}
    restoreValue() {}
}

export class ColorParam extends SketchParam {
}

export class BoolParam extends SketchParam {
}

export class FloatParam extends SketchParam {
    constructor(name, defaultValue, minValue, maxValue, stepValue = 0.01, continuousUpdate = true) {
        super(name, defaultValue);
        this.min = minValue;
        this.max = maxValue;
        this.step = stepValue;
        this.continuousUpdate = continuousUpdate;
    }
}
