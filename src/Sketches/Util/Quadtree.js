export default class QTNode {
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

class QTObject {
    constructor(point, object) {
        this.point = point;
        this.object = object;
    }
}
