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
                context.fillStyle = '#777';
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
        let currentChild = this._getChild(north, west);

        // if nothing at this position, add it
        if (!currentChild) {
            const toInsert = new QTObject(point, object);
            this._setChild(toInsert, north, west);
        }

        // if object exists at this position, replace with node
        else if (currentChild instanceof QTObject) {
            const newNode = this._createSubNode(north, west);
            newNode.insert(currentChild.point, currentChild.object);
        }

        // if child at this position is a node, insert in that node
        else if (currentChild && currentChild instanceof QTNode) {
            currentChild.insert(point, object);
        }
    }

    search(northWestCorner, southEastCorner) {
        // todo
    }

    get(point) {
        this._checkPoint(point);
        const north = (point.y < this.midpoint.y);
        const west = (point.x < this.midpoint.x);
        const objOrNode = this._getChild(north, west);
        return (objOrNode instanceof QTNode) ? objOrNode.get(point) : objOrNode;
    }

    _createSubNode(north, west) {
        // create new QT node
        const northWestCorner = new Point(
            west ? 0 : this.midpoint.x,
            north ? 0 : this.midpoint.y
        );
        const southEastCorner = new Point(
            west ? this.midpoint.x : this.southEastCorner.x,
            north ? this.midpoint.y : this.southEastCorner.y
        );
        const newNode = new QTNode(northWestCorner, southEastCorner);

        // store and return new QT node
        this._setChild(newNode, north, west);
        return newNode;
    }

    _getChild(north, west) {
        const objOrNode = 
            north && west  ?  this.northWest :
            north && !west ?  this.northEast :
            !north && west ?  this.southWest :
                              this.southEast;
        return objOrNode;
    }

    _setChild(child, north, west) {
        if (north && west)   this.northWest = child;
        if (north & !west)   this.northEast = child;
        if (!north && west)  this.southWest = child;
        if (!north && !west) this.southEast = child;
    }

    _checkPoint(point) {
        if (point.x < this.northWestCorner.x || point.x >= this.southEastCorner.x) {
            throw "point.x is outside of node bounds";
        }
        if (point.y < this.northWestCorner.y || point.y >= this.northWestCorner.y) {
            throw "point.y is outside of node bounds";
        }
    }
}