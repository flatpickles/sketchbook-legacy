import CurveUtil from '../../Util/CurveUtil';
import type { Path } from 'd3-path';

import alea from 'alea';
import { createNoise2D, type NoiseFunction2D } from 'simplex-noise';

export default class ConcentricUtil {
    private noise: NoiseFunction2D;

    constructor() {
        const prng = alea(0);
        this.noise = createNoise2D(prng);
    }

    generateCirclePaths(
        center: [number, number],
        radius: number,
        pathCount = 10,
        centerSize = 0.2,
        resolution = 30
    ): Path[] {
        const paths: Path[] = [];
        for (let pathIdx = 0; pathIdx < pathCount; pathIdx++) {
            const progress = pathIdx / (pathCount - 1);
            const incrementalRadius =
                radius * ((1 - centerSize) * progress + centerSize);
            paths.push(
                this.generateCirclePath(
                    center,
                    incrementalRadius,
                    progress,
                    resolution
                )
            );
        }
        return paths;
    }

    generateCirclePath(
        center: [number, number],
        radius: number,
        warble: number,
        resolution = 30
    ): Path {
        const circlePoints: [number, number][] = [];
        for (let i = 0; i <= resolution; i++) {
            const modI = i % resolution;
            const angle = (modI / resolution) * Math.PI * 2;
            const modifiedR = radius + this.noise(angle, 0) * warble;
            const x = center[0] + Math.cos(angle) * modifiedR;
            const y = center[1] + Math.sin(angle) * modifiedR;
            circlePoints.push([x, y]);
        }
        return CurveUtil.createBezierSpline(circlePoints);
    }
}
