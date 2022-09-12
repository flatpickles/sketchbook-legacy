import Random from 'canvas-sketch-util/random';

import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam, EventParam, ColorParam } from './Base/SketchParam.js';

import Util from './Util/Util.js';
import Quadtree from './Util/Quadtree.js';
import CanvasUtil from './Util/CanvasUtil.js';
import { Point, Rect } from './Util/Geometry.js';

/*

to do:

- use other secondary color HSV values when randomizing hue
- enable H/V insets (showing background/border color, like when resizing)
- click event -> new shapes
- edge to edge fill option (i.e. use exact unit sizing, vs. expand last rects to fit. Maybe scale instead?)
- better name ?

*/

export default class Rectangles extends Sketch {
    name = 'Rectangles';
    type = SketchType.Canvas;
    // date = new Date('8/24/2022');
    description = `
        I'm experimenting with rectangle packing! This is a work in progress.
    `;

    params = {
        unitSize: new FloatParam('Unit Size', 20, 5, 100, 1, false),
        minWidthUnits: new FloatParam('H Min Units', 1, 1, 30, 1, false),
        maxWidthUnits: new FloatParam('H Max Units', 30, 1, 30, 1, false),
        minHeightUnits: new FloatParam('V Min Units', 1, 1, 30, 1, false),
        maxHeightUnits: new FloatParam('V Max Units', 5, 1, 30, 1, false),

        horizontalBorderSize: new FloatParam('H Border', 1, 0, 20, 1, true),
        verticalBorderSize: new FloatParam('V Border', 1, 0, 20, 1, true),
        drawOutsideBorder: new BoolParam('Ext. Border', false),

        borderColor: new ColorParam('Border Color', '#000'),
        primaryColor: new ColorParam('Fill Color A', '#FF00FF'),
        secondaryColor: new ColorParam('Fill Color B', '#00FF00'),
        primaryColorLikelihood: new FloatParam('A Likelihood', 0.5, 0, 1, 0.01, true),
        randomizeBHue: new BoolParam('Random B Hue', false),

        newColors: new EventParam('New Colors', this.newColors.bind(this)),
        newShapes: new EventParam('New Shapes', this.newShapes.bind(this)),
    };

    structure = undefined;
    initializationNeeded = true;
    initializeIfNeeded(width, height) {
        // Check params to see if initialization is needed
        if (this.structure) {
            const paramsUpdated = this.structure.configIsDifferent(
                this.params.unitSize.value,
                this.params.minWidthUnits.value,
                this.params.maxWidthUnits.value,
                this.params.minHeightUnits.value,
                this.params.maxHeightUnits.value);
            this.initializationNeeded = this.initializationNeeded || paramsUpdated;
        }

        // Initialize!
        if (this.initializationNeeded) {
            this.structure = new RectStructure(
                width,
                height,
                this.params.unitSize.value,
                this.params.minWidthUnits.value,
                this.params.maxWidthUnits.value,
                this.params.minHeightUnits.value,
                this.params.maxHeightUnits.value);
            this.initializationNeeded = false;
            this.newColorsNeeded = true;
        }
        
        if (this.structure && this.newColorsNeeded) {
            this.structure.rects.forEach((rect) => {
                // Generate random values for each rect, to be used when coloring
                rect.primaryRandom = Math.random();
                rect.colorRandom = Math.random();
            });
            this.newColorsNeeded = false;
        }
    }

    newShapes() {
        this.initializationNeeded = true;
    }

    newColors() {
        this.newColorsNeeded = true;
    }

    sketchFn = ({}) => {
        return ({ context, width, height }) => {
            // Retrieve param values
            const hBorder = this.params.horizontalBorderSize.value;
            const vBorder = this.params.verticalBorderSize.value;
            const drawOutsideBorder = this.params.drawOutsideBorder.value;
            const borderColor = this.params.borderColor.value;
            const primaryColor = this.params.primaryColor.value;
            const secondaryColor = this.params.secondaryColor.value;
            const primaryColorLikelihood = this.params.primaryColorLikelihood.value;
            const randomizeSecondaryColor = this.params.randomizeBHue.value;

            // Clear and initialize if needed
            context.clearRect(0, 0, width, height);
            this.initializeIfNeeded(width, height);

            // Fill background
            context.fillStyle = borderColor;
            context.rect(0, 0, width, height);
            context.fill();

            // Translate canvas if external border is present (fully present ext. border)
            const widthAdjustment = drawOutsideBorder ? vBorder : 0;
            const heightAdjustment = drawOutsideBorder ? hBorder : 0;
            context.translate(widthAdjustment / 2, heightAdjustment / 2);
            context.scale((width - widthAdjustment) / width, (height - heightAdjustment) / height);

            // Translate canvas if resized from actual structure dimensions
            // This doesn't take the above into account, so the scaling can be slightly too small
            // todo: revisit this edge case
            const widthScale = width / this.structure.fullWidth;
            const heightScale = height / this.structure.fullHeight;
            if (widthScale < heightScale) {
                const inset = (height - this.structure.fullHeight * widthScale) / 2;
                context.translate(0, inset);
                context.scale(widthScale, widthScale);
            } else {
                const inset = (width - this.structure.fullWidth * heightScale) / 2;
                context.translate(inset, 0);
                context.scale(heightScale, heightScale);
            }

            // Fill shapes
            this.structure.rects.forEach((rect) => {
                const vertices = [
                    rect.topLeft,
                    rect.topRight,
                    rect.bottomRight,
                    rect.bottomLeft
                ];
                let fillStyle;
                if (rect.primaryRandom < primaryColorLikelihood) {
                    fillStyle = primaryColor;
                } else {
                    fillStyle = randomizeSecondaryColor ? Util.hsl(rect.colorRandom, 1, 0.6) : secondaryColor;
                }
                CanvasUtil.drawShape(context, vertices, fillStyle);
            });

            // Draw boundaries
            this.structure.rects.forEach((rect) => {
                // Top
                if (drawOutsideBorder || rect.topLeft.y != 0) {
                    CanvasUtil.drawLine(context, rect.topLeft, rect.topRight, hBorder, borderColor);
                }
                // Right
                if (drawOutsideBorder || rect.topRight.x != this.structure.fullWidth) {
                    CanvasUtil.drawLine(context, rect.topRight, rect.bottomRight, vBorder, borderColor);
                }
                // Bottom
                if (drawOutsideBorder || rect.bottomRight.y != this.structure.fullHeight) {
                    CanvasUtil.drawLine(context, rect.bottomRight, rect.bottomLeft, hBorder, borderColor);
                }
                // Left
                if (drawOutsideBorder || rect.bottomLeft.x != 0) {
                    CanvasUtil.drawLine(context, rect.bottomLeft, rect.topLeft, vBorder, borderColor);
                }
            });
        };
    };
}

class RectStructure {
    constructor(
        fullWidth, fullHeight, // dimensions
        unitSize, minWidthUnits, maxWidthUnits, minHeightUnits, maxHeightUnits // configuration
    ) {
        this.fullWidth = fullWidth;
        this.fullHeight = fullHeight;
        [ // Assign all configuration instance variables:
            this.unitSize,
            this.minWidthUnits,
            this.maxWidthUnits,
            this.minHeightUnits,
            this.maxHeightUnits
        ] = this.parseConfig(unitSize, minWidthUnits, maxWidthUnits, minHeightUnits, maxHeightUnits);
        this.generateRects(new Point(0, 0));
    }

    configIsDifferent(unitSize, minWidthUnits, maxWidthUnits, minHeightUnits, maxHeightUnits) {
        const parsedConfig = this.parseConfig(unitSize, minWidthUnits, maxWidthUnits, minHeightUnits, maxHeightUnits);
        return this.unitSize != parsedConfig[0] ||
            this.minWidthUnits != parsedConfig[1] ||
            this.maxWidthUnits != parsedConfig[2] ||
            this.minHeightUnits != parsedConfig[3] ||
            this.maxHeightUnits != parsedConfig[4];
    }

    parseConfig(unitSize, minWidthUnits, maxWidthUnits, minHeightUnits, maxHeightUnits) {
        return [
            Math.floor(unitSize),
            Math.floor(minWidthUnits),
            Math.floor(Math.max(minWidthUnits, maxWidthUnits)),
            Math.floor(minHeightUnits),
            Math.floor(Math.max(minHeightUnits, maxHeightUnits))
        ];
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
            if (this.bottomOpen.length > 0) {
                const topRect = this.bottomOpen.shift();
                const newOrigin = new Point(topRect.x, topRect.y + topRect.height);
                this.addRect(newOrigin);
            }
            if (this.rightOpen.length > 0) {
                const leftRect = this.rightOpen.shift();
                const newOrigin = new Point(leftRect.x + leftRect.width, leftRect.y);
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

        return new Point(maxWidth, maxHeight);
    }
}
