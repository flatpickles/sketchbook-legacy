import CurveUtil from '../../Util/CurveUtil';
import type { Path } from 'd3-path';

export default class Generator {
    public generate(
        lineCount = 10,
        lineResolution = 20,
        radius = 1,
        center = [0, 0]
    ): Path[] {
        const latPaths: Path[] = [];
        const longPaths: Path[] = [];
        for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            const latPoints: [number, number][] = [];
            const longPoints: [number, number][] = [];
            for (
                let pointIndex = 0;
                pointIndex < lineResolution;
                pointIndex++
            ) {
                const pathProgress = pointIndex / (lineResolution - 1);
                const linesProgress = lineIndex / (lineCount - 1);

                // Latitude
                if (lineIndex > 0 && lineIndex < lineCount - 1) {
                    const latTheta = linesProgress * Math.PI;
                    const latPhi = pathProgress * Math.PI - Math.PI / 2.0;
                    const x = radius * Math.sin(latTheta) * Math.cos(latPhi);
                    const y = radius * Math.sin(latTheta) * Math.sin(latPhi);
                    const z = radius * Math.cos(latTheta);
                    latPoints.push([y + center[0], z + center[1]]);
                }

                // Longitude
                const longTheta = pathProgress * Math.PI;
                const longPhi = linesProgress * Math.PI - Math.PI / 2.0;
                const x = radius * Math.sin(longTheta) * Math.cos(longPhi);
                const y = radius * Math.sin(longTheta) * Math.sin(longPhi);
                const z = radius * Math.cos(longTheta);
                longPoints.push([y + center[0], z + center[1]]);
            }

            // Add to paths
            if (latPoints.length)
                latPaths.push(CurveUtil.createBezierSpline(latPoints));
            longPaths.push(CurveUtil.createBezierSpline(longPoints));
        }

        return [...longPaths, ...latPaths];
    }
}
