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
        noiseDepth: new FloatParam('Noise Depth', 0.6, 0, 1, 0.01, false),
        noiseDensity: new FloatParam('Noise Density', 0.5, 0, 1, 0.01, false),
        pathCount: new FloatParam('Path Count', 14, 2, 50, 1, false),
        pathResolution: new FloatParam('Path Resolution', 50, 3, 300, 1, false),
        pathWidth: new FloatParam('Path Width', 0.1, 0.01, 1, 0.01, false),
        xIterations: new FloatParam('X Iterations', 1, 1, 4, 1, false),
        yIterations: new FloatParam('Y Iterations', 1, 1, 6, 1, false),
    };

    sketchFn = () => {
        // Create a util object
        const generator = new ConcentricUtil();

        return (props) => {
            const iterations = generator.generateIterations(
                    [this.params.xIterations.value, this.params.yIterations.value], 
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

            return renderPaths(iterations, {
                lineWidth: this.params.pathWidth.value,
                strokeStyle: 'black',
                ...props
            });
        };
    };
}