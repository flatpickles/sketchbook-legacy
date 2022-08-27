import QTNode from '../src/Sketches/Util/Quadtree.js';
import { Point } from '../src/Sketches/Util/Geometry.js';

test('initialize QTNode', () => {
    const nwCorner = new Point(0, 0);
    const seCorner = new Point(8, 8);
    const quadtree = new QTNode(nwCorner, seCorner);
    expect(quadtree.width).toBe(8);
    expect(quadtree.height).toBe(8);
    expect(quadtree.midpoint.x).toBe(4);
    expect(quadtree.midpoint.y).toBe(4);
});