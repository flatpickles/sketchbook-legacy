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

    params = {};

    sketchFn = () => {
        // Create a util object
        const generator = new ConcentricUtil();

        return (props) => {
            const center = [props.width / 2, props.height / 2];
            const radius = Math.min(props.width, props.height) / 3;
            const circlePaths = generator.generateCirclePaths(center, radius, 20);

            return renderPaths(circlePaths, {
                lineWidth: 0.1,
                strokeStyle: 'black',
                ...props
            });
        };
    };
}