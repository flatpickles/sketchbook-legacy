import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js';
import createShader from  'canvas-sketch-util/shader';

import shaderString from './BioBlobs.frag';
import presetsObject from './presets.json';

export default class BioBlobs extends Sketch {
    name = 'Bio Blobs';
    type = SketchType.GL;
    date = new Date('06/12/2023');
    description = `
        Porting in an <a href="https://www.flatpickles.com/media/pathogen">experiment</a> from 2020. Could use some further experimentation, tweaks, parameterization, and assorted finesse.
    `;
    showPresets = false;

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true,
        pixelRatio: 2
    };
    bundledPresets = presetsObject;

    params = {};

    sketchFn = ({ gl }) => {
        const frag = shaderString;
        return createShader({
            gl,
            frag,
            uniforms: {
                time: ({ time }) => time,
                renderSize: ({}) => [window.innerWidth, window.innerHeight],
                demoFloat: ({}) => this.params.demoFloat.value,
                demoColor: ({}) => this.params.demoColor.vec4,
            }
        });
    };
}