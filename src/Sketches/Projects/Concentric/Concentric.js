import { renderPaths } from 'canvas-sketch-util/penplot';

import Sketch, { SketchType, SketchCategory } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import ConcentricGenerator from './ConcentricGenerator.js';

import presetsObject from './presets.json';

export default class Concentric extends Sketch {
    name = 'Concentric';
    type = SketchType.Canvas;
    date = new Date('05/14/2023');
    experimental = false;
    description = `
        Exploring new forms of continuity. Path-based generative designs, intended to be rendered to SVG and drawn mechanically with a pen plotter.
    `;
    showPresets = true;
    bundledPresets = presetsObject;
    displayAsPrint = true;
    category = SketchCategory.Paths;

    params = {
        size1: new FloatParam('Size 1', 0.25, 0.01, 1, 0.01, false),
        size2: new FloatParam('Size 2', 1.0, 0.01, 1, 0.01, false),
        thereAndBack: new BoolParam('There and Back', false),
        noiseVariant: new FloatParam('Noise Variant', 0.5, 0, 1, 0.01, false),
        noiseDepth: new FloatParam('Noise Depth', 0.6, 0, 1, 0.01, false),
        noiseDensity: new FloatParam('Noise Density', 0.5, 0, 1, 0.01, false),
        pathCount: new FloatParam('Path Count', 14, 2, 50, 1, false),
        pathResolution: new FloatParam('Path Resolution', 50, 3, 300, 1, false),
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
        xIterations: new FloatParam('X Iterations', 1, 1, 4, 1, false),
        yIterations: new FloatParam('Y Iterations', 1, 1, 6, 1, false),
        iterationGap: new FloatParam('Iter. Gap %', 0, 0, 10, 0.5, false),
        hInset: new FloatParam('W Inset %', 0, 0, 10, 0.5, false),
        vInset: new FloatParam('H Inset %', 0, 0, 10, 0.5, false),
    };

    sketchFn = () => {
        const generator = new ConcentricGenerator();
        return (props) => {
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const scaledSize = [
                (100 - this.params.hInset.value * 2) * props.width / 100,
                (100 - this.params.vInset.value * 2) * props.height / 100,
            ];
            const scaledGap = [
                props.width * this.params.iterationGap.value / 100,
                props.height * this.params.iterationGap.value / 100,
            ];

            const iterations = generator.generateIterations(
                    [this.params.xIterations.value, this.params.yIterations.value],
                    [(props.width - scaledSize[0]) / 2, (props.height - scaledSize[1]) / 2],
                    scaledSize,
                    scaledGap,
                    this.params.size1.value,
                    this.params.size2.value,
                    this.params.thereAndBack.value,
                    this.params.pathCount.value,
                    this.params.noiseDensity.value * 3,
                    this.params.noiseVariant.value * 100,
                    this.params.noiseDepth.value,
                    this.params.pathResolution.value,
                    scaledNibSize
            );

            return renderPaths(iterations, {
                lineWidth: scaledNibSize,
                strokeStyle: 'black',
                inkscape: true,
                ...props
            });
        };
    };
}