import QTNode, { QTObject } from '../src/Sketches/Util/Quadtree.js';
import { Point } from '../src/Sketches/Util/Geometry.js';

function createQuadree(width, height) {
    const nwCorner = new Point(0, 0);
    const seCorner = new Point(width, height);
    return new QTNode(nwCorner, seCorner);
}

test('initialize quadtree', () => {
    const quadtree = createQuadree(8, 8);
    expect(quadtree.width).toEqual(8);
    expect(quadtree.height).toEqual(8);
    expect(quadtree.midpoint).toEqual({x: 4, y: 4});
});

test('insert one point', () => {
    const quadtree = createQuadree(8, 8);
    const insertionPoint = new Point(2, 2);
    const insertionObject = insertionPoint.toString();
    quadtree.insert(insertionPoint, insertionPoint.toString());
    expect(quadtree.quadrants[0]).toBeInstanceOf(QTObject);
    expect(quadtree.quadrants[0].point).toBe(insertionPoint);
    expect(quadtree.quadrants[0].contents).toMatchObject([insertionObject]);
});

test('insert three different points in the same quadrant', () => {
    const quadtree = createQuadree(8, 8);
    const insertionPoint1 = new Point(1, 1);
    const insertionPoint2 = new Point(2, 2);
    quadtree.insert(insertionPoint1, insertionPoint1.toString());
    quadtree.insert(insertionPoint2, insertionPoint2.toString());

    // Check first and second insertion
    const nwQuadrant = quadtree.quadrants[0];
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
    const quadtree = createQuadree(8, 8);
    const insertionPoint = new Point(0, 0);
    quadtree.insert(insertionPoint, "first insertion");
    quadtree.insert(insertionPoint, "second insertion");
    quadtree.insert(insertionPoint, "third insertion");
    expect(quadtree.quadrants[0]).toBeInstanceOf(QTObject);
    expect(quadtree.quadrants[0].contents.length).toEqual(3);
    expect(quadtree.getAllObjects().sort()).toMatchObject([
        "first insertion",
        "second insertion",
        "third insertion"
    ].sort());
});

test('insert hella objects', () => {
    const size = 100;
    const quadtree = createQuadree(size, size);

    // Generate 10,000 float & int points
    let insertionPoints = [];
    for (let i = 0; i < 5000; i++) {
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
    const quadtree = createQuadree(8, 8);
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
})

/* todo

Test:
- search

*/