import Sketch, { SketchType, SketchCategory } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import GroundGenerator from './GroundGenerator.js';
import presetsObject from './presets.json';
import PolylineUtil from '../../Util/PolylineUtil.js';

export default class ImpliedShape extends Sketch {
    name = 'Implied Shape';
    type = SketchType.Canvas;
    date = new Date('7/3/2023');
    description = `
        A shape is implied by the negative space within a ground pattern.
    `;
    showPresets = false;
    experimental = true;
    displayAsPrint = true;
    settings = {};
    bundledPresets = presetsObject;
    category = SketchCategory.Paths;

    params = {
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        const groundGenerator = new GroundGenerator();

        return (props) => {
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches

            // Generate the background
            const paths = groundGenerator.generate(
                [0.1, 0.1],
                [props.width - 0.1, props.height - 0.1]
            );

            // Mask out a circle in the center
            const center = [props.width / 2, props.height / 2];
            const maskedPaths = paths.flatMap(path => PolylineUtil.maskPolyline(path, (point) => {
                return Math.sqrt(
                    Math.pow(point[0] - center[0], 2) + Math.pow(point[1] - center[1], 2)
                ) > 0.25 * Math.min(props.width, props.height);
            }));

            // Render the paths
            return renderPaths(maskedPaths, {
                lineWidth: scaledNibSize,
                strokeStyle: 'black',
                lineCap: 'round',
                inkscape: true,
                ...props
            });
        }
    };
}
