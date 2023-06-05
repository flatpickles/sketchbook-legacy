import { renderPaths } from 'canvas-sketch-util/penplot';
import alea from 'alea';
import { createNoise3D } from 'simplex-noise';

import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';

import presetsObject from './presets.json';
import IsolineGrid from './IsolineGrid.js';

export default class ContourLines extends Sketch {
    name = 'Contour Lines';
    type = SketchType.Canvas;
    // date = new Date('05/17/2023');
    description = `
        This sketch is intended to be drawn out with a pen plotter.
    `;
    showPresets = false;
    experimental = true;
    displayAsPrint = true;
    settings = {};
    bundledPresets = presetsObject;

    params = {
        gridResolution: new FloatParam('Grid Resolution', 20, 1, 200, 1, false),
        layerCount: new FloatParam('Step Count', 4, 1, 10, 1, false),
        edgeLow: new FloatParam('Lower Bound', 0.1, 0.01, 1, 0.01, false),
        edgeHigh: new FloatParam('Upper Bound', 0.9, 0.01, 1, 0.01, false),
        noiseScaleX: new FloatParam('Noise Scale X', 0.5, 0.01, 1.0, 0.01, false),
        noiseScaleY: new FloatParam('Noise Scale Y', 0.5, 0.01, 1.0, 0.01, false),
        noiseVariant: new FloatParam('Noise Variant', 0, 0, 1, 0.01, false),
        interpolate: new BoolParam('Interpolate', true),
        evenSpacing: new BoolParam('Even Spacing', true),
        splineTension: new FloatParam('Spline Tension', 1, 0, 1, 0.01, false),
        lineWidth: new FloatParam('Nib Size (mm)', 1, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        // Create the noise function
        const prng = alea(0);
        const noise = createNoise3D(prng);
        
        return (props) => {
            // Create the value function for the generator
            const valueFn = (x, y) => {
                const noiseValue = noise(
                    x * props.width * this.params.noiseScaleX.value,
                    y * props.height * this.params.noiseScaleY.value,
                    this.params.noiseVariant.value
                ) / 2 + 0.5;
                const centerDistance = Math.sqrt(
                    Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2)
                );
                const multiplier = Math.max(0, (1 - centerDistance * 2));
                return noiseValue * multiplier;
            }

            // Create the generator
            const generator = new IsolineGrid(
                this.params.gridResolution.value,
                [props.width, props.height],
                valueFn
            );
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches

            // Generate and render the paths
            const paths = generator.generateIsolineLayers(
                this.params.layerCount.value, 
                [this.params.edgeLow.value, this.params.edgeHigh.value],
                this.params.splineTension.value,
                this.params.interpolate.value,
                this.params.evenSpacing.value,
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
