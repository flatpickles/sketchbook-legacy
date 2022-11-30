import { fileSave, fileOpen } from 'browser-fs-access'
import { EventParam } from './SketchParam';

export const SketchType = {
    Undefined: 'Undefined',
    Canvas: 'Canvas',
    GL: 'GL'
}

const fileNameDivider = ' - ';

export default class Sketch {
    /* Defaults to be overridden by subclass */

    name = 'Unnamed Sketch';
    type = SketchType.Undefined;
    date = undefined;
    experimental = true;
    description = undefined;
    params = {};
    settings = {};
    bundledPresets = {};
    showPresets = true;
    defaultPresetName = 'Default Values';

    get #userPresetsKey() {
        return this.name + ' userPresets';
    }

    get #currentlySelectedKey() {
        return this.name + ' currentlySelected';
    }

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

    /* Dummy sketch function */

    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, width, height);
        }
    };

    /* Presets */

    selectedPresetName = undefined;
    defaultPreset = undefined;
    userPresets = undefined;

    get presets() {
        if (!this.defaultPreset || !this.userPresets) {
            throw 'restorePresets must be called before accessing presets.';
        }

        let allPresets = { [this.defaultPresetName]: this.defaultPreset };
        Object.assign(allPresets, this.bundledPresets, this.userPresets);
        return allPresets;
    };

    get nonEventParamNames() {
        return Object.keys(this.params).filter((paramName) => {
            return !(this.params[paramName] instanceof EventParam);
        })
    }

    restorePresets() {
        // Restore currently selected state
        const storedSelectedPresetState = localStorage.getItem(this.#currentlySelectedKey);
        this.selectedPresetName = storedSelectedPresetState;

        // Default values as first preset
        this.defaultPreset = {};
        this.nonEventParamNames.forEach((paramName) => {
            this.defaultPreset[paramName] = this.params[paramName].defaultValue;
        });

        // Local storage (user presets)
        const storedUserPresetState = localStorage.getItem(this.#userPresetsKey);
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
        const paramNames = this.nonEventParamNames;
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
        localStorage.setItem(this.#currentlySelectedKey, presetName);

        // Set parameter state
        const selectedPreset = this.presets[this.selectedPresetName];
        this.nonEventParamNames.forEach((paramName) => {
            this.params[paramName].value = selectedPreset[paramName];
        });
        this.presetModified = false;
        this.storeParamValues(); // todo: is this redundant? happens twice when importing/etc
    }

    createPreset() {
        const currentPresetNames = Object.keys(this.userPresets);
        const defaultName = 'User Preset ' + (currentPresetNames.length + 1).toString();
        const newPresetName = prompt('New preset name:', defaultName);

        // Return null if canceled or invalid. Todo: appropriate alert(s)
        if (!newPresetName || currentPresetNames.includes(newPresetName)) return null;

        const presetObj = this.#currentPresetObject();
        return this.#addPreset(newPresetName, presetObj);
    }

    canRemoveSelectedPreset() {
        return Object.keys(this.userPresets).includes(this.selectedPresetName);
    }

    removeSelectedPreset() {
        if (!this.canRemoveSelectedPreset) throw 'Preset cannot be removed.';
        delete this.userPresets[this.selectedPresetName];
        localStorage.setItem(this.#userPresetsKey, JSON.stringify(this.userPresets));
    }

    exportPreset() {
        // Generate backing object for export
        const presetObj = this.#currentPresetObject();
        
        // Stringify, blob-ify, and save the backing object
        const objString = JSON.stringify(presetObj, null, 4);
        const objBlob = new Blob([objString], {type: "application/json"});
        return fileSave(objBlob, {
            fileName: this.name + fileNameDivider + this.selectedPresetName,
            extensions: ['.json'],
        });
    }

    importPreset() {
        return fileOpen({
            mimeTypes: ['application/json'],
            extensions: ['.json']
        }).then((file) => {
            // Validate the file name
            const fileNameTrimmed = file.name.split('.').slice(0, -1).join('.');
            const nameComponents = fileNameTrimmed.split(fileNameDivider);
            if (nameComponents.length != 2 || nameComponents[0] != this.name) {
                throw 'Imported preset files must be named like "' + this.name + fileNameDivider + 'Preset Name.json"';
            }
            const presetName = nameComponents[1];
            if (Object.keys(this.presets).includes(nameComponents[1])) {
                throw 'A preset named "' + nameComponents[1] + '" already exists.'
            }
            return Promise.all([presetName, file.text()]);
        }).then(([presetName, presetString]) => {
            // Validate the JSON object
            let presetObject = undefined;
            let genericErrorString = 'Preset file could not be parsed.';
            try {
                presetObject = JSON.parse(presetString);
            } catch (error) {
                throw genericErrorString;
            }
            if (!presetObject) throw genericErrorString;

            // Validate the contents of the object (best effort)
            const importedPresetKeys = Object.keys(presetObject);
            const paramNames = this.nonEventParamNames;
            let invalidParamsErrorString = 'Imported preset file parameter names don\'t match.';
            if (importedPresetKeys.length != paramNames.length) throw invalidParamsErrorString;
            for (let paramIdx = 0; paramIdx < paramNames.length; paramIdx++) {
                if (!importedPresetKeys.includes(paramNames[paramIdx])) {
                    throw invalidParamsErrorString;
                }
            }

            // Add to presets and return the name
            return this.#addPreset(presetName, presetObject);
        });
    }

    /* Private methods */

    #currentPresetObject() {
        const presetObj = {};
        this.nonEventParamNames.forEach((paramName) => {
            presetObj[paramName] = this.params[paramName].value;
        });
        return presetObj;
    }

    #addPreset(newPresetName, presetObject) {
        this.userPresets[newPresetName] = presetObject;
        localStorage.setItem(this.#userPresetsKey, JSON.stringify(this.userPresets));
        return newPresetName;
    }
}
