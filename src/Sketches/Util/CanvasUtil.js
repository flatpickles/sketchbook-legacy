import BezierSpline from 'bezier-spline';

const DEBUG = true;

export default class CanvasUtil {
    static drawSpline(context, points, strokeWeight = 1, strokeStyle = '#000') {
        if (points.length < 3) { throw 'Spline can only be drawn with three or more points.'; }
        
        // If the spline is closed, expand with points from the opposite end
        const leadingSize = 3; // number of adjacent points for path close smoothing
        const closed = leadingSize > 0 && 
                       points[0][0] == points[points.length - 1][0] &&
                       points[0][1] == points[points.length - 1][1];
        if (closed && points.length <= 3) { throw 'Spline can only be closed with four or more points (including duplicated endpoint).'}
        if (closed) {
            // Collect leading and trailing knots, accommodating wrap-around for small paths
            let trailingIndex = 1;
            let leadingIndex = points.length - 2;
            let leadingKnots = [];
            let trailingKnots = [];
            for (let lead = 0; lead < leadingSize; lead++) {
                trailingKnots.push(points[trailingIndex]);
                leadingKnots.unshift(points[leadingIndex]);
                trailingIndex = (trailingIndex + 1) % points.length;
                leadingIndex = (leadingIndex > 0) ? (leadingIndex - 1) : (points.length - 1) ;
            }
            points = [...leadingKnots, ...points, ...trailingKnots];
        }

        // Create the spline, remove first and last curves if closed
        const spline = new BezierSpline(points);
        if (closed) {
            spline.knots = spline.knots.slice(leadingSize, -leadingSize);
            spline.curves = spline.curves.slice(leadingSize, -leadingSize);
        }

        // Create the path object and begin a path at the first knot
        const splinePath = new Path2D();
        splinePath.moveTo(spline.knots[0][0], spline.knots[0][1]);

        // Iterate through curves to each next knot
        for (let curveIdx = 0; curveIdx < spline.curves.length; curveIdx++) {
            const curve = spline.curves[curveIdx];
            splinePath.bezierCurveTo(curve[1][0], curve[1][1], curve[2][0], curve[2][1], curve[3][0], curve[3][1]);
            
            // Draw the control points (in debug mode)
            if (DEBUG) {
                context.save();
                context.lineWidth = 2;
                const indicatorSize = 4;

                // Control Line 1
                context.strokeStyle = '#f00';
                context.beginPath();
                context.moveTo(curve[0][0], curve[0][1]);
                context.lineTo(curve[1][0], curve[1][1]);
                context.stroke();

                // Control Point 1
                context.fillStyle = '#f00';
                context.beginPath();
                context.arc(curve[1][0], curve[1][1], indicatorSize, 0, 2 * Math.PI);
                context.fill();

                // Control Line 2
                context.strokeStyle = '#0f0';
                context.beginPath();
                context.moveTo(curve[3][0], curve[3][1]);
                context.lineTo(curve[2][0], curve[2][1]);
                context.stroke();

                // Control Point 2
                context.fillStyle = '#0f0';
                context.beginPath();
                context.arc(curve[2][0], curve[2][1], indicatorSize, 0, 2 * Math.PI);
                context.fill();

                context.restore();
            }
        }

        // Draw the knot points (in debug mode)
        if (DEBUG) {
            const indicatorSize = 5;
            spline.knots.forEach((knot) => {
                context.save();
                context.fillStyle = '#000';
                context.beginPath();
                context.arc(knot[0], knot[1], indicatorSize, 0, 2 * Math.PI);
                context.fill();
                context.restore();
            });
        }

        // Close (if relevant) and draw
        if (closed) splinePath.closePath();
        context.strokeStyle = strokeStyle;
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
