import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import RelaxGenerator from './RelaxGenerator.js';
import presetsObject from './presets.json';

export default class Relax extends Sketch {
    name = 'Relax';
    type = SketchType.Canvas;
    date = new Date('06/03/2023');
    description = `
        Gradual transitions between rigid & continuous forms. These look best with lots of tightly-packed lines, and can be drawn out mechanically with a pen plotter, using one or two colors. The presets are designed for A4 dimensions, but the system can render appealing square graphics as well.
    `;
    showPresets = true;
    experimental = false;
    displayAsPrint = true;
    settings = {};
    bundledPresets = presetsObject;

    liveUpdates = false;

    params = {
        pathCount: new FloatParam('Path Count', 100, 2, 200, 1, this.liveUpdates),
        polygonSides: new FloatParam('Shape Sides', 4, 3, 10, 1, this.liveUpdates),
        twoTone: new BoolParam('Two Tone', false),
        topSize: new FloatParam('Top Size', 0.66, 0, 1, 0.01, this.liveUpdates),
        bottomSize: new FloatParam('Bottom Size', 0.33, 0, 1, 0.01, this.liveUpdates),
        topCircle: new BoolParam('Top Circle', true),
        bottomCircle: new BoolParam('Bottom Circle', false),
        topRotation: new FloatParam('Top Rotation', 0.75, 0, 1, 0.01, this.liveUpdates),
        bottomRotation: new FloatParam('Bottom Rotation', 0.25, 0, 1, 0.01, this.liveUpdates),
        inset: new FloatParam('Inset', 0.1, 0, 0.25, 0.01, this.liveUpdates),
        normalizeInset: new BoolParam('Normalize Inset', true),
        resolution: new FloatParam('Path Detail', 1, 0.01, 1.0, 0.01, this.liveUpdates),
        lineWidth: new FloatParam('Nib Size (mm)', 0.7, 0.1, 2, 0.01, this.liveUpdates),
    };
    
    sketchFn = () => {
        const generator = new RelaxGenerator();

        return (props) => {
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const paths = generator.generate(
                [props.width, props.height],
                this.params.pathCount.value,
                this.params.twoTone.value,
                this.params.resolution.value,
                this.params.inset.value,
                this.params.normalizeInset.value,
                this.params.polygonSides.value,
                this.params.bottomSize.value,
                this.params.topSize.value,
                this.params.bottomCircle.value ? null : this.params.bottomRotation.value,
                this.params.topCircle.value ? null : this.params.topRotation.value,
            );

            return renderPaths(paths, {
                lineWidth: scaledNibSize,
                strokeStyle: this.params.twoTone.value ? ['#1C8F96', '#1A135A'] : 'black',
                inkscape: true,
                ...props
            });
        }
    };
}
