// @ts-ignore - ignore unresolved import for template file
import PathUtil from '../../Util/PathUtil';
import CurveUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

const minRadius = 0.01;

export default class Generator {
    public generate(
        center: [number, number] = [4, 4],
        startingRadius = 2,
        taperRatio = 0.7,
        sideCircleCount = 10,
        forward = false,
        angleOffset = 0,
        divisionCount = 3
    ): Path[] {
        const returnPaths: Path[] = [];

        // Draw center circle
        returnPaths.push(PathUtil.approximateCircle(center, startingRadius));

        // Draw tapering circles
        let currentCenterOffset = 0;
        let currentRadius = startingRadius;
        for (let circleIndex = 0; circleIndex < sideCircleCount; circleIndex++) {
            // Adjust measurments for next iteration
            if (forward) currentCenterOffset += currentRadius;
            currentRadius *= taperRatio;
            if (!forward) currentCenterOffset += currentRadius;
            if (currentRadius < minRadius) break;

            // Draw circle trails for each division around the circle
            for (let divisionIndex = 0; divisionIndex < divisionCount; divisionIndex++) {
                const divisionProgress = divisionIndex / divisionCount;
                const divisionAngle = divisionProgress * Math.PI * 2 + angleOffset;
                const divisionCenter: [number, number] = [
                    center[0] + Math.cos(divisionAngle) * currentCenterOffset,
                    center[1] + Math.sin(divisionAngle) * currentCenterOffset,
                ];
                returnPaths.push(PathUtil.approximateCircle(divisionCenter, currentRadius));
            }
        }
        return returnPaths;
    }
}
