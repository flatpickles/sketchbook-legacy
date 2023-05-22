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

    // Average out the position of a set of points into one
    private static averagePosition(points: Polyline): [number, number] {
        const average = points.reduce(
            (sum, point) => [sum[0] + point[0], sum[1] + point[1]],
            [0, 0]
        );
        return [average[0] / points.length, average[1] / points.length];
    }
}
