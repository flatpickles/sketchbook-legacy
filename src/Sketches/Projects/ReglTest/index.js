import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js'
import createRegl from 'regl';

import presetsObject from './presets.json';

export default class ReglTest extends Sketch {
    name = 'regl test';
    type = SketchType.GL;
    // date = new Date('10/25/2022');
    description = `
        Playing around with a direct regl instantiation.
    `;
    showPresets = false;

    settings = {
        context: 'webgl',
        scaleToView: true,
        animate: true,
        pixelRatio: 2,
        attributes: {
          antialias: true
        }
    };
    bundledPresets = presetsObject;

    params = {
        // demoFloat: new FloatParam('Demo Float', 0.5, 0.0, 1.0),
        // demoColor: new ColorParam('Demo Color', '#00FF00'),
    };

    sketchFn = ({ gl }) => {
        const regl = createRegl({ gl });

        // Return the renderer function
        return () => {
          // Update regl sizes
          regl.poll();
      
          // Clear back buffer with red
          regl.clear({
            color: [ 1, 1, 0, 1 ]
          });
      
          // Draw your meshes
          // ...
        };
    };
}