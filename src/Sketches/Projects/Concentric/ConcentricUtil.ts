import CurveUtil from '../../Util/CurveUtil';
import type { Path } from 'd3-path';

import alea from 'alea';
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise';

/**
 * TODO:
 *  - Polar continuous noise
 *  - There & back mode: rough -> smooth -> rough etc.
 */

export default class ConcentricUtil {
    private noise: NoiseFunction3D;

    constructor() {
        const prng = alea(0);
        this.noise = createNoise3D(prng);
    }

    generateCirclePaths(
        dimensions = [1, 1],
        size1 = 1,
        size2 = 0.2,
        pathCount = 10,
        noiseDensity = 1,
        noiseVariant = 0,
        noiseDepth = 0.5,
        resolution = 20
    ): Path[] {
        // Calculate real dimensions from proportional inputs
        const center: [number, number] = [dimensions[0] / 2, dimensions[1] / 2];
        const minDimension = Math.min(dimensions[0], dimensions[1]) / 2;
        const maxWarble = noiseDepth * minDimension;
        const insideRadius = size1 * minDimension; // smooth side
        const outsideRadius =
            maxWarble + size2 * (minDimension - maxWarble * 2); // rough side

        // Generate paths
        const paths: Path[] = [];
        for (let pathIdx = 0; pathIdx < pathCount; pathIdx++) {
            // Calculate inputs for this circle
            const progress = pathCount > 1 ? pathIdx / (pathCount - 1) : 1;
            const incrementalRadius =
                insideRadius + (outsideRadius - insideRadius) * progress;
            const warble = progress * maxWarble;
            // Generate and add a new path
            paths.push(
                this.generateCirclePath(
                    center,
                    incrementalRadius,
                    warble,
                    noiseDensity,
                    noiseVariant,
                    resolution
                )
            );
        }
        return paths;
    }

    private generateCirclePath(
        center: [number, number],
        radius: number,
        warble: number,
        noiseDensity = 1,
        noiseVariant = 0,
        resolution = 20
    ): Path {
        const circlePoints: [number, number][] = [];
        for (let i = 0; i <= resolution; i++) {
            const modI = i % resolution;
            const angle = (modI / resolution) * Math.PI * 2;
            const normalizedNoise = this.noise(
                noiseDensity * (Math.cos(angle) + 1),
                noiseDensity * (Math.sin(angle) + 1),
                noiseVariant
            );
            const modifiedR = radius + normalizedNoise * warble;
            const x = center[0] + Math.cos(angle) * modifiedR;
            const y = center[1] + Math.sin(angle) * modifiedR;
            circlePoints.push([x, y]);
        }
        return CurveUtil.createBezierSpline(circlePoints);
    }
}
