import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { createPath, renderPaths } from 'canvas-sketch-util/penplot';

import presetsObject from './presets.json';

export default class Concentric extends Sketch {
    name = 'Concentric';
    type = SketchType.Canvas;
    // date = new Date('04/30/2023');
    description = `
        This is a canvas-based sketch.
    `;
    showPresets = false;

    settings = {
        dimensions: 'A4',
        pixelsPerInch: 300,
        units: 'cm',
      };
    bundledPresets = presetsObject;

    params = {
        demoFloat: new FloatParam('Demo Float', 0.5, 0.0, 1.0),
        demoColor: new ColorParam('Demo Color', '#00FF00'),
    };
    
    sketchFn = ({}) => {
        return (props) => {
            // Create shapes with path interface
            const shape0 = createPath(ctx => ctx.arc(0, 0, 50, 0, Math.PI * 2));
            // And/or with polylines or plain SVGStrings, e.g. from a .svg file
            const shape1 = [ [ 0, 0 ], [ 50, 25 ] ];
            // Combine into an array or nested array
            const paths = [ shape0, shape1 ];

            return renderPaths(paths, props);
        };
    };
}