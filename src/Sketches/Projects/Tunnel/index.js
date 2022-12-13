import Sketch, { SketchType } from '../../Base/Sketch.js';
import { FloatParam, ColorParam } from '../../Base/SketchParam.js'

import createRegl from 'regl';
import reglCamera from 'regl-camera';
import angleNormals from 'angle-normals';
import { mat4, vec3 } from 'gl-matrix';

class TunnelGeo {
    static numSides = 11;
    static segmentSize = 0.5;
    static unitSize = 5;
    static unitCount = 10;

    constructor(regl) {
        this.generateGeo();

        // Create draw function (requires regl, thus post-instantiation)
        this.draw = regl({
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
                }
            `,
            elements: regl.this('cells'),
            attributes: {
                position: regl.this('positions'),
                normal: regl.this('normals'),
            },
            uniforms: {
                model: regl.prop('model')
            }
        });
    }

    // Generate geometry
    generateGeo() {
        this.positions = [];
        this.cells = [];

        // Generate first ring
        let headRing = [];
        for (let vertexNum = 0; vertexNum < TunnelGeo.numSides; vertexNum += 1) {
            const angle = Math.PI * 2 / TunnelGeo.numSides * vertexNum;
            headRing.push(vec3.fromValues(Math.cos(angle), Math.sin(angle), 0));
        }

        // Add on segments to first ring
        const segmentCount = (TunnelGeo.unitSize / TunnelGeo.segmentSize);
        const direction = [0, 0, TunnelGeo.segmentSize];
        for (let segmentNum = 0; segmentNum < segmentCount; segmentNum += 1) {
            // Generate next ring values
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
                this.positions = this.positions.concat([pyramidPoint, frameNearLeft, frameNearRight]);
                this.cells.push([this.positions.length - 3, this.positions.length - 2, this.positions.length - 1]);
                this.positions = this.positions.concat([pyramidPoint, frameFarLeft, frameNearLeft]);
                this.cells.push([this.positions.length - 3, this.positions.length - 2, this.positions.length - 1]);
                this.positions = this.positions.concat([pyramidPoint, frameFarRight, frameFarLeft]);
                this.cells.push([this.positions.length - 3, this.positions.length - 2, this.positions.length - 1]);
                this.positions = this.positions.concat([pyramidPoint, frameNearRight, frameFarRight]);
                this.cells.push([this.positions.length - 3, this.positions.length - 2, this.positions.length - 1]);
            }

            // Reassign head
            headRing = nextRing;
        }

        // Create normals
        this.normals = angleNormals(this.cells, this.positions);
    }
}

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
    params = {
        speed: new FloatParam('Speed', 0.2, 0.1, 1.0),
    };

    sketchFn = ({ gl }) => {
        // Create gl stuff
        const regl = createRegl({ gl });
        const camera = reglCamera(regl, {
            center: [0, 0, 0],
            theta: -Math.PI / 2,
            distance: 1,
            mouse: false
        });

        // Prepare for drawing
        const geo = new TunnelGeo(regl);
        let translation = mat4.create();
        let identity = mat4.create();
        mat4.identity(identity);

        return () => {
            // Update & clear 
            regl.poll();
            regl.clear({
                color: [ 0, 0, 0, 1 ],
                depth: 1
            });

            // Move camera and calculate starting position for tunnel units
            camera.center[2] = camera.center[2] + this.params.speed.value * 0.1;
            const firstUnitOffset = camera.center[2] - (camera.center[2] % TunnelGeo.unitSize) - TunnelGeo.unitSize;
            
            // Draw all tunnel units, with repeated draw calls and model uniform updates
            // todo: some sort of fog or lighting to obscure the distant segments
            camera(() => {
                let currentDistance = firstUnitOffset;
                for (let unitNum = 0; unitNum <= TunnelGeo.unitCount; unitNum += 1) {
                    mat4.translate(translation, identity, [0, 0, currentDistance]);
                    geo.draw({
                        model: translation
                    });
                    currentDistance += TunnelGeo.unitSize;
                }
            })
        };
    }
}