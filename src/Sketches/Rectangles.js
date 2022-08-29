import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';

import Util from './Util/Util.js';
import Quadtree from './Util/Quadtree.js';
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
            context.clearRect(0, 0, width, height);
            const structure = new RectStructure(width, height);
            context.strokeStyle = '#000';
            structure.rects.forEach((rect) => {
                context.beginPath();
                context.fillStyle = Util.hsl(Math.random(), 1, 0.5);
                context.rect(rect.x, rect.y, rect.width, rect.height);
                context.fill();
                context.stroke();
            });
        };
    };
}

class RectStructure {
    constructor(
        fullWidth,
        fullHeight)
    {
        this.fullWidth = fullWidth;
        this.fullHeight = fullHeight;
        this.unitSize = 20;
        this.minWidthUnits = 1;
        this.maxWidthUnits = 30;
        this.minHeightUnits = 1;
        this.maxHeightUnits = 5;
        this.generateRects(new Point(0, 0));
    }

    reset() {
        this.quadtree = new Quadtree(this.fullWidth, this.fullHeight); // rects in 2D space
        this.rects = []; // holds same data as quadtree, but keeps addition order
        this.rightOpen = []; // rectangles that do not yet have another on their right
        this.bottomOpen = []; // rectangles that do not yet have another beneath them
    }

    generateRects(fromPoint) {
        // Clear and add first rect
        this.reset();
        this.addRect(fromPoint);
    
        // Iterate through queues of rects with open sides to add more
        while (this.rightOpen.length > 0 || this.bottomOpen.length > 0) {
            if (this.rightOpen.length > 0) {
                const leftRect = this.rightOpen.shift();
                const newOrigin = new Point(leftRect.x + leftRect.width, leftRect.y);
                this.addRect(newOrigin);
            }
            if (this.bottomOpen.length > 0) {
                const topRect = this.bottomOpen.shift();
                const newOrigin = new Point(topRect.x, topRect.y + topRect.height);
                this.addRect(newOrigin);
            }
        }
    }

    addRect(fromPoint) {
        // Calculate maximum possible rect size from this point, or return null if invalid
        const maxRectSize = this.maxRectSize(fromPoint, Math.random() > 0.5);
        if (!maxRectSize) return null;

        // Calculate width for next rect
        const widthRemaining = this.fullWidth - fromPoint.x;
        let width = Math.min(
            widthRemaining,
            maxRectSize.x,
            this.unitSize * Random.rangeFloor(this.minWidthUnits, this.maxWidthUnits)
        );
        const widthLeftover = this.fullWidth - (fromPoint.x + width);
        if (widthLeftover < this.unitSize * this.minWidthUnits) {
            width += widthLeftover;
        }

        // Calculate height for next rect
        const heightRemaining = this.fullHeight - fromPoint.y;
        let height = Math.min(
            heightRemaining,
            maxRectSize.y,
            this.unitSize * Random.rangeFloor(this.minHeightUnits, this.maxHeightUnits)
        );
        const heightLeftover = this.fullHeight - (fromPoint.y + height);
        if (heightLeftover < this.unitSize * this.minHeightUnits) {
            height += heightLeftover;
        }

        // Add the new rectangle, and add it to queues for neighboring rects as appropriate
        const freshRect = new Rect(fromPoint, width, height);
        this.rects.push(freshRect);
        this.quadtree.insert(fromPoint, freshRect);
        if (width != widthRemaining) {
            this.rightOpen.push(freshRect);
        }
        if (height != heightRemaining) {
            this.bottomOpen.push(freshRect);
        }

        // Return the new rect
        return freshRect;
    }

    maxRectSize(fromPoint, preferWidth = true) {
        // Find all possible rect intersections from quadtree
        const maxRectWidth = this.unitSize * this.maxWidthUnits;
        const maxRectHeight = this.unitSize * this.maxHeightUnits;
        const searchNW = new Point(
            fromPoint.x - maxRectWidth,
            fromPoint.y - maxRectHeight
        );
        const searchSE = new Point(
            fromPoint.x + maxRectWidth,
            fromPoint.y + maxRectHeight
        );
        const candidateRects = this.quadtree.search(searchNW, searchSE);

        // Calculate max width & height straight across & down
        let maxWidth = Infinity;
        let maxHeight = Infinity;
        let originInvalid = false;
        candidateRects.forEach((rect) => {
            const horizontalDistance = rect.x - fromPoint.x;
            const verticalDistance = rect.y - fromPoint.y;
            if ((horizontalDistance > 0) && (verticalDistance <= 0) && (rect.height >= -verticalDistance)) {
                maxWidth = Math.min(maxWidth, horizontalDistance);
            } else if ((verticalDistance > 0) && (horizontalDistance <= 0) && (rect.width >= -horizontalDistance)) {
                maxHeight = Math.min(maxHeight, verticalDistance);
            } else if ((verticalDistance <= 0) && (horizontalDistance <= 0) && 
                       (rect.height > -verticalDistance) && (rect.width > -horizontalDistance)) {
                originInvalid = true;
            }
        });

        // If any existing rectangles fully overlap with fromPoint, the origin is invalid
        if (originInvalid) return null;

        // Unless we're strictly building out our rectangles from the top left, the full
        // rect of size [maxWidth, maxHeight] may still overlap with others, so we prefer
        // width or height and find the maximum height/width from that point.
        candidateRects.forEach((rect) => {
            if (preferWidth) {
                const horizontalDistance = rect.x - maxWidth;
                const verticalDistance = rect.y - fromPoint.y;
                if ((verticalDistance > 0) && (horizontalDistance <= 0) && (rect.width >= -horizontalDistance)) {
                    maxHeight = Math.min(maxHeight, verticalDistance);
                }
            } else {
                const horizontalDistance = rect.x - fromPoint.x;
                const verticalDistance = rect.y - maxHeight;
                if ((horizontalDistance > 0) && (verticalDistance <= 0) && (rect.height >= -verticalDistance)) {
                    maxWidth = Math.min(maxWidth, horizontalDistance);
                }
            }
        });

        return new Point(
            maxWidth,
            maxHeight
        );
    }
}
