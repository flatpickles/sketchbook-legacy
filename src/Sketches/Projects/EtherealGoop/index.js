import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './index.frag';
import presetsObject from './presets.json';

export default class EtherealGoop extends Sketch {
    name = 'Ethereal Goop';
    type = SketchType.Shader;
    // date = new Date('05/02/2021');
    description = `
        This is the beginnings of a Sketchbook port for Ethereal Goop! Needs colors exposed in params, description, readme, etc.
    `;
    showPresets = false;

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true
    };
    bundledPresets = presetsObject;

    params = {
        goopScale: new FloatParam('Goop Scale', 4.0, 1.0, 10.0),
        offsetX: new FloatParam('X Offset', -0.4, -2.0, 2.0),
        offsetY: new FloatParam('Y Offset', 1.0, -2.0, 2.0),
        noiseEdge: new FloatParam('Noise Edge', 0.5, 0.3, 0.7),
        bgColor: new ColorParam('BG Color', '#247144'),
        bottomColor: new ColorParam('Bottom Color', '#ED2E2E'),
        topColor: new ColorParam('Top Color', '#F3EF53'),
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
                noiseEdge: ({}) => this.params.noiseEdge.value,
                bgColor: ({}) => this.params.bgColor.vec4,
                bottomColor: ({}) => this.params.bottomColor.vec4,
                topColor: ({}) => this.params.topColor.vec4,
            }
        });
    };
}
