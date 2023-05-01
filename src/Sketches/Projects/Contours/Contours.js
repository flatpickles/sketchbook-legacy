import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import ContourGenerator from './ContourGenerator.ts';
import presetsObject from './presets.json';
import CanvasUtil from '../../Util/CanvasUtil.js';

export default class Contours extends Sketch {
    name = 'Contours';
    type = SketchType.Canvas;
    // date = new Date('04/30/2023');
    description = `
        Seeking longitudinal flow.
    `;
    showPresets = false;

    settings = {};
    bundledPresets = presetsObject;

    params = {};
    
    sketchFn = ({}) => {
        const contourGenerator = new ContourGenerator();
        const paths = contourGenerator.generate();
        return ({ context, width, height }) => {
            // Clear the previous frame
            context.clearRect(0, 0, width, height);

            // Draw a white background
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, width, height);

            // Draw the generated paths
            context.strokeStyle = '#000000';
            const paths = contourGenerator.generate();
            paths.forEach(path => {
                const scaledPath = path.map(point => [point[0] * width, point[1] * height]);
                CanvasUtil.drawSpline(context, scaledPath, 1, '#000');
            });

        };
    };
}