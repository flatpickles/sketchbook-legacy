import Sketch, { SketchType, SketchCategory } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import Generator from './Generator.js';
import presetsObject from './presets.json';

export default class Disintegration extends Sketch {
    name = 'Disintegration';
    type = SketchType.Canvas;
    // date = new Date('05/17/2023');
    description = `
        This sketch is intended to be drawn out with a pen plotter.
    `;
    showPresets = true;
    experimental = true;
    displayAsPrint = true;
    settings = {};
    bundledPresets = presetsObject;
    category = SketchCategory.Paths;

    params = {
        divisions: new FloatParam('Divisions', 20, 2, 100, 1, false),
        inset: new FloatParam('Inset', 0, 0, 3, 0.5, false),
        square: new BoolParam('Square-ish', true),
        rotationMin: new FloatParam('Rotation Min', 0, 0, 1, 0.01, false),
        rotationMax: new FloatParam('Rotation Max', 0.25, 0, 1, 0.01, false),
        rotationEasing: new FloatParam('Rotation Easing', 0.01, 0.01, 1, 0.01, false),
        xOnset: new BoolParam('X Onset', false),
        yOnset: new BoolParam('Y Onset', true),
        thereAndBack: new BoolParam('There and Back', false),
        noiseScale: new FloatParam('Noise Scale', 0.2, 0, 1, 0.01, false),
        noiseVariant: new FloatParam('Noise Variant', 0.5, 0, 1, 0.01, false),
        noiseOffset: new FloatParam('Noise XY Offset', 0, 0, 1, 0.01, false),
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
        circleMode: new BoolParam('Circle Mode', false),
    };
    
    sketchFn = () => {
        const generator = new Generator();

        return (props) => {
            // Generate paths
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const paths = generator.generate(
                [props.width, props.height],
                this.params.divisions.value,
                this.params.square.value,
                this.params.inset.value,
                this.params.rotationMin.value * Math.PI * 2,
                this.params.rotationMax.value * Math.PI * 2,
                this.params.rotationEasing.value * 10,
                this.params.xOnset.value,
                this.params.yOnset.value,
                this.params.thereAndBack.value,
                this.params.noiseScale.value * 10,
                this.params.noiseScale.value * 10,
                this.params.noiseVariant.value * 10,
                this.params.noiseOffset.value * 10,
                this.params.circleMode.value
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
