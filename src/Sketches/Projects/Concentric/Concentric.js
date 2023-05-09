import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { createPath, renderPaths } from 'canvas-sketch-util/penplot';
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
            const splinePath = CanvasUtil.createBezierSpline([
                [ 1, 1],
                [ 10, 10],
                [ 10, 5],
                [ 5, 10],
                [ 1, 1],
            ]);

            return renderPaths([splinePath], {
                lineWidth: 0.1,
                ...props
            });
        };
    };
}