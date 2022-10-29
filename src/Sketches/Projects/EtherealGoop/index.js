import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './index.frag';
import presetsObject from './presets.json';

export default class EtherealGoop extends Sketch {
    name = 'Ethereal Goop';
    type = SketchType.Shader;
    date = new Date('10/29/2022');
    description = `
        Ethereal Goop is based on a noise layering <a href='https://flatpickles.com/image/ethereal-goop.jpg'>experiment</a> from 2021. I've built upon that for a fresh Sketchbook version, adding new features and presets, and improving performance.
    `;
    showPresets = true;

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true
    };
    bundledPresets = presetsObject;

    params = {
        goopScale: new FloatParam('Goop Scale', 6.0, 1.0, 10.0),
        offsetX: new FloatParam('X Offset', 0.0, -2.0, 2.0),
        offsetY: new FloatParam('Y Offset', 1.0, -2.0, 2.0),
        layerCount: new FloatParam('Layer Count', 7.0, 1.0, 10.0, 1.0),
        noiseEdge: new FloatParam('Noise Edge', 0.6, 0.2, 0.8),
        edgeTaper: new FloatParam('Edge Taper', 0.0, -1.0, 1.0),
        edgeSoftness: new FloatParam('Edge Softness', 0.02, 0.0, 1.0),
        bgColor: new ColorParam('BG Color', '#042124'),
        bottomColor: new ColorParam('Bottom Color', '#042124'),
        topColor: new ColorParam('Top Color', '#dffaff'),
    };

    sketchFn = ({ gl }) => {
        const frag = shaderString;
        return createShader({
            gl,
            frag,
            uniforms: {
                time: ({ time }) => time,
                renderSize: ({}) => [window.innerWidth, window.innerHeight],
                goopScale: ({}) => this.params.goopScale.value,
                offsetX: ({}) => this.params.offsetX.value,
                offsetY: ({}) => this.params.offsetY.value,
                layerCount: ({}) => this.params.layerCount.value,
                noiseEdge: ({}) => this.params.noiseEdge.value,
                edgeTaper: ({}) => this.params.edgeTaper.value,
                edgeSoftness: ({}) => this.params.edgeSoftness.value,
                bgColor: ({}) => this.params.bgColor.vec4,
                bottomColor: ({}) => this.params.bottomColor.vec4,
                topColor: ({}) => this.params.topColor.vec4,
            }
        });
    };
}
