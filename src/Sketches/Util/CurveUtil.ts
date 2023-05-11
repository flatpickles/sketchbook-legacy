import BezierSpline from 'bezier-spline';
import type { Path } from 'd3-path';
import { createPath } from 'canvas-sketch-util/penplot';

export default class CurveUtil {
    static createBezierSpline(points: [number, number][]): Path {
        if (points.length < 3) {
            throw 'Spline can only be drawn with three or more points.';
        }

        // If the spline is closed, expand with points from the opposite end
        const leadingSize = 3; // number of adjacent points for path close smoothing
        const closed =
            leadingSize > 0 &&
            points[0][0] == points[points.length - 1][0] &&
            points[0][1] == points[points.length - 1][1];
        if (closed && points.length <= 3) {
            throw 'Spline can only be closed with four or more points (including duplicated endpoints).';
        }
        if (closed) {
            // Collect leading and trailing knots, accommodating wrap-around for small paths
            let trailingIndex = 1;
            let leadingIndex = points.length - 2;
            let leadingKnots: [number, number][] = [];
            let trailingKnots: [number, number][] = [];
            for (let lead = 0; lead < leadingSize; lead++) {
                trailingKnots.push(points[trailingIndex]);
                leadingKnots.unshift(points[leadingIndex]);
                trailingIndex = (trailingIndex + 1) % points.length;
                leadingIndex =
                    leadingIndex > 0 ? leadingIndex - 1 : points.length - 1;
            }
            points = [...leadingKnots, ...points, ...trailingKnots];
        }

        // Create the spline, remove first and last curves if closed
        const spline = new BezierSpline(points);
        if (closed) {
            spline.knots = spline.knots.slice(leadingSize, -leadingSize);
            spline.curves = spline.curves.slice(leadingSize, -leadingSize);
        }

        // Create path with canvas-sketch-util
        const splinePath = createPath();
        splinePath.moveTo(spline.knots[0][0], spline.knots[0][1]);
        for (let curveIdx = 0; curveIdx < spline.curves.length; curveIdx++) {
            const curve = spline.curves[curveIdx];
            splinePath.bezierCurveTo(
                curve[1][0],
                curve[1][1],
                curve[2][0],
                curve[2][1],
                curve[3][0],
                curve[3][1]
            );
        }

        // Close it if need be, and return
        if (closed) splinePath.closePath();
        return splinePath;
    }
}
