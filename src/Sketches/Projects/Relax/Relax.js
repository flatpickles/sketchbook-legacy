import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import RelaxGenerator from './RelaxGenerator.js';
import presetsObject from './presets.json';

export default class Relax extends Sketch {
    name = 'Relax';
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

    liveUpdates = false;

    params = {
        pathCount: new FloatParam('Path Count', 100, 2, 200, 1, this.liveUpdates),
        resolution: new FloatParam('Path Detail', 0.5, 0.01, 1.0, 0.01, this.liveUpdates),
        inset: new FloatParam('Inset', 0.1, 0, 0.25, 0.01, this.liveUpdates),
        polygonSides: new FloatParam('Shape Sides', 4, 3, 10, 1, this.liveUpdates),
        topCircle: new BoolParam('Top Circle', this.liveUpdates),
        topRotation: new FloatParam('Top Rotation', 0.5, 0, 1, 0.01, this.liveUpdates),
        bottomCircle: new BoolParam('Bottom Circle', this.liveUpdates),
        bottomRotation: new FloatParam('Bottom Rotation', 0.5, 0, 1, 0.01, this.liveUpdates),
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, this.liveUpdates),
    };
    
    sketchFn = () => {
        const generator = new RelaxGenerator();

        return (props) => {
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const paths = generator.generate(
                [props.width, props.height],
                this.params.pathCount.value,
                this.params.resolution.value,
                this.params.inset.value,
                this.params.polygonSides.value,
                this.params.bottomCircle.value ? null : this.params.bottomRotation.value,
                this.params.topCircle.value ? null : this.params.topRotation.value,
            );

            return renderPaths(paths, {
                lineWidth: scaledNibSize,
                strokeStyle: 'black',
                inkscape: true,
                ...props
            });
        }
    };
}
