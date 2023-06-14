import Sketch, { SketchType, SketchCategory } from '../../Base/Sketch.js';
import { FloatParam, BoolParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import Generator from './Generator.js';
import presetsObject from './presets.json';

export default class SolarPraxis extends Sketch {
    name = 'Solar Praxis';
    type = SketchType.Canvas;
    date = new Date('06/13/23');
    description = `
        Outer circles diminish in size with a consistent ratio, radiating outward.
        Inner circles add complexity, and can be used to create fill patterns or introduce moire effects.
        These forms gesture towards sacred geometry; your mileage may vary.
    `;
    showPresets = true;
    experimental = true;
    displayAsPrint = true;
    settings = {};
    bundledPresets = presetsObject;
    category = SketchCategory.Paths;

    params = {
        divisionCount: new FloatParam('Division Count', 4, 2, 10, 1, false),
        taperRatio: new FloatParam('Taper Ratio', 0.7, 0.5, 1, 0.01, false),
        taperCount: new FloatParam('Taper Count', 20, 0, 20, 1, false),
        expandedForm: new BoolParam('Expanded Form', false),
        innerCircleCount: new FloatParam('Inner Circles', 4, 0, 30, 1, false),
        linearInner: new BoolParam('Linear Inner', false),
        rotation: new FloatParam('Rotation', 0, 0, 1, 0.01, false),
        inset: new FloatParam('Added Inset', 0.1, 0.01, 0.25, 0.01, false),
        innerLineWidth: new FloatParam('Inner Nib (mm)', 0.5, 0.1, 2, 0.01, false),
        outerLineWidth: new FloatParam('Outer Nib (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        const generator = new Generator();

        return (props) => {
            const scaledInnerNibSize = this.params.innerLineWidth.value * 0.0393701; // mm to inches
            const scaledOuterNibSize = this.params.outerLineWidth.value * 0.0393701; // mm to inches
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
                this.params.innerCircleCount.value,
                this.params.linearInner.value
            );

            return renderPaths(paths, {
                lineWidth: [scaledOuterNibSize, scaledInnerNibSize],
                strokeStyle: 'black',
                lineCap: 'round',
                inkscape: true,
                ...props
            });
        }
    };
}
