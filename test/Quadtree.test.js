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
    expect(quadtree.getAllObjects().sort()).toMatchObject([
        "first insertion",
        "second insertion",
        "third insertion"
    ].sort());
});


/* todo

Test:
- inserting hella stuff
- exceptions
- search

*/