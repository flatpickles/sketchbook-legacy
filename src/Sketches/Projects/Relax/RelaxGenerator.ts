import CurveUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

const pointsPerSegment = 10; // two segments per polygon side
const polygonSides = 4;
const generationPercentage = 0.25;
const rotationPercentage = 0.75;
const polygonRotationPercentage = -0.07;
const inset = 0.1;

export default class RelaxGenerator {
    public generate(size: [number, number]): Path[] {
        // Constants for positioning and sizing
        const topLeft = size.map((d) => inset * d);
        const bottomRight = size.map((d) => d * (1 - inset));
        const fullResolution = polygonSides * pointsPerSegment * 2 + 1;
        const center = [topLeft[0], bottomRight[1]];
        const radius = Math.min(size[0], size[1]) / 4;

        // Adjustments computed in point offsets to maintain sharp corners
        const pointsToGenerate = Math.ceil(fullResolution * generationPercentage);
        const pointRotationOffset = Math.ceil(rotationPercentage * (fullResolution - 1));
        const polygonPointRotationOffset = Math.ceil(
            polygonRotationPercentage * (fullResolution - 1)
        );

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

        // Calculate points around a polygon
        const polygonPoints: [number, number][] = [];
        for (let pointIdx = 0; pointIdx < pointsToGenerate; pointIdx++) {
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

        // Return the two paths
        return [
            CurveUtil.createCardinalSpline(circlePoints, 1),
            CurveUtil.createCardinalSpline(polygonPoints, 0),
        ];
    }
}
