import Quadtree, { QTNode, QTObject } from '../src/Sketches/Util/Quadtree.js';
import { Point } from '../src/Sketches/Util/Geometry.js';

/******* HELPERS *******/

function generateRandomPoints(numPoints, size) {
    let insertionPoints = [];
    for (let i = 0; i < numPoints/2; i++) {
        const randomFloatPoint = new Point(
            Math.random() * size,
            Math.random() * size
        );
        insertionPoints.push(randomFloatPoint);
        const randomIntPoint = new Point(
            Math.floor(Math.random() * size),
            Math.floor(Math.random() * size)
        );
        insertionPoints.push(randomIntPoint);
    }
    return insertionPoints;
}

function insertIntPointsEvenly(quadtree, size) {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const insertionPoint = new Point(x, y);
            quadtree.insert(insertionPoint, insertionPoint.toString());
        }
    }
}

function generateExpectedPoints(northWestCorner, southEastCorner) {
    let expectedPoints = [];
    for (let y = Math.ceil(northWestCorner.y); y <= Math.floor(southEastCorner.y); y++) {
        for (let x = Math.ceil(northWestCorner.x); x <= Math.floor(southEastCorner.x); x++) {
            expectedPoints.push(new Point(x, y));
        }
    }
    return expectedPoints;
}

/******* TESTS *******/

test('initialize quadtree', () => {
    const quadtree = new Quadtree(8, 8);
    expect(quadtree.root.width).toEqual(8);
    expect(quadtree.root.height).toEqual(8);
    expect(quadtree.root.midpoint).toEqual({x: 4, y: 4});
});

test('insert one point', () => {
    const quadtree = new Quadtree(8, 8);
    const insertionPoint = new Point(2, 2);
    const insertionObject = insertionPoint.toString();
    quadtree.insert(insertionPoint, insertionPoint.toString());
    expect(quadtree.root.quadrants[0]).toBeInstanceOf(QTObject);
    expect(quadtree.root.quadrants[0].point).toBe(insertionPoint);
    expect(quadtree.root.quadrants[0].contents).toMatchObject([insertionObject]);
});

test('insert three different points in the same quadrant', () => {
    const quadtree = new Quadtree(8, 8);
    const insertionPoint1 = new Point(1, 1);
    const insertionPoint2 = new Point(2, 2);
    quadtree.insert(insertionPoint1, insertionPoint1.toString());
    quadtree.insert(insertionPoint2, insertionPoint2.toString());

    // Check first and second insertion
    const nwQuadrant = quadtree.root.quadrants[0];
    expect(nwQuadrant).toBeInstanceOf(QTNode);
    expect(nwQuadrant.quadrants[0]).toBeInstanceOf(QTObject);

    // Check third insertion
    const insertionPoint3 = new Point(0, 0);
    quadtree.insert(insertionPoint3, insertionPoint3.toString());
    expect(nwQuadrant.quadrants[0]).toBeInstanceOf(QTNode);
    expect(nwQuadrant.quadrants[0].quadrants[0]).toBeInstanceOf(QTObject);

    // Check contents (order doesn't matter)
    expect(quadtree.getAllObjects().sort()).toMatchObject([
        insertionPoint1.toString(),
        insertionPoint2.toString(),
        insertionPoint3.toString()
    ].sort());
});

test('insert multiple objects at the same point', () => {
    const quadtree = new Quadtree(8, 8);
    const insertionPoint = new Point(0, 0);
    quadtree.insert(insertionPoint, "first insertion");
    quadtree.insert(insertionPoint, "second insertion");
    quadtree.insert(insertionPoint, "third insertion");
    expect(quadtree.root.quadrants[0]).toBeInstanceOf(QTObject);
    expect(quadtree.root.quadrants[0].contents.length).toEqual(3);
    expect(quadtree.getAllObjects().sort()).toMatchObject([
        "first insertion",
        "second insertion",
        "third insertion"
    ].sort());
});

test('insert hella objects', () => {
    const size = 100;
    const quadtree = new Quadtree(size, size);

    // Generate 10,000 float & int points
    const insertionPoints = generateRandomPoints(10000, size);

    // Add all the points
    insertionPoints.forEach((point) => {
        quadtree.insert(point, point.toString());
    })

    // Check size and contents
    const allObjects = quadtree.getAllObjects();
    expect(allObjects.length).toEqual(insertionPoints.length);
    expect(allObjects.sort()).toMatchObject(
        insertionPoints.map(point => point.toString()).sort()
    );
});

test('insert throws an error if point is out of bounds', () => {
    const size = 8;
    const quadtree = new Quadtree(size, size);
    const testObj = "Test object.";
    const justBarelyOut1 = new Point(8, 8);
    const justBarelyOut2 = new Point(-0.01, -0.01);
    const wayOut1 = new Point(size * 2, size / 2);
    const wayOut2 = new Point(size / 2, size * 2);
    const wayOut3 = new Point(size - 1, -size / 2);
    const wayOut4 = new Point(-size / 2, size - 1);
    expect(() => quadtree.insert(justBarelyOut1, testObj)).toThrow();
    expect(() => quadtree.insert(justBarelyOut2, testObj)).toThrow();
    expect(() => quadtree.insert(wayOut1, testObj)).toThrow();
    expect(() => quadtree.insert(wayOut2, testObj)).toThrow();
    expect(() => quadtree.insert(wayOut3, testObj)).toThrow();
    expect(() => quadtree.insert(wayOut4, testObj)).toThrow();
});

test('searching full bounds returns all objects', () => {
    const size = 8;
    const quadtree = new Quadtree(size, size);
    const insertionPoints = generateRandomPoints(100, size);
    insertionPoints.forEach((point) => {
        quadtree.insert(point, point.toString());
    });

    const searchBoundNW = new Point(0, 0);
    const searchBoundSE = new Point(size, size);
    const searchResults = quadtree.search(searchBoundNW, searchBoundSE);
    expect(searchResults.sort()).toMatchObject(
        insertionPoints.map(point => point.toString()).sort()
    );
});

test('searching within odd sized quadtree returns expected subsets', () => {
    const size = 47;
    const quadtree = new Quadtree(size, size);

    // Insert points evenly distributed throughout
    insertIntPointsEvenly(quadtree, size);

    // Test a precision search
    const precisionSearch = new Point(15, 15);
    const precisionResult = quadtree.search(
        precisionSearch,
        precisionSearch
    );
    expect(precisionResult.length).toEqual(1);
    expect(precisionResult[0]).toEqual(precisionSearch.toString());

    // Test a few randomized searches
    for (let testNum = 0; testNum < 100; testNum++) {
        const targetedSearchNW = new Point(
            Math.random() * size,
            Math.random() * size
        );
        const targetedSearchSE = new Point(
            targetedSearchNW.x + Math.random() * (size - targetedSearchNW.x),
            targetedSearchNW.y + Math.random() * (size - targetedSearchNW.y)
        );
        let expectedPoints = generateExpectedPoints(targetedSearchNW, targetedSearchSE);
        const targetedResults = quadtree.search(
            targetedSearchNW,
            targetedSearchSE
        );
        expect(targetedResults.length).toEqual(expectedPoints.length);
        expect(targetedResults.sort()).toMatchObject(
            expectedPoints.map(point => point.toString()).sort()
        );
    }
});

test('searching points on node boundaries returns expected subsets', () => {
    const size = 8;
    const quadtree = new Quadtree(size, size);

    // Insert points evenly distributed throughout
    insertIntPointsEvenly(quadtree, size);

    // Test a targeted search
    const targetedSearchNW = new Point(2, 2);
    const targetedSearchSE = new Point(6, 6);
    let expectedPoints = generateExpectedPoints(targetedSearchNW, targetedSearchSE);
    const targetedResults = quadtree.search(
        targetedSearchNW,
        targetedSearchSE
    );
    expect(targetedResults.length).toEqual(expectedPoints.length);
    expect(targetedResults.sort()).toMatchObject(
        expectedPoints.map(point => point.toString()).sort()
    );
});

test('searching among duplicate points returns expected subsets', () => {
    const size = 17;
    const quadtree = new Quadtree(size, size);

    // Insert points evenly distributed throughout
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const insertionPoint = new Point(x, y);
            quadtree.insert(insertionPoint, insertionPoint.toString());
            if (x % 2 == 0 && y % 2 == 1) {
                quadtree.insert(insertionPoint, insertionPoint.toString());
            }
        }
    }

    // Test a targeted search
    const targetedSearchNW = new Point(2, 7);
    const targetedSearchSE = new Point(6, 12);
    let expectedPoints = [];
    for (let y = targetedSearchNW.y; y <= targetedSearchSE.y; y++) {
        for (let x = targetedSearchNW.x; x <= targetedSearchSE.x; x++) {
            expectedPoints.push(new Point(x, y));
            if (x % 2 == 0 && y % 2 == 1) {
                expectedPoints.push(new Point(x, y));
            }
        }
    }
    const targetedResults = quadtree.search(
        targetedSearchNW,
        targetedSearchSE
    );
    expect(targetedResults.length).toEqual(expectedPoints.length);
    expect(targetedResults.sort()).toMatchObject(
        expectedPoints.map(point => point.toString()).sort()
    );
});

test('searching invalid bounds throws an error', () => {
    const size = 8;
    const quadtree = new Quadtree(size, size);
    const point1 = new Point(1, 1);
    const point2 = new Point(3, 3);
    const point3 = new Point(1, 3);
    const point4 = new Point(3, 1);
    expect(() => quadtree.search(point2, point1)).toThrow();
    expect(() => quadtree.search(point3, point1)).toThrow();
    expect(() => quadtree.search(point4, point1)).toThrow();
    expect(() => quadtree.search(point4, point3)).toThrow();
    expect(() => quadtree.search(point3, point4)).toThrow();
});
