export class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    eq(point) {
        return this.x == point.x && this.y == point.y;
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

    sub(point) {
        return new Point(
            this.x - point.x,
            this.y - point.y
        );
    }

    toString() {
        return '(' + this.x.toString() + ', ' + this.y.toString() + ')';
    }
}

export class Rect {
    constructor(origin = new Point(), width = 0, height = 0) {
        this.origin = origin;
        this.width = width;
        this.height = height;
    }

    get x() {
        return this.origin.x;
    }

    set x(newX) {
        this.origin.x = newX;
    }

    get y() {
        return this.origin.y;
    }

    set y(newY) {
        this.origin.y = newY;
    }
}
