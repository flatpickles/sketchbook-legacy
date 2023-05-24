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
        gridResolution: new FloatParam('Grid Resolution', 20, 1, 200, 1, false),
        layerCount: new FloatParam('Layer Count', 4, 1, 10, 1, false),
        edgeLow: new FloatParam('Lower Bound', -0.8, -1, 1, 0.01, false),
        edgeHigh: new FloatParam('Upper Bound', 0.8, -1, 1, 0.01, false),
        noiseScaleX: new FloatParam('Noise Scale X', 0.5, 0.01, 1.0, 0.01, false),
        noiseScaleY: new FloatParam('Noise Scale Y', 0.5, 0.01, 1.0, 0.01, false),
        interpolate: new BoolParam('Interpolate', true),
        evenSpacing: new BoolParam('Even Spacing', true),
        splineTension: new FloatParam('Spline Tension', 1, 0, 1, 0.01, false),
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        return (props) => {
            const generator = new IsolineGrid(
                this.params.gridResolution.value,
                [props.width, props.height],
                [this.params.noiseScaleX.value, this.params.noiseScaleY.value]
            );
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches

            const paths = generator.generateIsolineLayers(
                this.params.layerCount.value, 
                [this.params.edgeLow.value, this.params.edgeHigh.value],
                this.params.splineTension.value,
                this.params.interpolate.value,
                this.params.evenSpacing.value,
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
