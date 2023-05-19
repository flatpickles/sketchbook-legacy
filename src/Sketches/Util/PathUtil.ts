import BezierSpline from 'bezier-spline';
import type { Path } from 'd3-path';
import { createPath } from 'canvas-sketch-util/penplot';

export default class PathUtil {
    static approximateCircle(center: [number, number], radius: number): Path {
        // todo: generalize with >4 points, as in this approach:
        // https://stackoverflow.com/a/27863181/280404

        // Implementation as described: https://stackoverflow.com/a/13338311/280404
        const controlDistance = (radius * 4 * (Math.sqrt(2) - 1)) / 3;

        const circlePoints = [
            [center[0] + radius, center[1]], // right
            [center[0], center[1] + radius], // bottom
            [center[0] - radius, center[1]], // left
            [center[0], center[1] - radius], // top
        ];
        const controlPoints = [
            [
                [center[0] + radius, center[1] - controlDistance], // right incoming
                [center[0] + radius, center[1] + controlDistance], // right outgoing
            ],
            [
                [center[0] + controlDistance, center[1] + radius], // bottom incoming
                [center[0] - controlDistance, center[1] + radius], // bottom outgoing
            ],
            [
                [center[0] - radius, center[1] + controlDistance], // left incoming
                [center[0] - radius, center[1] - controlDistance], // left outgoing
            ],
            [
                [center[0] - controlDistance, center[1] - radius], // top incoming
                [center[0] + controlDistance, center[1] - radius], // top outgoing
            ],
        ];

        const circlePath = createPath();
        circlePath.moveTo(circlePoints[0][0], circlePoints[0][1]);
        for (let i = 0; i < circlePoints.length; i++) {
            const thisIndex = i;
            const nextIndex = (i + 1) % circlePoints.length;
            circlePath.bezierCurveTo(
                controlPoints[thisIndex][1][0], // outgoing x
                controlPoints[thisIndex][1][1], // outgoing y
                controlPoints[nextIndex][0][0], // incoming x
                controlPoints[nextIndex][0][1], // incoming y
                circlePoints[nextIndex][0], // next x
                circlePoints[nextIndex][1] // next y
            );
        }
        circlePath.closePath();
        return circlePath;
    }

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
