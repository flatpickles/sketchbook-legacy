import CurveUtil from '../../Util/CurveUtil';
import type { Path } from 'd3-path';

import alea from 'alea';
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise';

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
        thereAndBack = false,
        pathCount = 10,
        noiseDensity = 1,
        noiseVariant = 0,
        noiseDepth = 0.5,
        resolution = 20,
        lineWidth = 0.01
    ): Path[] {
        // Calculate real dimensions from proportional inputs
        const center: [number, number] = [dimensions[0] / 2, dimensions[1] / 2];
        const minDimension = Math.min(dimensions[0], dimensions[1]) / 2;

        // Calculate maximum warble (noise offset)
        // Noisy paths shouldn't be able to overflow bounds in thereAndBack mode
        let maxWarble = (noiseDepth * minDimension) / 2;
        if (thereAndBack) {
            maxWarble = Math.min(
                maxWarble,
                Math.abs(minDimension * (size1 - size2)) /
                    (size1 < size2 ? 2 : 1)
            );
        }

        // Calculate bounds
        let bound1, bound2: number;
        const halfLineWidth = lineWidth / 2;
        if (thereAndBack) {
            if (size1 < size2) {
                // rough to rough
                bound1 =
                    lineWidth / 2 +
                    maxWarble / 2 +
                    size1 * (minDimension - maxWarble - lineWidth); // inside radius
                bound2 =
                    lineWidth / 2 +
                    maxWarble / 2 +
                    size2 * (minDimension - maxWarble - lineWidth); // outside radius
            } else {
                // smooth to smooth
                bound1 = lineWidth / 2 + size1 * (minDimension - lineWidth); // outside radius
                bound2 = lineWidth / 2 + size2 * (minDimension - lineWidth); // inside radius
            }
        } else {
            // smooth to rough or rough to smooth
            bound1 = lineWidth / 2 + size1 * (minDimension - lineWidth); // smooth radius
            bound2 =
                lineWidth / 2 +
                maxWarble / 2 +
                size2 * (minDimension - maxWarble - lineWidth); // rough radius
        }

        // Accommodate line width
        // bound1 = Math.max(
        //     Math.min(bound1, minDimension - halfLineWidth),
        //     halfLineWidth
        // );
        // bound2 = Math.max(
        //     Math.min(bound2, minDimension - halfLineWidth),
        //     halfLineWidth
        // );

        // Generate paths
        const paths: Path[] = [];
        for (let pathIdx = 0; pathIdx < pathCount; pathIdx++) {
            // Calculate inputs for this circle
            const progress = pathCount > 1 ? pathIdx / (pathCount - 1) : 1;
            const warble = thereAndBack
                ? size1 < size2
                    ? maxWarble * Math.abs(progress - 0.5)
                    : maxWarble / 2 - Math.abs(progress - 0.5) * maxWarble
                : (maxWarble * progress) / 2;
            const incrementalRadius = bound1 + (bound2 - bound1) * progress;

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
