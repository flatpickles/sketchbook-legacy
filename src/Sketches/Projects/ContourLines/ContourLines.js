import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import presetsObject from './presets.json';
import IsolineGrid from './IsolineGrid.js';

export default class ContourLines extends Sketch {
    name = 'Contour Lines';
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

    params = {
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        const generator = new Generator();

        return (props) => {
            const generator = new IsolineGrid(10, [props.width, props.height]);
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const paths = generator.generateIsolineLayers(5);

            return renderPaths(paths, {
                lineWidth: scaledNibSize,
                strokeStyle: 'black',
                ...props
            });
        }
    };
}
