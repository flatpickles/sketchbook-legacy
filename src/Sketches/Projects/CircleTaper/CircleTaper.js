import Sketch, { SketchType, SketchCategory } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import Generator from './Generator.js';
import presetsObject from './presets.json';

export default class CircleTaper extends Sketch {
    name = 'Circle Taper';
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
        divisionCount: new FloatParam('Division Count', 4, 2, 10, 1, false),
        taperRatio: new FloatParam('Taper Ratio', 0.7, 0.5, 1, 0.01, false),
        taperCount: new FloatParam('Taper Count', 10, 0, 20, 1, false),
        expandedForm: new BoolParam('Expanded Form', false),
        rotation: new FloatParam('Rotation', 0, 0, 1, 0.01, false),
        inset: new FloatParam('Added Inset', 0.1, 0.01, 0.25, 0.01, false),
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        const generator = new Generator();

        return (props) => {
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const minDimension = Math.min(props.width, props.height);
            const inset = this.params.inset.value * minDimension;
            const paths = generator.generate(
                [inset, inset],
                [props.width - inset, props.height - inset],
                this.params.taperRatio.value,
                this.params.taperCount.value,
                this.params.expandedForm.value,
                this.params.rotation.value * Math.PI * 2 / this.params.divisionCount.value,
                this.params.divisionCount.value,
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
