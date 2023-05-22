type Polyline = [number, number][];

export default class PolylineUtil {
    // Average out points along the line which are closer than the given distance.
    public static combineNearbyPoints(polyline: Polyline, minDistance: number): Polyline {
        // todo: doesn't work well for closed polylines
        const processedPoints: Polyline = [];
        let numRecentPointsToCombine = 1; // running; 1 is status quo (no combination)

        for (const point of polyline) {
            const lastPoint: [number, number] | undefined =
                processedPoints[processedPoints.length - 1];
            if (lastPoint) {
                const distance = Math.sqrt(
                    (point[0] - lastPoint[0]) ** 2 + (point[1] - lastPoint[1]) ** 2
                );
                if (distance > minDistance) {
                    if (numRecentPointsToCombine > 1) {
                        // combine the last few points
                        const pointsToCombine = processedPoints.slice(
                            processedPoints.length - numRecentPointsToCombine
                        );
                        const average = PolylineUtil.averagePosition(pointsToCombine);
                        processedPoints.splice(
                            processedPoints.length - numRecentPointsToCombine,
                            numRecentPointsToCombine,
                            average
                        );
                        numRecentPointsToCombine = 1;
                    }
                } else {
                    numRecentPointsToCombine += 1;
                }
            }

            // Add the point to the processed array
            processedPoints.push(point);
        }
        return processedPoints;
    }

    // Create a new polyline following the input polyline, but with the points evenly spaced
    // Here "evenness" is defined as the linear distance along the original polyline; returned points
    // will not necessarily be evenly spaced in terms of x/y distance on the resulting polyline.
    public static evenlySpacePoints(
        polyline: Polyline,
        numPointsToReturn = polyline.length
    ): Polyline {
        // Input checks (todo: are these correct?)
        if (polyline.length < 2) {
            return polyline;
        }
        if (numPointsToReturn < 2) {
            throw 'Cannot create a polyline with fewer than 2 points';
        }

        // Get full distances of each segment
        const distanceToNextOriginalPoint: number[] = [];
        let totalDistance = 0;
        for (let i = 0; i < polyline.length - 1; i++) {
            const distance = Math.sqrt(
                (polyline[i + 1][0] - polyline[i][0]) ** 2 +
                    (polyline[i + 1][1] - polyline[i][1]) ** 2
            );
            distanceToNextOriginalPoint.push(distance);
            totalDistance += distance;
        }

        const stepDistance = totalDistance / (numPointsToReturn - 1);
        const evenlySpacedPoints: Polyline = [polyline[0]];

        let distanceTraveled = 0;
        let lastOriginalPointIndex = 0;
        let distanceFromLastOriginalPoint = 0;

        for (let evenPointIndex = 1; evenPointIndex < numPointsToReturn - 1; evenPointIndex++) {
            const targetDistance = evenPointIndex * stepDistance;
            let stepDistanceRemaining = stepDistance;

            // Proceed through however many original points are in range of this target distance
            while (
                distanceTraveled +
                    (distanceToNextOriginalPoint[lastOriginalPointIndex] -
                        distanceFromLastOriginalPoint) <
                targetDistance
            ) {
                distanceTraveled +=
                    distanceToNextOriginalPoint[lastOriginalPointIndex] -
                    distanceFromLastOriginalPoint;
                stepDistanceRemaining -=
                    distanceToNextOriginalPoint[lastOriginalPointIndex] -
                    distanceFromLastOriginalPoint;
                lastOriginalPointIndex += 1;
                distanceFromLastOriginalPoint = 0;
            }

            // Calculate progress values relative to original points
            const targetDistanceBetweenOriginalPoints =
                distanceFromLastOriginalPoint + stepDistanceRemaining;
            const progressBetweenOriginalPoints =
                targetDistanceBetweenOriginalPoints /
                distanceToNextOriginalPoint[lastOriginalPointIndex];

            // Find next even point position and add it to the array
            const lastOriginalPoint = polyline[lastOriginalPointIndex];
            const nextOriginalPoint = polyline[lastOriginalPointIndex + 1];
            const x =
                lastOriginalPoint[0] +
                (nextOriginalPoint[0] - lastOriginalPoint[0]) * progressBetweenOriginalPoints;
            const y =
                lastOriginalPoint[1] +
                (nextOriginalPoint[1] - lastOriginalPoint[1]) * progressBetweenOriginalPoints;
            const newPoint: [number, number] = [x, y];
            evenlySpacedPoints.push(newPoint);

            // Update distance & progress
            distanceTraveled += stepDistanceRemaining;
            distanceFromLastOriginalPoint = targetDistanceBetweenOriginalPoints;
        }

        // Add the last point and return
        evenlySpacedPoints.push(polyline[polyline.length - 1]);
        return evenlySpacedPoints;
    }

    // Average out the position of a set of points into one
    private static averagePosition(points: Polyline): [number, number] {
        const average = points.reduce(
            (sum, point) => [sum[0] + point[0], sum[1] + point[1]],
            [0, 0]
        );
        return [average[0] / points.length, average[1] / points.length];
    }
}
