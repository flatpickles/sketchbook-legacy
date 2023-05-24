import CurveUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

// Configuration constants
// todo: make these configurable?
const pointsPerSegment = 100; // two segments per polygon side
const polygonSides = 4;
const generationPercentage = 0.25;
const rotationPercentage = 0.75;
const polygonRotationPercentage = -0.07;
const inset = 0.1;

// Adjustments computed in point offsets to maintain sharp corners
const fullResolution = polygonSides * pointsPerSegment * 2 + 1;
const pointsToGenerate = Math.ceil(fullResolution * generationPercentage);
const pointRotationOffset = Math.ceil(rotationPercentage * (fullResolution - 1));
const polygonPointRotationOffset = Math.ceil(polygonRotationPercentage * (fullResolution - 1));

export default class RelaxGenerator {
    private generatePolygonPath(center: [number, number], radius: number): [number, number][] {
        // Calculate points around a polygon
        const polygonPoints: [number, number][] = [];
        for (let pointIdx = 0; pointIdx < pointsToGenerate; pointIdx++) {
            // Generate polar coordinates for this point along the polygon
            // reference: https://www.youtube.com/watch?v=AoOv6bWg9lk
            const theta =
                ((pointIdx - polygonPointRotationOffset) / (fullResolution - 1)) * 2 * Math.PI;
            const polyR =
                (radius * Math.cos(Math.PI / polygonSides)) /
                Math.cos(
                    theta -
                        ((2 * Math.PI) / polygonSides) *
                            Math.floor((polygonSides * theta + Math.PI) / (2 * Math.PI))
                );

            // Correct theta for rotation(s) and convert to cartesian coordinates
            const thetaCorrection =
                ((pointRotationOffset + polygonPointRotationOffset) / (fullResolution - 1)) *
                2 *
                Math.PI;
            const point: [number, number] = [
                center[0] + polyR * Math.cos(theta + thetaCorrection),
                center[1] + polyR * Math.sin(theta + thetaCorrection),
            ];
            polygonPoints.push(point);
        }
        return polygonPoints;
    }

    private generateCirclePath(center: [number, number], radius: number): [number, number][] {
        // Calculate points around a circle
        const circlePoints: [number, number][] = [];
        for (let pointIdx = 0; pointIdx < pointsToGenerate; pointIdx++) {
            const angle = ((pointIdx + pointRotationOffset) / (fullResolution - 1)) * 2 * Math.PI;
            const point: [number, number] = [
                center[0] + radius * Math.cos(angle),
                center[1] + radius * Math.sin(angle),
            ];
            circlePoints.push(point);
        }
        return circlePoints;
    }

    public generate(size: [number, number], pathCount = 100): Path[] {
        // Constants for positioning and sizing
        const insetSize = inset * Math.min(size[0], size[1]);
        const topLeft = [insetSize, insetSize];
        const bottomRight = size.map((d) => d - insetSize);
        const radius1 = Math.min(size[0], size[1]) / 3;
        const radius2 = Math.min(size[0], size[1]) / 2;
        const center1: [number, number] = [topLeft[0], bottomRight[1]];
        const center2: [number, number] = [bottomRight[0] - radius2, topLeft[1] + radius2];

        // Generate the two paths
        const polygonPoints = this.generatePolygonPath(center1, radius1);
        const circlePoints = this.generateCirclePath(center2, radius2);
        if (!polygonPoints.length || !circlePoints.length)
            throw 'Guide paths should have the same length';

        // Interpolate between the paths
        const paths: Path[] = [];
        let pathFlip = false;
        for (let pathIdx = 0; pathIdx < pathCount; pathIdx++) {
            const t = pathIdx / (pathCount - 1);
            const pathPoints: [number, number][] = [];
            for (let pointIdx = 0; pointIdx < polygonPoints.length; pointIdx++) {
                const point: [number, number] = [
                    polygonPoints[pointIdx][0] * (1 - t) + circlePoints[pointIdx][0] * t,
                    polygonPoints[pointIdx][1] * (1 - t) + circlePoints[pointIdx][1] * t,
                ];
                pathPoints.push(point);
            }
            if (pathFlip) pathPoints.reverse();
            pathFlip = !pathFlip;
            const path = CurveUtil.createCardinalSpline(pathPoints, 0); // effectively a polyline...
            paths.push(path);
        }

        // Return the two paths
        return paths;
    }
}
