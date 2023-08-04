import Sketch, { SketchType, SketchCategory } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import Generator from './Generator.js';
import presetsObject from './presets.json';

export default class Disintegration extends Sketch {
    name = 'Disintegration';
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
        divisions: new FloatParam('Divisions', 20, 2, 100, 1, false),
        proportional: new BoolParam('Proportional', false),
        inset: new FloatParam('Inset', 0, 0, 0.5, 0.01, false),
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        const generator = new Generator();

        return (props) => {
            // Calculate sizing
            const insetSize = this.params.inset.value * Math.min(props.width, props.height);
            const originPoint = [insetSize, insetSize];
            const size = [props.width - insetSize * 2, props.height - insetSize * 2];
            
            // Calculate divisions
            const rows = this.params.divisions.value;
            const cols = this.params.proportional.value
                ? this.params.divisions.value
                : Math.floor(this.params.divisions.value * size[1] / size[0]);
                
            // Generate paths
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const paths = generator.generate(
                originPoint,
                size,
                rows,
                cols
            );

            return renderPaths(paths, {
                lineWidth: scaledNibSize,
                strokeStyle: 'black',
                lineCap: 'round',
                inkscape: true,
                ...props
            });
        }
    };
}
