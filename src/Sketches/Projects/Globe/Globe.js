import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import Generator from './Generator.js';
import presetsObject from './presets.json';

export default class Globe extends Sketch {
    name = 'Globe';
    type = SketchType.Canvas;
    date = new Date('05/17/2023');
    description = `
        A simple spherical projection, rendering something like latitude & longitude lines on a globe.
    `;
    showPresets = false;
    experimental = true;
    displayAsPrint = true;
    settings = {};
    bundledPresets = presetsObject;

    params = {
        radius: new FloatParam('Radius', 0.5, 0.1, 1, 0.01, false),
        lineCount: new FloatParam('Line Count', 15, 2, 30, 1, false),
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        const generator = new Generator();

        return (props) => {
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const paths = generator.generate(
                this.params.lineCount.value,
                20,
                this.params.radius.value * Math.min(props.width, props.height) / 2 - scaledNibSize / 2,
                [props.width / 2, props.height / 2]
            );

            return renderPaths(paths, {
                lineWidth: scaledNibSize,
                strokeStyle: 'black',
                inkscape: true,
                ...props
            });
        }
    };
}
