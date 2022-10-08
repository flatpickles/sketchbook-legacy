export const SketchType = {
    Undefined: 'Undefined',
    Canvas: 'Canvas',
    Shader: 'Shader'
}

export default class Sketch {
    /* Defaults to be overridden by subclass */

    name = 'Unnamed Sketch';
    type = SketchType.Undefined;
    date = undefined; // "Work in Progress" until date is defined
    description = undefined;
    params = {};
    settings = {};
    presets = {};
    showPresets = true;

    /* Param value state */

    storeParamValues() {
        Object.values(this.params).map((param) => {
            param.storeValue(this.name);
        });
    }

    restoreParamValues() {
        Object.values(this.params).map((param) => {
            param.restoreValue(this.name);
        });   
    }

    /* Presets */

    selectedPresetIndex = -1;
    availablePresets = {};

    get presetModified() {
        // todo: see if this should be redesigned more efficiently (dirty bit, etc)
        if (selectedPresetIndex < 0) throw 'Presets not yet available.'

        let modified = false;
        const selectedPreset = this.availablePresets[selectedPresetIndex];
        Object.keys(this.params).forEach((paramName) => {
            if (selectedPreset[paramName] != this.params[paramName].value) {
                modified = true;
            }
        });
        return modified;
    }

    restorePresets() {
        // Restore currently selected
        const storedSelectedPresetState = localStorage.getItem(this.name + ' currentlySelected');
        this.selectedPresetIndex = storedSelectedPresetState ? JSON.parse(storedSelectedPresetState) : 0;

        // Reset available presets
        this.availablePresets = {};

        // Default values as first preset
        let defaultPreset = {};
        Object.keys(this.params).forEach((paramName) => {
            defaultPreset[paramName] = this.params[paramName].defaultValue;
        });
        this.availablePresets['Default Values'] = defaultPreset;

        // Bundled presets next 
        Object.assign(this.availablePresets, this.presets);

        // Local storage (user presets)
        // Todo

        console.log(this.availablePresets);
    }

    selectPreset(index) {
        // Set selection state
        this.selectedPresetIndex = index;
        localStorage.setItem(this.name + ' currentlySelected', JSON.stringify(index));

        // Set parameter state
        const selectedPreset = this.availablePresets[selectedPresetIndex];
        Object.keys(this.params).forEach((paramName) => {
            this.params[paramName].value = selectedPreset[paramName];
        });
    }

    savePreset() {
        // Todo: add to data model + local storage
    }

    exportPreset() {
        // Todo save a file w/ current param values
        const presetObj = {};
        Object.keys(this.params).forEach((paramName) => {
            presetObj[paramName] = this.params[paramName].value;
        });
        console.log(JSON.stringify(presetObj));
    }

    /* Dummy sketch function */

    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, width, height);
        }
    };
}

