import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { createPath, renderPaths, eachPath, drawSVGPath } from 'canvas-sketch-util/penplot';
import CanvasUtil from '../../Util/CanvasUtil.js';

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
    
    sketchFn = ({}) => {
        return (props) => {
            const splinePath1 = CanvasUtil.createBezierSpline([
                [ 5, 5],
                [ 15, 15],
                [ 10, 5],
                [ 5, 20],
                [ 5, 5],
            ]);

            const splinePath2 = CanvasUtil.createBezierSpline([
                [ 15, 5],
                [ 5, 15],
                [ 10, 5],
                [ 5, 10],
                [ 5, 5],
            ]);

            return renderPaths([splinePath1], {
                lineWidth: 0.1,
                strokeStyle: 'black',
                ...props
            });
        };
    };
}