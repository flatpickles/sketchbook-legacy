// @ts-ignore - ignore unresolved import for template file
import PathUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

const minRadius = 0.01;

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
        let designRadius = 0.5;
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
                // Update bound calculation
                designRadius = Math.max(designRadius, currentCenterOffset + currentRadius);
            }
        }

        // Calculate scaling factor to fit the circles within the bounds
        const boundsWidth = bottomRight[0] - topLeft[0];
        const boundsHeight = bottomRight[1] - topLeft[1];
        const scale = Math.min(boundsWidth / (designRadius * 2), boundsHeight / (designRadius * 2));
        const center: [number, number] = [
            topLeft[0] + boundsWidth / 2,
            topLeft[1] + boundsHeight / 2,
        ];

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