import Sketch, { SketchType, SketchCategory } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import Generator from './Generator.js';
import presetsObject from './presets.json';

export default class FlowField extends Sketch {
    name = 'Flow Field';
    type = SketchType.Canvas;
    // date = new Date('05/17/2023');
    description = `
        This sketch is intended to be drawn out with a pen plotter.
    `;
    showPresets = false;
    experimental = true;
    displayAsPrint = true;
    settings = {};
    bundledPresets = presetsObject;
    category = SketchCategory.Paths;

    params = {
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        const generator = new Generator();

        return (props) => {
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const paths = generator.generate({
                dimensions: [props.width, props.height],
                noiseVariant: 1,
            });

            return renderPaths(paths, {
                lineWidth: scaledNibSize,
                strokeStyle: 'black',
                inkscape: true,
                ...props
            });
        }
    };
}
