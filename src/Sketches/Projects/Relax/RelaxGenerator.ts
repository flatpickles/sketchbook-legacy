import CurveUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

export default class RelaxGenerator {
    private generatePolygonPath(
        center: [number, number],
        radius: number,
        polygonSides: number,
        fullResolution: number,
        pointsToGenerate: number,
        pointRotationOffset: number,
        polygonPointRotationOffset: number
    ): [number, number][] {
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

    private generateCirclePath(
        center: [number, number],
        radius: number,
        fullResolution: number,
        pointsToGenerate: number,
        pointRotationOffset: number
    ): [number, number][] {
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

    public generate(
        size: [number, number],
        pathCount: number = 100,
        resolution: number = 0.5,
        inset: number = 0.1,
        polygonSides: number | undefined = 4,
        bottomPolygonRotation: number | null = -0.07,
        topPolygonRotation: number | null = null
    ): Path[] {
        // Generate constants from input
        // Adjustments computed in point offsets to maintain sharp corners
        const generationPercentage = 0.25; // 1/4 of the way around the circle
        const rotationPercentage = 0.75; // rotated into fourth quadrant (clockwise from East axis)
        const pointsPerSegment = Math.ceil(resolution * 100);
        const fullResolution = polygonSides * pointsPerSegment * 2 + 1;
        const pointsToGenerate = Math.ceil(fullResolution * generationPercentage);
        const pointRotationOffset = Math.ceil(rotationPercentage * (fullResolution - 1));

        // Constants for positioning and sizing
        const insetSize = inset * Math.min(size[0], size[1]);
        const topLeft = [insetSize, insetSize];
        const bottomRight = size.map((d) => d - insetSize);
        const radius1 = Math.min(size[0], size[1]) / 3;
        const radius2 = Math.min(size[0], size[1]) / 2;
        const center1: [number, number] = [topLeft[0], bottomRight[1]];
        const center2: [number, number] = [bottomRight[0] - radius2, topLeft[1] + radius2];

        // Inline generators for guide paths
        const polygonGenerator = (center: [number, number], radius: number, rotation: number) =>
            this.generatePolygonPath(
                center,
                radius,
                polygonSides,
                fullResolution,
                pointsToGenerate,
                pointRotationOffset,
                Math.ceil(rotation * (fullResolution - 1))
            );
        const circleGenerator = (center: [number, number], radius: number) =>
            this.generateCirclePath(
                center,
                radius,
                fullResolution,
                pointsToGenerate,
                pointRotationOffset
            );

        // Generate the two paths
        const bottomGuidePoints = bottomPolygonRotation
            ? polygonGenerator(center1, radius1, bottomPolygonRotation)
            : circleGenerator(center1, radius1);
        const topGuidePoints = topPolygonRotation
            ? polygonGenerator(center2, radius2, topPolygonRotation)
            : circleGenerator(center2, radius2);
        if (!bottomGuidePoints.length || !topGuidePoints.length)
            throw 'Guide paths should have the same length';

        // Interpolate between the paths
        const paths: Path[] = [];
        let pathFlip = false;
        for (let pathIdx = 0; pathIdx < pathCount; pathIdx++) {
            const t = pathIdx / (pathCount - 1);
            const pathPoints: [number, number][] = [];
            for (let pointIdx = 0; pointIdx < bottomGuidePoints.length; pointIdx++) {
                const point: [number, number] = [
                    bottomGuidePoints[pointIdx][0] * (1 - t) + topGuidePoints[pointIdx][0] * t,
                    bottomGuidePoints[pointIdx][1] * (1 - t) + topGuidePoints[pointIdx][1] * t,
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
