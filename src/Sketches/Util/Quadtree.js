import { Point } from './Geometry.js';

/* todo:

- documentation
- node removal

*/

export default class Quadtree {
    constructor(width, height) {
        this.root = new QTNode(
            new Point(0, 0),
            new Point(width, height)
        );
    }

    insert(point, object) {
        this.root.insert(point, object);
    }

    search(northWestCorner, southEastCorner) {
        return this.root.search(northWestCorner, southEastCorner);
    }

    getAllObjects() {
        return this.root.getAllObjects();
    }
}

export class QTNode {
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
        if (!point.lt(this.southEastCorner) || !point.gte(this.northWestCorner)) {
            throw point.toString() + ' is outside of node bounds';
        }

        // Get whatever exists at this quadrant position
        const north = (point.y < this.midpoint.y);
        const west = (point.x < this.midpoint.x);
        let currentQuadrant = this._getQuadrant(north, west);

        // If nothing exists at this position, add it
        if (!currentQuadrant) {
            const toInsert = new QTObject(point, object);
            this._setQuadrant(toInsert, north, west);
        }

        // If object exists at this position, add to or replace w/ node
        else if (currentQuadrant instanceof QTObject) {
            const existingContents = currentQuadrant;
            // If insertion point is equal to existing point, add to that content obj
            if (existingContents.point.eq(point)) {
                existingContents.add(object);
            }
            // If insertion point is different, replace w/ new quadrant & insert existing content
            else {
                currentQuadrant = this._createSubQuadrant(north, west);
                existingContents.contents.forEach((contentObj) => {
                    currentQuadrant.insert(existingContents.point, contentObj);
                });
            }
        }

        // If quadrant at this position is a node, insert in that node
        if (currentQuadrant && currentQuadrant instanceof QTNode) {
            currentQuadrant.insert(point, object);
        }
    }

    search(northWestCorner, southEastCorner) {
        if (!northWestCorner.lte(southEastCorner)) {
            throw 'both dimensions of NW corner must be less than or equal to SE corner';
        }

        // If node is fully enclosed, return all objects
        if (northWestCorner.lte(this.northWestCorner) && southEastCorner.gte(this.southEastCorner)) {
            return this.getAllObjects();
        }

        // If not, look through each quadrant
        let foundObjects = [];
        this.quadrants.forEach((quadrant) => {
            // Add enclosed quadrant objects
            if (quadrant instanceof QTObject) {
                if (northWestCorner.lte(quadrant.point) && southEastCorner.gte(quadrant.point)) {
                    foundObjects = foundObjects.concat(quadrant.contents);
                }
            }
            // Search sub-quadrants that aren't fully excluded
            else if (quadrant instanceof QTNode) {
                if (northWestCorner.lte(quadrant.southEastCorner) || southEastCorner.gte(quadrant.northWestCorner)) {
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
            if (quadrant instanceof QTNode) allObjects = allObjects.concat(quadrant.getAllObjects());
            else if (quadrant instanceof QTObject) allObjects = allObjects.concat(quadrant.contents);
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
}

export class QTObject {
    constructor(point, object) {
        this.point = point;
        this.contents = [object];
    }

    add(object) {
        this.contents.push(object);
    }
}
