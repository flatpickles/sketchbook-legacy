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

        const drawTriangle = regl({
          // Shaders in regl are just strings.  You can use glslify or whatever you want
          // to define them.  No need to manually create shader objects.
          frag: `
            precision mediump float;
            uniform vec4 color;
            void main() {
              gl_FragColor = color;
            }`,
        
          vert: `
            precision mediump float;
            attribute vec2 position;
            void main() {
              gl_Position = vec4(position, 0, 1);
            }`,
        
          // Here we define the vertex attributes for the above shader
          attributes: {
            // regl.buffer creates a new array buffer object
            position: regl.buffer([
              [-0.5, -0.5],   // no need to flatten nested arrays, regl automatically
              [0.5, -0.5],    // unrolls them into a typedarray (default Float32)
              [0,  0.5]
            ])
            // regl automatically infers sane defaults for the vertex attribute pointers
          },
        
          uniforms: {
            // This defines the color of the triangle to be a dynamic variable
            color: regl.prop('color')
          },
        
          // This tells regl the number of vertices to draw in this command
          count: 3
        });

        // Return the renderer function
        return ({ time }) => {
          // Update regl sizes
          regl.poll();
      
          // Clear back buffer with red
          regl.clear({
            color: [ 0, 0, 0, 1 ],
            depth: 1
          });
      
          // draw a triangle using the command defined above
          drawTriangle({
            color: [
              Math.cos(time * 0.1),
              Math.sin(time * 0.2),
              Math.cos(time * 0.3),
              1
            ]
          })
        };
    };
}