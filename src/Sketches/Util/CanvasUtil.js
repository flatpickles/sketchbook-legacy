export default class CanvasUtil {
    static drawLine(context, pointA, pointB, strokeWeight = 1, strokeStyle = '#000') {
        if (strokeWeight <= 0) return;
        const linePath = new Path2D();
        linePath.moveTo(pointA.x, pointA.y);
        linePath.lineTo(pointB.x, pointB.y);
        context.lineWidth = strokeWeight;
        context.strokeStyle = strokeStyle;
        context.stroke(linePath);
    }

    static drawShape(context, points, fillStyle = '#fff', strokeWeight = 0, strokeStyle = '#000') {
        if (points.length < 3) { throw 'Shape can only be drawn with three or more points.'; }

        // Create a path through the input vertices
        let shapeRegion = new Path2D();
        shapeRegion.moveTo(points[0].x, points[0].y);
        for (let pointIdx = 1; pointIdx < points.length; pointIdx++) {
            const point = points[pointIdx];
            shapeRegion.lineTo(point.x, point.y);
        }
        shapeRegion.closePath();

        // Fill and stroke the region
        context.fillStyle = fillStyle;
        context.fill(shapeRegion);
        if (strokeWeight > 0) {
            context.strokeStyle = strokeStyle;
            context.stroke(shapeRegion);
        }
    }
}
