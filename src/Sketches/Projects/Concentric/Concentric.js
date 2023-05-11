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
        size: new FloatParam('Size', 0.75, 0, 1, 0.01, false),
        centerSize: new FloatParam('Center Size', 0.2, 0, 1, 0.01, false),
        pathCount: new FloatParam('Path Count', 20, 1, 50, 1, false),
        pathResolution: new FloatParam('Path Resolution', 20, 3, 100, 1, false),
        noiseVariant: new FloatParam('Noise Variant', 0, 0, 100, 0.01, false),
    };

    sketchFn = () => {
        // Create a util object
        const generator = new ConcentricUtil();

        return (props) => {
            const center = [props.width / 2, props.height / 2];
            const radius = Math.min(props.width, props.height) / 2 * this.params.size.value;
            const circlePaths = generator.generateCirclePaths(
                center,
                radius,
                this.params.pathCount.value,
                this.params.centerSize.value,
                this.params.noiseVariant.value,
                this.params.pathResolution.value
            );

            return renderPaths(circlePaths, {
                lineWidth: 0.1,
                strokeStyle: 'black',
                ...props
            });
        };
    };
}