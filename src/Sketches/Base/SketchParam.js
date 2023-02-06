import Color from 'canvas-sketch-util/color';

export class SketchParam {
    constructor(name, defaultValue, description = undefined) {
        this.name = name;
        this.value = defaultValue;
        this.defaultValue = defaultValue;
        this.description = description;
    }

    storeValue(parentKey) {
        localStorage.setItem(parentKey + ' ' + this.name, JSON.stringify(this.value));
    }

    restoreValue(parentKey) {
        try {
            const storedString = localStorage.getItem(parentKey + ' ' + this.name);
            if (storedString) {
                this.value = JSON.parse(storedString);
            }
        } catch (e) {
            console.log(e.message);
        }
    }
}

export class EventParam extends SketchParam {
    // EventParam values (functions) are always defined within the Sketch
    storeValue() {}
    restoreValue() {}
}

export class ColorParam extends SketchParam {
    get vec4() {
        const rgba = Color.parse(this.value).rgba;
        return [rgba[0]/255, rgba[1]/255, rgba[2]/255, rgba[3]];
    }
}

export class BoolParam extends SketchParam {
}

export class FloatParam extends SketchParam {
    constructor(name, defaultValue, minValue, maxValue, stepValue = 0.01, continuousUpdate = true, description = undefined) {
        super(name, defaultValue, description);
        this.min = minValue;
        this.max = maxValue;
        this.step = stepValue;
        this.continuousUpdate = continuousUpdate;
    }
}
