import { createPath, renderPaths, eachPath, drawSVGPath } from 'canvas-sketch-util/penplot';

import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import ConcentricUtil from './ConcentricUtil.js';

import presetsObject from './presets.json';

export default class Concentric extends Sketch {
    name = 'Concentric';
    type = SketchType.Canvas;
    // date = new Date('04/30/2023');
    description = `
        Exploring new forms of continuity. Rendered as SVG paths, intended to be drawn mechanically with a pen plotter.
    `;
    showPresets = true;

    settings = {
        dimensions: 'A4',
        pixelsPerInch: 300,
        units: 'cm',
    };
    bundledPresets = presetsObject;

    params = {
        size1: new FloatParam('Size 1', 0.25, 0.01, 1, 0.01, false),
        size2: new FloatParam('Size 2', 1.0, 0.01, 1, 0.01, false),
        thereAndBack: new BoolParam('There and Back', false),
        noiseVariant: new FloatParam('Noise Variant', 0.5, 0, 1, 0.01, false),
        noiseDensity: new FloatParam('Noise Density', 0.5, 0, 1, 0.01, false),
        noiseDepth: new FloatParam('Noise Depth', 0.3, 0, 1, 0.01, false),
        pathCount: new FloatParam('Path Count', 14, 2, 50, 1, false),
        pathResolution: new FloatParam('Path Resolution', 100, 3, 300, 1, false),
        pathWidth: new FloatParam('Path Width', 0.1, 0.01, 1, 0.01, false),
    };

    sketchFn = () => {
        // Create a util object
        const generator = new ConcentricUtil();

        return (props) => {
            const circlePaths = generator.generateCirclePaths(
                [props.width, props.height],
                this.params.size1.value,
                this.params.size2.value,
                this.params.thereAndBack.value,
                this.params.pathCount.value,
                this.params.noiseDensity.value * 3,
                this.params.noiseVariant.value * 100,
                this.params.noiseDepth.value,
                this.params.pathResolution.value,
                this.params.pathWidth.value
            );

            return renderPaths(circlePaths, {
                lineWidth: this.params.pathWidth.value,
                strokeStyle: 'black',
                ...props
            });
        };
    };
}