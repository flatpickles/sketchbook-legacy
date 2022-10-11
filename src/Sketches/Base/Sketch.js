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

    presetModified = false;
    updatePresetModified() {
        if (!this.selectedPresetName) throw 'Presets not yet available.'

        this.presetModified = false;
        const selectedPreset = this.availablePresets[this.selectedPresetName];
        const paramNames = Object.keys(this.params);
        for (let paramIndex = 0; paramIndex < paramNames.length; paramIndex++) {
            const paramName = paramNames[paramIndex];
            if (selectedPreset[paramName] != this.params[paramName].value) {
                this.presetModified = true;
                return;
            }
        }
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

        this.updatePresetModified();
    }

    selectPreset(presetName) {
        // todo: check to make sure it exists? here and/or elsewhere

        // Set selection state
        this.selectedPresetName = presetName;
        localStorage.setItem(this.name + ' currentlySelected', presetName);

        // Set parameter state
        const selectedPreset = this.availablePresets[this.selectedPresetName];
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

    importPreset() {
        throw 'Import not yet enabled.'
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

