export const SketchType = {
    Undefined: 'Undefined',
    Canvas: 'Canvas',
    Shader: 'Shader'
}

export default class Sketch {
    name = 'Unnamed Sketch';
    type = SketchType.Undefined;
    date = new Date();
    description = undefined;
    params = {};
    settings = {};
    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, width, height);
        }
    };

    constructor() {
        // This timeout is ugly, but it makes sure we have all the subclass's
        // custom values for params etc. once initialize is called.
        setTimeout(this.initialize.bind(this), 0);
    }

    initialize() {
        // todo - maybe something here
    }

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
}

