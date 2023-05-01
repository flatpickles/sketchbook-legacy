import BezierSpline from 'bezier-spline';

export default class CanvasUtil {
    static drawSpline(context, points, strokeWeight = 1, strokeStyle = '#000') {
        if (points.length < 2) { throw 'Spline can only be drawn with two or more points.'; }
        const closed = points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y;
        // todo - implement closed splines
    
        const spline = new BezierSpline(points);
        const splinePath = new Path2D();
        splinePath.moveTo(spline.knots[0][0], spline.knots[0][1]);
        for (let curveIdx = 0; curveIdx < spline.curves.length; curveIdx++) {
            const curve = spline.curves[curveIdx];
            splinePath.bezierCurveTo(curve[1][0], curve[1][1], curve[2][0], curve[2][1], curve[3][0], curve[3][1]);
        }
        console.log(spline);
        if (closed) splinePath.closePath();
        context.stroke(splinePath);
    }

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
