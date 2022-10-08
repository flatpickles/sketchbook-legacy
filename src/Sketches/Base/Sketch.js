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

    selectedPresetName = undefined;
    availablePresets = {};

    get presetModified() {
        // todo: see if this should be redesigned more efficiently (dirty bit, etc)
        if (!this.selectedPresetName) throw 'Presets not yet available.'

        let modified = false;
        const selectedPreset = this.availablePresets[this.selectedPresetName];
        Object.keys(this.params).forEach((paramName) => {
            if (selectedPreset[paramName] != this.params[paramName].value) {
                modified = true;
            }
        });
        return modified;
    }

    restorePresets() {
        const defaultValuesTitle = 'Default Values';
    
        // Restore currently selected
        const storedSelectedPresetState = localStorage.getItem(this.name + ' currentlySelected');
        this.selectedPresetName = storedSelectedPresetState ?? defaultValuesTitle;

        // Reset available presets
        this.availablePresets = {};

        // Default values as first preset
        let defaultPreset = {};
        Object.keys(this.params).forEach((paramName) => {
            defaultPreset[paramName] = this.params[paramName].defaultValue;
        });
        this.availablePresets[defaultValuesTitle] = defaultPreset;

        // Bundled presets next 
        Object.assign(this.availablePresets, this.presets);

        // Local storage (user presets)
        // Todo

        // console.log(this.availablePresets);
    }

    selectPreset(presetName) {
        // todo: check to make sure it exists? here and/or elsewhere

        // Set selection state
        this.selectedPresetName = presetName;
        localStorage.setItem(this.name + ' currentlySelected', presetName);

        // Set parameter state
        const selectedPreset = this.availablePresets[this.selectedPresetName];
        console.log(this.availablePresets);
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

