import Sketch, { SketchType } from './Base/Sketch.js';
import { FloatParam, BoolParam } from './Base/SketchParam.js';

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
            context.fillStyle = '#000';
            context.fillRect(0, 0, width, height);
            context.strokeStyle = '#FFF';
            structure.rects.forEach((rect) => {
                context.fillStyle = '#AAA';
                context.rect(rect.origin.x, rect.origin.y, rect.width, rect.height);
                context.fill();
                context.stroke();
            });
        };
    };
}

class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    gt(point) {
        return this.x > point.x && this.y > point.y;
    }

    gte(point) {
        return this.x >= point.x && this.y >= point.y;
    }

    lt(point) {
        return this.x < point.x && this.y < point.y;
    }

    lte(point) {
        return this.x <= point.x && this.y <= point.y;
    }
}

class Rect {
    constructor(origin = new Point(), width = 0, height = 0) {
        this.origin = origin;
        this.width = width;
        this.height = height;
    }
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

class QTObject {
    constructor(point, object) {
        this.point = point;
        this.object = object;
    }
}

class QTNode {
    constructor(northWestCorner, southEastCorner) {
        this.northWestCorner = northWestCorner;
        this.southEastCorner = southEastCorner;
        this.quadrants = [null, null, null, null]; // [NW, NE, SW, SE]

        // assuming top-left origin, naturally
        this.width = southEastCorner.x - northWestCorner.x;
        this.height = southEastCorner.y - northWestCorner.y;
        this.midpoint = new Point(
            northWestCorner.x + this.width/2,
            northWestCorner.y + this.height/2
        );
    }

    insert(point, object) {
        this._checkPoint(point);
        const north = (point.y < this.midpoint.y);
        const west = (point.x < this.midpoint.x);
        let currentQuadrant = this._getQuadrant(north, west);

        // If nothing exists at this position, add it
        if (!currentQuadrant) {
            const toInsert = new QTObject(point, object);
            this._setQuadrant(toInsert, north, west);
        }

        // If object exists at this position, replace with node
        else if (currentQuadrant instanceof QTObject) {
            const newNode = this._createSubQuadrant(north, west);
            newNode.insert(currentQuadrant.point, currentQuadrant.object);
        }

        // If quadrant at this position is a node, insert in that node
        else if (currentQuadrant && currentQuadrant instanceof QTNode) {
            currentQuadrant.insert(point, object);
        }
    }

    search(northWestCorner, southEastCorner) {
        // If node is fully enclosed, return all objects
        if (northWestCorner.lte(this.northWestCorner) && southEastCorner.gt(this.southEastCorner)) {
            return this.getAllObjects();
        }

        // If not, look through each quadrant
        let foundObjects = [];
        this.quadrants.forEach((quadrant) => {
            // Add enclosed quadrant objects
            if (quadrant instanceof QTObject) {
                if (northWestCorner.lte(quadrant.point) && southEastCorner.gt(quadrant.point)) {
                    foundObjects.push(quadrant.object);
                }
            }
            // Search sub-quadrants that aren't fully excluded
            else if (quadrant instanceof QTNode) {
                if (northWestCorner.lt(quadrant.southEastCorner) || southEastCorner.gte(quadrant.northWestCorner)) {
                    const quadrantObjects = quadrant.search(northWestCorner, southEastCorner);
                    foundObjects = foundObjects.concat(quadrantObjects);
                }
            }
        });
        return foundObjects;
    }

    getAllObjects() {
        let allObjects = [];
        this.quadrants.forEach((quadrant) => {
            if (quadrant instanceof QTNode) allObjects = allObjects.concat(quadrant.getAll());
            else if (quadrant instanceof QTObject) allObjects.push(quadrant.object);
        });
        return allObjects;
    }

    _createSubQuadrant(north, west) {
        // Create new QT node
        const northWestCorner = new Point(
            west ? 0 : this.midpoint.x,
            north ? 0 : this.midpoint.y
        );
        const southEastCorner = new Point(
            west ? this.midpoint.x : this.southEastCorner.x,
            north ? this.midpoint.y : this.southEastCorner.y
        );
        const newNode = new QTNode(northWestCorner, southEastCorner);

        // Store and return new QT node
        this._setQuadrant(newNode, north, west);
        return newNode;
    }

    _getQuadrant(north, west) {
        return north && west  ?  this.quadrants[0] :
               north && !west ?  this.quadrants[1] :
               !north && west ?  this.quadrants[2] :
                                 this.quadrants[3];
    }

    _setQuadrant(quadrant, north, west) {
        if (north && west)   this.quadrants[0] = quadrant;
        if (north & !west)   this.quadrants[1] = quadrant;
        if (!north && west)  this.quadrants[2] = quadrant;
        if (!north && !west) this.quadrants[3] = quadrant;
    }

    _checkPoint(point) {
        if (point.lt(this.northWestCorner) || point.gte(this.southEastCorner)) {
            throw 'point (' + point.x + ', ' + point.y + ') is outside of node bounds';
        }
    }
}