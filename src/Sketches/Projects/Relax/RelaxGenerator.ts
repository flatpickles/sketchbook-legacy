import CurveUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

export default class RelaxGenerator {
    public generate(size: [number, number], polygonSides = 4, pointsPerSide = 8): Path[] {
        const resolution = polygonSides * pointsPerSide * 2 + 1;
        const center = size.map((d) => d / 2);
        const radius = Math.min(size[0], size[1]) / 4;

        const rotation = ((Math.PI * 2) / (resolution - 1)) * 4; // sharp corners
        const circlePoints: [number, number][] = [];
        for (let pointIdx = 0; pointIdx < resolution / 3; pointIdx++) {
            const angle = (pointIdx / (resolution - 1)) * 2 * Math.PI;
            const point: [number, number] = [
                center[0] + radius * Math.cos(angle + rotation),
                center[1] + radius * Math.sin(angle + rotation),
            ];
            circlePoints.push(point);
        }

        const polygonRotationOffset = ((Math.PI * 2) / (resolution - 1)) * 2;
        const polygonPoints: [number, number][] = [];
        for (let pointIdx = 0; pointIdx < resolution / 3; pointIdx++) {
            // reference: https://www.youtube.com/watch?v=AoOv6bWg9lk
            const theta =
                (pointIdx / (resolution - 1)) * 2 * Math.PI + rotation - polygonRotationOffset;
            const polyR =
                (radius * Math.cos(Math.PI / polygonSides)) /
                Math.cos(
                    theta -
                        ((2 * Math.PI) / polygonSides) *
                            Math.floor((polygonSides * theta + Math.PI) / (2 * Math.PI))
                );

            const point: [number, number] = [
                center[0] + polyR * Math.cos(theta + polygonRotationOffset),
                center[1] + polyR * Math.sin(theta + polygonRotationOffset),
            ];
            polygonPoints.push(point);
        }

        return [
            CurveUtil.createCardinalSpline(circlePoints, 1),
            CurveUtil.createCardinalSpline(polygonPoints, 0),
        ];
    }
}
