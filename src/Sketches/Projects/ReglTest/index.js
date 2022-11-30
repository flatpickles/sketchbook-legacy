import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js'

import createRegl from 'regl';
// import reglCamera from 'regl-camera';
import angleNormals from 'angle-normals';
import { mat4 } from 'gl-matrix';

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
    bundledPresets = {};

    params = {
        // demoFloat: new FloatParam('Demo Float', 0.5, 0.0, 1.0),
        // demoColor: new ColorParam('Demo Color', '#00FF00'),
    };

    sketchFn = ({ gl }) => {
        const regl = createRegl({ 
          gl: gl,
          extensions: []
        });
        // const camera = reglCamera(regl, { phi: 0.5, theta: 0.7, distance: 3.0 });

        const box = {
          positions: [[+0.5,-0.5,+0.5],[+0.5,-0.5,-0.5],[-0.5,-0.5,-0.5],
            [-0.5,-0.5,+0.5],[+0.5,+0.5,+0.5],[+0.5,+0.5,-0.5],
            [-0.5,+0.5,-0.5],[-0.5,+0.5,+0.5]],
          cells: [[2,1,0],[3,2,0],[0,1,4],[5,4,1],[1,2,5],[6,5,2],
            [2,3,6],[7,6,3],[7,3,0],[0,4,7],[4,5,6],[4,6,7]]
        };
        const boxNormals = angleNormals(box.cells, box.positions);

        // Camera stuff...
        const model = mat4.create();
        const view = mat4.create();
        const projection = mat4.create();
        mat4.lookAt(view, [.6,.6,.6], [0,0,0], [0,1,0]);

        const draw = regl({
          frag: `
            precision highp float;
            varying vec3 color;
            void main () {
              gl_FragColor = vec4(color, 1.0);
            }
          `,
          vert: `
            precision highp float;
            uniform mat4 projection, view, model;
            uniform float time;
            attribute vec3 position, normal;
            varying vec3 color;
            void main () {
              color = 0.5 * (1.0 + normal);
              gl_Position = projection * view * model * vec4(position, 1.0);
              // gl_Position = projection * view * vec4(position * (1.0 + sin(time) / 5.0), 1.0);
            }
          `,
          elements: box.cells,
          attributes: {
            position: box.positions,
            normal: boxNormals,
          },
          uniforms: {
            time: regl.prop('time'),
            projection: regl.prop('projection'),
            view: view,
            model: regl.prop('model')
          }
        });

        return ({ time, width, height }) => {
          // basic setup
          regl.poll();
          regl.clear({
            color: [ 0, 0, 0, 1 ],
            depth: 1
          });
      
          // adjust model & projection matrixes each frame
          mat4.rotate(model, model, 0.02, [1,1,0]);
          const aspectRatio = width/height; // is there a regl native way to do this?
          mat4.ortho(projection, -aspectRatio, aspectRatio, -1,1, -1,2);

          // draw with regl
          draw({
            time: time,
            model: model,
            projection: projection
          });
        };
    };
}