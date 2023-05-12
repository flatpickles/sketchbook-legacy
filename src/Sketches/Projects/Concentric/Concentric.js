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
        Working out a demo workflow for Sketchbook -> SVG for pen plotting.
    `;
    showPresets = false;

    settings = {
        dimensions: 'A4',
        pixelsPerInch: 300,
        units: 'cm',
    };
    bundledPresets = presetsObject;

    params = {
        size1: new FloatParam('Size 1', 0.2, 0.01, 1, 0.01, false),
        size2: new FloatParam('Size 2', 0.8, 0.01, 1, 0.01, false),
        pathCount: new FloatParam('Path Count', 20, 2, 50, 1, false),
        pathResolution: new FloatParam('Path Resolution', 20, 3, 300, 1, false),
        noiseVariant: new FloatParam('Noise Variant', 0, 0, 1, 0.01, false),
        noiseDensity: new FloatParam('Noise Density', 0.5, 0, 1, 0.01, false),
        noiseDepth: new FloatParam('Noise Depth', 0.5, 0, 1, 0.01, false),
    };

    sketchFn = () => {
        // Create a util object
        const generator = new ConcentricUtil();

        return (props) => {
            const circlePaths = generator.generateCirclePaths(
                [props.width, props.height],
                this.params.size1.value,
                this.params.size2.value,
                this.params.pathCount.value,
                this.params.noiseDensity.value * 3,
                this.params.noiseVariant.value * 100,
                this.params.noiseDepth.value / 2,
                this.params.pathResolution.value,
            );

            return renderPaths(circlePaths, {
                lineWidth: 0.1,
                strokeStyle: 'black',
                ...props
            });
        };
    };
}