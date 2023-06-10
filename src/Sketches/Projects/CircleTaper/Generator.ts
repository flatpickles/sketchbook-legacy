// @ts-ignore - ignore unresolved import for template file
import PathUtil from '../../Util/PathUtil';
import CurveUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

export default class Generator {
    public generate(
        center: [number, number] = [4, 4],
        startingRadius = 2,
        taperRatio = 0.7,
        sideCircleCount = 10
    ): Path[] {
        const returnPaths: Path[] = [];

        // Draw center circle
        returnPaths.push(PathUtil.approximateCircle(center, startingRadius));

        // Draw tapering circles
        let currentCenterOffset = 0;
        let currentRadius = startingRadius;
        for (let circleIndex = 0; circleIndex < sideCircleCount; circleIndex++) {
            currentRadius *= taperRatio;
            currentCenterOffset += currentRadius;
            const currentCenterA: [number, number] = [center[0], center[1] + currentCenterOffset];
            const currentCenterB: [number, number] = [center[0], center[1] - currentCenterOffset];
            returnPaths.push(PathUtil.approximateCircle(currentCenterA, currentRadius));
            returnPaths.push(PathUtil.approximateCircle(currentCenterB, currentRadius));
        }

        return returnPaths;
    }
}
