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
        edgeLow: new FloatParam('Lower Bound', 0.1, 0.05, 1, 0.01, false),
        edgeHigh: new FloatParam('Upper Bound', 0.9, 0.05, 1, 0.01, false),
        inset: new FloatParam('Inset', 0.1, 0.01, 0.25, 0.01, false),
        fixedAspect: new BoolParam('Fix Aspect', false),
        rounding: new FloatParam('Rounding', 0.5, 0, 1, 0.01, false),
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

                // Rounded rectangle function
                const roundedRectSDF = (x, y, radius) => {
                    // Normalize to [0, 1]
                    const width = 1, height = 1;
                    x = x * 2 - 1;
                    y = y * 2 - 1;
                    radius = radius - 0.5;

                    // Calculations
                    const dx = Math.abs(x) - width / 2 + radius;
                    const dy = Math.abs(y) - height / 2 + radius;
                    return Math.min(Math.max(dx, dy), 0.0) + Math.sqrt(
                        Math.max(dx, 0.0) * Math.max(dx, 0.0) + Math.max(dy, 0.0) * Math.max(dy, 0.0)
                    ) - radius;
                }

                const sigmoidEasing = (t, k) => {
                    const sigmoidBase = (t, k) => {
                        return (1.0 / (1.0 + Math.exp(-k * t))) - 0.5;
                    }
                    const correction = 0.5 / sigmoidBase(1.0, k);
                    return correction * sigmoidBase(2.0 * t - 1.0, k) + 0.5;
                }

                // Multiply the noise value by the rounded rectangle
                let multiplier = roundedRectSDF(
                    x, y, this.params.rounding.value
                );
                multiplier = sigmoidEasing(multiplier, 14); // fixed easing value, always slaps
                multiplier = Math.max(0, (1 - multiplier * 2));
                return noiseValue * multiplier;
            }

            // Create the generator
            const insetPercent = this.params.inset.value;
            const fixedAspectDimension = Math.min(props.width, props.height);
            const insetValues = [
                this.params.fixedAspect.value
                    ? (props.width - fixedAspectDimension) / 2 + fixedAspectDimension * insetPercent
                    : props.width * insetPercent,
                this.params.fixedAspect.value
                    ? (props.height - fixedAspectDimension) / 2 + fixedAspectDimension * insetPercent
                    : props.height * insetPercent,
            ];
            const generator = new IsolineGrid(
                this.params.gridResolution.value,
                insetValues,
                [props.width - insetValues[0] * 2, props.height - insetValues[1] * 2],
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
