import Random from 'canvas-sketch-util/random';
import Color from 'canvas-sketch-util/color';

import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam, EventParam, ColorParam } from './Base/SketchParam.js';

import Quadtree from './Util/Quadtree.js';
import CanvasUtil from './Util/CanvasUtil.js';
import { Point, Rect } from './Util/Geometry.js';

export default class Rectangles extends Sketch {
    name = 'Rectangles';
    type = SketchType.Canvas;
    // date = new Date('8/24/2022');
    description = `
        Randomly sized rectangles, fit together edge-to-edge, with configurable color palettes. This can generate patterns in a Mondrian-like style, and can achieve many other looks as well.
    `;

    params = {
        fillWidth: new FloatParam('Total Width', 1, 0, 1, 0.01, false,
            'Maximum percentage of canvas width that will be filled with rectangles.'),
        fillHeight: new FloatParam('Total Height', 1, 0, 1, 0.01, false,
            'Maximum percentage of canvas height that will be filled with rectangles.'),
        horizontalBorderSize: new FloatParam('H Border Px', 1, 0, 30, 1, true,
            'Size of rectangle top/bottom borders, in pixels.'),
        verticalBorderSize: new FloatParam('V Border Px', 1, 0, 30, 1, true,
            'Size of rectangle left/right borders, in pixels.'),

        borderColor: new ColorParam('BG Color', '#000',
            'Color of the background, and the borders between rectangles.'),
        primaryColor: new ColorParam('Rect Color A', '#239cd1',
            'Primary rectangle color, applied randomly to a subset of shapes.'),
        primaryColorLikelihood: new FloatParam('A Likelihood', 0.5, 0, 1, 0.01, true,
            'Likelihood of each rectangle being the primary color, i.e. rough percentage of primary color coverage.'),
        secondaryColor: new ColorParam('Rect Color B', '#fd221c',
            'Secondary rectangle color, applied to non-primary shapes.'),
        randomizeBHue: new BoolParam('Random B Hue', false,
            'Randomize secondary color hue in HSV color space. Saturation & value are still respected.'),
        newColors: new EventParam('New Colors', this.newColors.bind(this),
            'Regenerate colors, preserving the current shapes.'),

        unitSize: new FloatParam('Unit Size Px', 20, 10, 100, 1, false,
            'Unit size in pixels. Rectangle size will be set in increments of this unit.'),
        maxWidthUnits: new FloatParam('H Max Units', 15, 1, 30, 1, false,
            'Maximum number of units used for the width of each rectangle.'),
        maxHeightUnits: new FloatParam('V Max Units', 15, 1, 30, 1, false,
            'Maximum number of units used for the height of each rectangle.'),
        newShapes: new EventParam('New Shapes', this.newShapes.bind(this),
            'Regenerate shapes. As a side effect, colors will also be regenerated.'),
    };

    structure = undefined;
    initializationNeeded = true;
    initializeIfNeeded(width, height) {
        // Check params to see if initialization is needed
        if (this.structure) {
            const paramsUpdated = this.structure.configIsDifferent(
                this.params.unitSize.value,
                this.params.maxWidthUnits.value,
                this.params.maxHeightUnits.value,
                this.params.fillWidth.value,
                this.params.fillHeight.value);
            this.initializationNeeded = this.initializationNeeded || paramsUpdated;
        }

        // Initialize!
        if (this.initializationNeeded) {
            this.structure = new RectStructure(
                width,
                height,
                this.params.unitSize.value,
                this.params.maxWidthUnits.value,
                this.params.maxHeightUnits.value,
                this.params.fillWidth.value,
                this.params.fillHeight.value);
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
            const borderColor = this.params.borderColor.value;
            const primaryColor = this.params.primaryColor.value;
            const secondaryColor = this.params.secondaryColor.value;
            const primaryColorLikelihood = this.params.primaryColorLikelihood.value;
            const randomizeSecondaryColor = this.params.randomizeBHue.value;

            // Clear and initialize if needed
            this.initializeIfNeeded(width, height);
            context.fillStyle = borderColor;
            context.rect(0, 0, width, height);
            context.fill();

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
                } else if (!randomizeSecondaryColor) {
                    fillStyle = secondaryColor;
                } else {
                    const secondaryHSL = Color.parse(secondaryColor).hsl;
                    fillStyle = 'hsl(' + rect.colorRandom * 360 + ', ' + secondaryHSL[1] + '%, ' + secondaryHSL[2] + '%)';
                }
                CanvasUtil.drawShape(context, vertices, fillStyle);
            });

            // Draw boundaries only when not filling full height/width
            const topLeft = new Point(0, 0);
            const bottomRight = new Point(width, height);
            this.structure.rects.forEach((rect) => {
                // Top
                if (rect.topLeft.y != topLeft.y) {
                    CanvasUtil.drawLine(context, rect.topLeft, rect.topRight, hBorder, borderColor);
                }
                // Right
                if (rect.topRight.x != bottomRight.x) {
                    CanvasUtil.drawLine(context, rect.topRight, rect.bottomRight, vBorder, borderColor);
                }
                // Bottom
                if (rect.bottomRight.y != bottomRight.y) {
                    CanvasUtil.drawLine(context, rect.bottomRight, rect.bottomLeft, hBorder, borderColor);
                }
                // Left
                if (rect.bottomLeft.x != topLeft.x) {
                    CanvasUtil.drawLine(context, rect.bottomLeft, rect.topLeft, vBorder, borderColor);
                }
            });
        };
    };
}

class RectStructure {
    constructor(
        fullWidth, fullHeight, // dimensions
        unitSize, maxWidthUnits, maxHeightUnits, // configuration (units)
        fillWidth, fillHeight // configuration (ratios)
    ) {
        this.fullWidth = fullWidth;
        this.fullHeight = fullHeight;
        [ // Assign all configuration instance variables:
            this.unitSize,
            this.maxWidthUnits,
            this.maxHeightUnits,
            this.fillWidth,
            this.fillHeight
        ] = this.parseConfig(unitSize, maxWidthUnits, maxHeightUnits, fillWidth, fillHeight);
        this.edgeToEdge = true; // No param for now; fill full space when fillWidth or fillHeight are full
        this.generateRects(this.internalTopLeft);
    }

    get internalWidth() {
        const scaledWidth = this.fullWidth * this.fillWidth;
        const adjustWidth = this.fillWidth != 1 || !this.edgeToEdge;
        const unitOverflow = adjustWidth ? scaledWidth % this.unitSize : 0;
        return scaledWidth - unitOverflow;
    }

    get internalHeight() {
        const scaledHeight = this.fullHeight * this.fillHeight;
        const adjustHeight = this.fillHeight != 1 || !this.edgeToEdge;
        const unitOverflow = adjustHeight ? scaledHeight % this.unitSize : 0;
        return scaledHeight - unitOverflow;
    }

    get internalTopLeft() {
        return new Point(
            Math.floor((this.fullWidth - this.internalWidth) / 2),
            Math.floor((this.fullHeight - this.internalHeight) / 2)
        );
    }

    get internalBottomRight() {
        const topLeft = this.internalTopLeft;
        return new Point(
            this.fullWidth - topLeft.x,
            this.fullHeight - topLeft.y
        );
    }

    configIsDifferent(unitSize, maxWidthUnits, maxHeightUnits, fillWidth, fillHeight) {
        const parsedConfig = this.parseConfig(unitSize, maxWidthUnits, maxHeightUnits, fillWidth, fillHeight);
        return this.unitSize != parsedConfig[0] ||
            this.maxWidthUnits != parsedConfig[1] ||
            this.maxHeightUnits != parsedConfig[2] ||
            this.fillWidth != parsedConfig[3] ||
            this.fillHeight != parsedConfig[4];
    }

    parseConfig(unitSize, maxWidthUnits, maxHeightUnits, fillWidth, fillHeight) {
        return [
            Math.floor(unitSize),
            Math.floor(maxWidthUnits),
            Math.floor(maxHeightUnits),
            fillWidth,
            fillHeight
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
        const minWidthUnits = 1;
        const maxWidthUnits = this.maxWidthUnits;
        const widthRemaining = this.internalBottomRight.x - fromPoint.x;
        let width = Math.min(
            widthRemaining,
            maxRectSize.x,
            this.unitSize * Random.rangeFloor(minWidthUnits, maxWidthUnits)
        );
        const widthLeftover = this.internalBottomRight.x - (fromPoint.x + width);
        if (widthLeftover < this.unitSize * minWidthUnits) {
            width += widthLeftover;
        }

        // Calculate height for next rect
        const minHeightUnits = 1;
        const maxHeightUnits = this.maxHeightUnits;
        const heightRemaining = this.internalBottomRight.y - fromPoint.y;
        let height = Math.min(
            heightRemaining,
            maxRectSize.y,
            this.unitSize * Random.rangeFloor(minHeightUnits, maxHeightUnits)
        );
        const heightLeftover = this.internalBottomRight.y - (fromPoint.y + height);
        if (heightLeftover < this.unitSize * minHeightUnits) {
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
