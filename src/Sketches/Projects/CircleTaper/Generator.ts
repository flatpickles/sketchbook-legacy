// @ts-ignore - ignore unresolved import for template file
import PathUtil from '../../Util/PathUtil';
import CurveUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

const minRadius = 0.001;

type Circle = {
    center: [number, number];
    radius: number;
};

export default class Generator {
    public generate(
        topLeft: [number, number],
        bottomRight: [number, number],
        taperRatio = 0.7,
        sideCircleCount = 10,
        expandedForm = false,
        angleOffset = 0,
        divisionCount = 3
    ): Path[] {
        // Calculate tapering circle values from a unit circle centered at [0, 0]
        const relativeCircles: Circle[] = [];

        // Start with center circle
        relativeCircles.push({ center: [0, 0], radius: 0.5 });

        // Calculate tapering circles
        let currentCenterOffset = 0;
        let currentRadius = 0.5;
        let topLeftBound: [number, number] = [-0.5, -0.5];
        let bottomRightBound: [number, number] = [0.5, 0.5];
        for (let circleIndex = 0; circleIndex < sideCircleCount; circleIndex++) {
            // Adjust measurements for next iteration
            if (expandedForm) currentCenterOffset += currentRadius;
            currentRadius *= taperRatio;
            if (!expandedForm) currentCenterOffset += currentRadius;
            if (currentRadius < minRadius) break;

            // Draw circle trails for each division around the circle
            for (let divisionIndex = 0; divisionIndex < divisionCount; divisionIndex++) {
                // Calculate and add circle
                const divisionProgress = divisionIndex / divisionCount;
                const divisionAngle = divisionProgress * Math.PI * 2 + angleOffset;
                const divisionCenter: [number, number] = [
                    Math.cos(divisionAngle) * currentCenterOffset,
                    Math.sin(divisionAngle) * currentCenterOffset,
                ];
                relativeCircles.push({ center: divisionCenter, radius: currentRadius });
                // Update bounds
                topLeftBound = [
                    Math.min(topLeftBound[0], divisionCenter[0] - currentRadius),
                    Math.min(topLeftBound[1], divisionCenter[1] - currentRadius),
                ];
                bottomRightBound = [
                    Math.max(bottomRightBound[0], divisionCenter[0] + currentRadius),
                    Math.max(bottomRightBound[1], divisionCenter[1] + currentRadius),
                ];
            }
        }

        // Calculate scaling factor to fit the circles within the bounds
        const boundsWidth = bottomRight[0] - topLeft[0];
        const boundsHeight = bottomRight[1] - topLeft[1];
        const designWidth = bottomRightBound[0] - topLeftBound[0];
        const designHeight = bottomRightBound[1] - topLeftBound[1];
        const scale = Math.min(boundsWidth / designWidth, boundsHeight / designHeight);
        const centerRatios = [-topLeftBound[0] / designWidth, -topLeftBound[1] / designHeight];
        const center: [number, number] = [
            centerRatios[0] * designWidth * scale,
            centerRatios[1] * designHeight * scale,
        ];

        // todo: properly handle designs that aren't perfectly centered

        // Scale and translate circles to fit within the bounds
        const returnPaths: Path[] = [];
        for (const circle of relativeCircles) {
            const scaledCenter: [number, number] = [
                center[0] + circle.center[0] * scale,
                center[1] + circle.center[1] * scale,
            ];
            const scaledRadius = circle.radius * scale;
            returnPaths.push(PathUtil.approximateCircle(scaledCenter, scaledRadius));
        }

        return returnPaths;
    }
}
