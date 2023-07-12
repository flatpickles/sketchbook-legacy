// @ts-ignore - ignore unresolved import for template file
import type { Path } from 'd3-path';
import PathUtil from '../../Util/PathUtil';

import alea from 'alea';
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise';

type Point = [number, number];

export default class Generator {
    private noise: NoiseFunction3D;

    constructor() {
        const prng = alea(0);
        this.noise = createNoise3D(prng);
    }

    public generateRays(center: Point, radius: number, rayCount = 20): Path[] {
        const rays: Path[] = [];
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            const ray = this.generateRay(center, radius, angle);
            rays.push(PathUtil.createCardinalSpline(ray, 1));
        }
        return rays;
    }

    private generateRay(center: Point, radius: number, angle: number, curve = 10): Point[] {
        const rayPath = [center];
        const rayPointCount = 80;
        const curveIncrement = curve / rayPointCount;
        const noiseDensity = 0.05;

        for (let i = 0; i <= rayPointCount; i++) {
            const r = radius * (i / rayPointCount);
            const normalizedNoise = this.noise(
                noiseDensity * (Math.cos(angle) + 6),
                noiseDensity * (Math.sin(angle) + 1),
                (noiseDensity * i) / 3
            );

            const rayPoint: Point = [
                center[0] + Math.cos(angle + normalizedNoise) * r,
                center[1] + Math.sin(angle + normalizedNoise) * r,
            ];
            rayPath.push(rayPoint);
        }
        return rayPath;
    }
}
