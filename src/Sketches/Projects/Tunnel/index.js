import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js'

import createRegl from 'regl';
import reglCamera from 'regl-camera';
import angleNormals from 'angle-normals';
import { mat4, vec3 } from 'gl-matrix';

export default class Tunnel extends Sketch {
    name = 'Tunnel';
    type = SketchType.GL;
    // date = new Date('10/25/2022');
    description = `
        Trying to make an endless tunnel, stay tuned.
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
    params = {};

    sketchFn = ({ gl }) => {
        const regl = createRegl({ gl });

        // todo: camera positioning / disable rotation / move camera or geometry with time
        const camera = reglCamera(regl, {
            center: [0, 0, 0],
            theta: -Math.PI / 2,
            distance: 1,
            mouse: false
          });

        // GEOMETRY (todo: stateful class for this?)

        const numSides = 11;
        let headRing = [];
        for (let vertexNum = 0; vertexNum < numSides; vertexNum += 1) {
            const angle = Math.PI * 2 / numSides * vertexNum;
            headRing.push(vec3.fromValues(Math.cos(angle), Math.sin(angle), 0));
        }
        let positions = [];
        let cells = [];

        function addSegment(direction) {
            // Generate next ring values (straight extrusion for now)
            const nextRing = headRing.map((vertex) => {
                let nextVertex = vec3.create();
                vec3.add(nextVertex, vertex, direction);
                return nextVertex;
            });

            // Calculate center point (todo with a lerp?)
            let segmentCenter = vec3.create();
            const pointSum = headRing.concat(nextRing).reduce((prev, curr) => vec3.add(prev, prev, curr), vec3.create());
            const pointCount = nextRing.length * 2;
            vec3.divide(segmentCenter, pointSum, vec3.fromValues(pointCount, pointCount, pointCount));

            // Generate mesh data
            // todo: rotate head ring as new segments are added
            for (let ringPointIdx = 0; ringPointIdx < headRing.length; ringPointIdx += 1) {
                // Calculate frame points (face of new section, base for inward pyramid)
                const frameFarLeft = nextRing[ringPointIdx];
                const frameFarRight = nextRing[(ringPointIdx + 1) % nextRing.length];
                const frameNearLeft = headRing[ringPointIdx];
                const frameNearRight = headRing[(ringPointIdx + 1) % headRing.length];
                // Calculate frame center point
                let frameCenter = vec3.create();
                vec3.lerp(frameCenter, frameNearLeft, frameFarRight, 0.5);
                // Calculate inward pyramid point
                let pyramidPoint = vec3.create();
                vec3.lerp(pyramidPoint, frameCenter, segmentCenter, Math.random() * 0.5 + 0.2); // todo: configurable depth & randomness
                // Create geometry (todo: optimize?)
                positions = positions.concat([pyramidPoint, frameNearLeft, frameNearRight]);
                cells.push([positions.length - 3, positions.length - 2, positions.length - 1]);
                positions = positions.concat([pyramidPoint, frameFarLeft, frameNearLeft]);
                cells.push([positions.length - 3, positions.length - 2, positions.length - 1]);
                positions = positions.concat([pyramidPoint, frameFarRight, frameFarLeft]);
                cells.push([positions.length - 3, positions.length - 2, positions.length - 1]);
                positions = positions.concat([pyramidPoint, frameNearRight, frameFarRight]);
                cells.push([positions.length - 3, positions.length - 2, positions.length - 1]);
            }

            headRing = nextRing;
        }

        for (let i = 0; i < 100; i++) {
            addSegment([0, 0, 0.5]);
        }

        // DRAWING

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
              uniform mat4 projection, view;
              uniform float time;
              attribute vec3 position, normal;
              varying vec3 color;
              void main () {
                color = 0.5 * (1.0 + normal);
                gl_Position = projection * view * vec4(position, 1.0);
              }
            `,
            elements: cells,
            attributes: {
              position: positions,
              normal: angleNormals(cells, positions),
            },
            uniforms: {}
          });

          return () => {
            // Update & clear 
            regl.poll();
            regl.clear({
              color: [ 0, 0, 0, 1 ],
              depth: 1
            });

            // Move camera & draw
            // todo: add segments as camera moves
            // todo: some sort of fog or lighting to obscure the distant segments
            camera.center[2] = camera.center[2] + 0.01;
            camera(() => {
              draw();
            });
          };
        }
}