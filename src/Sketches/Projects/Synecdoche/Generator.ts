import CurveUtil from '../../Util/CurveUtil';
import type { Path } from 'd3-path';

import alea from 'alea';
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise';

export default class Generator {
    private noise: NoiseFunction3D;
    constructor() {
        const prng = alea(0);
        this.noise = createNoise3D(prng);
    }

    public generate(): Path[] {
        const longLineCount = 10;
        const longLineResolution = 30;
        const radius = 2;
        const center = [4, 4];

        const longPaths: Path[] = [];
        for (
            let longLineIndex = 0;
            longLineIndex < longLineCount;
            longLineIndex++
        ) {
            const longLinePoints: [number, number][] = [];
            for (
                let linePointIndex = 0;
                linePointIndex < longLineResolution;
                linePointIndex++
            ) {
                const thetaProgress = linePointIndex / (longLineResolution - 1);
                const phiProgress = longLineIndex / (longLineCount - 1);

                const theta = thetaProgress * Math.PI;
                const phi = phiProgress * Math.PI - Math.PI / 2.0;
                const warpedRadius =
                    radius +
                    this.noise(
                        Math.sin(theta) * Math.cos(phi),
                        Math.sin(theta) * Math.sin(phi),
                        Math.cos(theta)
                    );
                const x = warpedRadius * Math.sin(theta) * Math.cos(phi);
                const y = warpedRadius * Math.sin(theta) * Math.sin(phi);
                const z = warpedRadius * Math.cos(theta);
                longLinePoints.push([y + center[0], z + center[1]]); // upside down?
            }
            longPaths.push(CurveUtil.createBezierSpline(longLinePoints));
        }

        return longPaths;
    }
}
