import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import Generator from './Generator.js';
import presetsObject from './presets.json';

export default class CornerRays extends Sketch {
    name = 'Corner Rays';
    type = SketchType.Canvas;
    date = new Date('06/07/2023');
    description = `
        Do it for the Moiré. This sketch is intended to be drawn out on large paper with a pen plotter.
    `;
    showPresets = false;
    experimental = true;
    displayAsPrint = true;
    settings = {};
    bundledPresets = presetsObject;

    params = {
        nodeCount: new FloatParam('Node Count', 10, 2, 40, 1, false),
        topLeft: new BoolParam('Top Left', true),
        topRight: new BoolParam('Top Right', false),
        bottomRight: new BoolParam('Bottom Right', true),
        bottomLeft: new BoolParam('Bottom Left', false),
        inset: new FloatParam('Inset', 0.1, 0.01, 0.25, 0.01, false),
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        const generator = new Generator();
        return (props) => {
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const minDimension = Math.min(props.width, props.height);
            const inset = this.params.inset.value * minDimension;
            const paths = generator.generate(
                [inset, inset],
                [props.width - inset * 2, props.height - inset * 2],
                this.params.nodeCount.value,
                [
                    this.params.topLeft.value,
                    this.params.topRight.value,
                    this.params.bottomRight.value,
                    this.params.bottomLeft.value
                ]
            );
            
            return renderPaths(paths, {
                lineWidth: scaledNibSize,
                strokeStyle: 'black',
                lineCap: 'round',
                inkscape: true,
                ...props
            });
        }
    };
}
