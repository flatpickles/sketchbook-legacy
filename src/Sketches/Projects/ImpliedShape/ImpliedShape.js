import Sketch, { SketchType, SketchCategory } from '../../Base/Sketch.js';
import { FloatParam, BoolParam } from '../../Base/SketchParam.js';
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
        rectCount: new FloatParam('Rect Count', 5, 1, 20, 1, false),
        innerMask: new BoolParam('Inner Mask', true),
        outerMask: new BoolParam('Outer Mask', true),
        innerSize: new FloatParam('Inner Size', 0.25, 0.1, 0.5, 0.01, false),
        outerSize: new FloatParam('Outer Size', 0.45, 0.1, 0.5, 0.01, false),
        gapSize: new FloatParam('Gap Size', 0.05, 0.01, 0.1, 0.01, false),
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        const groundGenerator = new GroundGenerator();

        return (props) => {
            const minDimension = Math.min(props.width, props.height);
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const scaledGapSize = this.params.gapSize.value * minDimension;

            // Generate the background
            const paths = groundGenerator.generate(
                this.params.rectCount.value,
                [scaledGapSize, scaledGapSize],
                [props.width - scaledGapSize, props.height - scaledGapSize],
                scaledGapSize,
            );

            // Mask out a circle in the center
            const center = [props.width / 2, props.height / 2];
            const maskedPaths = paths.flatMap(path => PolylineUtil.maskPolyline(path, (point) => {
                const innerCircle = Math.sqrt(
                    Math.pow(point[0] - center[0], 2) + Math.pow(point[1] - center[1], 2)
                ) > this.params.innerSize.value * Math.min(props.width, props.height);
                const outerCircle = Math.sqrt(
                    Math.pow(point[0] - center[0], 2) + Math.pow(point[1] - center[1], 2)
                ) < this.params.outerSize.value * Math.min(props.width, props.height);
                return (innerCircle || !this.params.innerMask.value) && 
                    (outerCircle || !this.params.outerMask.value);
            }));

            // Render the paths
            return renderPaths(maskedPaths, {
                lineWidth: scaledNibSize,
                strokeStyle: 'black',
                lineCap: 'square',
                inkscape: true,
                ...props
            });
        }
    };
}
