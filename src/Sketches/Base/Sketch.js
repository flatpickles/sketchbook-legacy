import { fileSave } from 'browser-fs-access'

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
    bundledPresets = {};
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
    defaultPreset = undefined;
    userPresets = undefined;

    get presets() {
        if (!this.defaultPreset || !this.userPresets) {
            throw 'restorePresets must be called before accessing presets.';
        }

        let allPresets = {'Default Values': this.defaultPreset};
        Object.assign(allPresets, this.bundledPresets, this.userPresets);
        return allPresets;
    };

    restorePresets() {
        // Restore currently selected state
        const storedSelectedPresetState = localStorage.getItem(this.name + ' currentlySelected');
        this.selectedPresetName = storedSelectedPresetState;

        // Default values as first preset
        this.defaultPreset = {};
        Object.keys(this.params).forEach((paramName) => {
            this.defaultPreset[paramName] = this.params[paramName].defaultValue;
        });

        // Local storage (user presets)
        const storedUserPresetState = localStorage.getItem(this.name + ' userPresets');
        this.userPresets = storedUserPresetState ? JSON.parse(storedUserPresetState) : {};

        // Select default if selectedPresetName is invalid
        const allPresetNames = Object.keys(this.presets);
        if (!this.selectedPresetName || !allPresetNames.includes(this.selectedPresetName)) {
            this.selectedPresetName = allPresetNames[0];
        }

        // Update modified state bit
        this.updatePresetModified();
    }

    presetModified = false;
    updatePresetModified() {
        if (!this.selectedPresetName) throw 'Presets not yet available.'

        this.presetModified = false;
        const selectedPreset = this.presets[this.selectedPresetName];
        const paramNames = Object.keys(this.params);
        for (let paramIndex = 0; paramIndex < paramNames.length; paramIndex++) {
            const paramName = paramNames[paramIndex];
            if (selectedPreset[paramName] != this.params[paramName].value) {
                this.presetModified = true;
                return;
            }
        }
    }

    selectPreset(presetName) {
        // Check if the preset exists - shouldn't happen
        if (!Object.keys(this.presets).includes(presetName)) {
            console.warn(presetName + ' is not a valid preset name.');
            return;
        }

        // Set selection state
        this.selectedPresetName = presetName;
        localStorage.setItem(this.name + ' currentlySelected', presetName);

        // Set parameter state
        const selectedPreset = this.presets[this.selectedPresetName];
        Object.keys(this.params).forEach((paramName) => {
            this.params[paramName].value = selectedPreset[paramName];
        });
    }

    createPreset() {
        const currentPresetNames = Object.keys(this.userPresets);
        const defaultName = 'User Preset ' + (currentPresetNames.length + 1).toString();
        const newPresetName = prompt('New preset name:', defaultName);

        // Return null if canceled or invalid. Todo: appropriate alert(s)
        if (!newPresetName || currentPresetNames.includes(newPresetName)) return null;

        const presetObj = this.currentPresetObject();
        this.userPresets[newPresetName] = presetObj;
        localStorage.setItem(this.name + ' userPresets', JSON.stringify(this.userPresets));
        return newPresetName;
    }

    exportPreset() {
        // Generate backing object for export
        const presetObj = this.currentPresetObject();
        
        // Stringify, blob-ify, and save the backing object
        const objString = JSON.stringify(presetObj, null, 4);
        const objBlob = new Blob([objString], {type: "application/json"});
        fileSave(objBlob, {
            fileName: this.name + ' - ' + this.selectedPresetName,
            extensions: ['.json'],
        }).catch((err) => {
            console.log(err);
        });
    }

    importPreset() {
        throw 'Import not yet enabled.'
    }

    currentPresetObject() {
        const presetObj = {};
        Object.keys(this.params).forEach((paramName) => {
            presetObj[paramName] = this.params[paramName].value;
        });
        return presetObj;
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

