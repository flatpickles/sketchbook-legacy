import Sketch, { SketchType, SketchCategory } from '../../Base/Sketch.js';
import { FloatParam, BoolParam, ColorParam } from '../../Base/SketchParam.js';
import { renderPaths } from 'canvas-sketch-util/penplot';

import Generator from './Generator.js';
import presetsObject from './presets.json';

export default class ThatsAMoire extends Sketch {
    name = 'That\'s a Moiré';
    type = SketchType.Canvas;
    date = new Date('07/28/2023');
    description = `
        Subtle moiré pattern generation via two offset radial patterns, each of which is identical
        to the other. Simplex noise distorts these patterns as they flow outward, creating movement
        and keeping it interesting.
    `;
    showPresets = true;
    experimental = false;
    displayAsPrint = true;
    settings = {};
    bundledPresets = presetsObject;
    category = SketchCategory.Paths;

    params = {
        rayCount: new FloatParam('Ray Count', 150, 10, 200, 1, false),
        outerRadius: new FloatParam('Outer Radius', 1, 0, 1, 0.01, false),
        innerRadius: new FloatParam('Inner Radius', 0.33, 0, 1, 0.01, false),
        centerOffset: new FloatParam('Center Offset', 0.01, 0, 0.05, 0.001, false),
        rotationOffset: new FloatParam('Rotation Offset', 0.0, 0, 0.1, 0.01, false),
        noiseIntensity: new FloatParam('Noise Intensity', 0.5, 0, 1, 0.01, false),
        noiseDensity: new FloatParam('Noise Density', 0.4, 0, 1, 0.01, false),
        noiseVariant: new FloatParam('Noise Variant', 0.5, 0, 1, 0.01, false),
        asymmetry: new FloatParam('Asymmetry', 0.1, 0, 0.25, 0.01, false),
        lineResolution: new FloatParam('Line Resolution', 50, 2, 100, 1, false),
        lineWidth: new FloatParam('Nib Size (mm)', 0.5, 0.1, 2, 0.01, false),
    };
    
    sketchFn = () => {
        const generator = new Generator();

        return (props) => {
            const scaledNibSize = this.params.lineWidth.value * 0.0393701; // mm to inches
            const centerOffset = props.height * this.params.centerOffset.value;
            const outerRadius = (Math.min(props.width, props.height) / 2 - centerOffset / 2) * this.params.outerRadius.value;
            const innerRadius = (Math.min(props.width, props.height) / 2 - centerOffset / 2) * this.params.innerRadius.value;
            const topPaths = generator.generateRays(
                [props.width / 2, props.height / 2 - centerOffset/2],
                outerRadius, innerRadius,
                this.params.rayCount.value,
                -this.params.rotationOffset.value / 2,
                this.params.noiseIntensity.value,
                this.params.noiseDensity.value,
                this.params.noiseVariant.value,
                this.params.asymmetry.value,
                this.params.lineResolution.value
            );
            const bottomPaths = generator.generateRays(
                [props.width / 2, props.height / 2 + centerOffset/2],
                outerRadius, innerRadius,
                this.params.rayCount.value,
                this.params.rotationOffset.value / 2,
                this.params.noiseIntensity.value,
                this.params.noiseDensity.value,
                this.params.noiseVariant.value,
                this.params.asymmetry.value,
                this.params.lineResolution.value
            );
            
            return renderPaths([topPaths, bottomPaths], {
                lineWidth: scaledNibSize,
                strokeStyle: 'black',
                lineCap: 'round',
                inkscape: true,
                ...props
            });
        }
    };
}
