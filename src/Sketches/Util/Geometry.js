export class Point {
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

export class Rect {
    constructor(origin = new Point(), width = 0, height = 0) {
        this.origin = origin;
        this.width = width;
        this.height = height;
    }
}
