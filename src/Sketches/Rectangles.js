import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';

import { Point, Rect } from './Util/Geometry.js';

import Random from 'canvas-sketch-util/random';

export default class Rectangles extends Sketch {
    name = 'Rectangles';
    type = SketchType.Canvas;
    date = new Date('8/24/2022');
    description = `
        Packing up some rectangles, let's see how it's done.
    `;

    params = {
        // bigness: new FloatParam('Bigness', 0.7, 0, 1),
        // isGreen: new BoolParam('Is Green', true)
    };
    
    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            context.clearRect(0, 0, width, height); // clear canvas
            context.beginPath(); // also clear previous strokes

            const structure = new RectStructure(width, height);
            context.strokeStyle = '#000';
            structure.rects.forEach((rect) => {
                context.fillStyle = '#AAA';
                context.rect(rect.origin.x, rect.origin.y, rect.width, rect.height);
                context.fill();
                context.stroke();
            });
        };
    };
}

class RectStructure {
    constructor(
        fullWidth,
        fullHeight,
        minRectWidth = 10,
        maxRectWidth = 100,
        minRectHeight = 50, 
        maxRectHeight = 100)
    {
        this.fullWidth = fullWidth;
        this.fullHeight = fullHeight;
        this.minRectWidth = minRectWidth;
        this.maxRectWidth = maxRectWidth;
        this.minRectHeight = minRectHeight;
        this.maxRectHeight = maxRectHeight;
        this.generateRects(new Point(0, 0));
    }

    maxWidth(fromPoint) {
        // todo: return width to next rect in struct, OR width of display
        // search in quadtree within range of maxRectWidth (similar thing for height)
        return Infinity;
    }

    maxHeight(fromPoint) {
        // todo: return height to next rect in struct, OR height of display
        return Infinity;
    }

    generateRects(fromPoint) {
        this.rects = [];
        this.leftOpen = [];
        this.topOpen = [];

        this.addRect(fromPoint);
        while (this.leftOpen.length > 0) {
            const leftRect = this.leftOpen.shift();
            const newOrigin = new Point(fromPoint.x + leftRect.width, fromPoint.y);
            this.addRect(newOrigin);
            fromPoint = newOrigin;
        }

        // todo: 
        // * maintain a queue (?) of rects that need a rect to the right and/or (?) below
        // * keep going while the queue has members; add rects relative to previous rect(s)
    }

    addRect(fromPoint) {
        const widthRemaining = this.fullWidth - fromPoint.x;
        const heightRemaining = this.fullHeight - fromPoint.y;
        const width = Math.min(widthRemaining, Math.min(
            this.maxWidth(fromPoint),
            Random.rangeFloor(this.minRectWidth, this.maxRectWidth)
        ));
        const height = Math.min(heightRemaining, Math.min(
            this.maxHeight(fromPoint),
            Random.rangeFloor(this.minRectHeight, this.maxRectHeight)
        ));

        const freshRect = new Rect(fromPoint, width, height);
        this.rects.push(freshRect);
        if (width != widthRemaining) {
            this.leftOpen.push(freshRect);
        }
        if (height != heightRemaining) {
            this.topOpen.push(freshRect);
        }

        return freshRect;
    }
}
