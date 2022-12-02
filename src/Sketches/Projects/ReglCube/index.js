import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js'

import createRegl from 'regl';
import reglCamera from 'regl-camera';
import angleNormals from 'angle-normals';
import { mat4 } from 'gl-matrix';

export default class ReglCube extends Sketch {
    name = 'regl Cube';
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
        const regl = createRegl({ gl });
        const camera = reglCamera(regl, { phi: 0.5, theta: 0.7, distance: 5.0 });

        const box1 = {
          positions: [[+0.5,-0.5,+0.5],[+0.5,-0.5,-0.5],[-0.5,-0.5,-0.5],
            [-0.5,-0.5,+0.5],[+0.5,+0.5,+0.5],[+0.5,+0.5,-0.5],
            [-0.5,+0.5,-0.5],[-0.5,+0.5,+0.5]],
          cells: [[2,1,0],[3,2,0],[0,1,4],[5,4,1],[1,2,5],[6,5,2],
            [2,3,6],[7,6,3],[7,3,0],[0,4,7],[4,5,6],[4,6,7]]
        };
        const box1Normals = angleNormals(box1.cells, box1.positions);

        const box2 = {
          positions: [
            [+1, +1, +1], [+1, +1, -1], [+1, -1, -1], [+1, -1, +1], // right face; x = 1
            [-1, +1, +1], [-1, +1, -1], [-1, -1, -1], [-1, -1, +1], // left face; x = -1
            [+1, +1, +1], [+1, +1, -1], [-1, +1, -1], [-1, +1, +1], // top face; y = 1
            [+1, -1, +1], [+1, -1, -1], [-1, -1, -1], [-1, -1, +1], // bottom face; y = -1
            [+1, +1, +1], [+1, -1, +1], [-1, -1, +1], [-1, +1, +1], // front face; z = 1
            [+1, +1, -1], [+1, -1, -1], [-1, -1, -1], [-1, +1, -1]  // back face; z = -1
          ],
          cells: [
            [0, 1, 3], [3, 1, 2], // right face
            [7, 5, 4], [7, 6, 5], // left face
            [8, 9, 11], [11, 9, 10], // top face
            [15, 13, 12], [15, 14, 13], // bottom face
            [16, 17, 18], [18, 19, 16], // front face
            [20, 23, 21], [23, 22, 21] // back face
          ]
        }
        const box2Normals = angleNormals(box2.cells, box2.positions);

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
            uniform mat4 model, projection, view;
            uniform float time;
            attribute vec3 position, normal;
            varying vec3 color;
            void main () {
              color = 0.5 * (1.0 + normal);
              gl_Position = projection * view * model * vec4(position, 1.0);
              // gl_Position = projection * view * vec4(position * (1.0 + sin(time) / 5.0), 1.0);
            }
          `,
          elements: box2.cells,
          attributes: {
            position: box2.positions,
            normal: box2Normals,
          },
          uniforms: {
            model: regl.prop('model')
          }
        });

        const model = mat4.create();
        return ({ time, width, height }) => {
          regl.poll();
          regl.clear({
            color: [ 0, 0, 0, 1 ],
            depth: 1
          });

          mat4.rotate(model, model, 0.02, [0,1,0]);
          camera(() => {
            draw({ model });
          });
        };
    };
}