import CurveUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

import alea from 'alea';
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise';

interface GridConfig {
    dimensions: [number, number];
    noiseVariant: number;
}

export default class Generator {
    private noise: NoiseFunction3D;
    private noiseField: Array<Array<[number, number]>> = []; // grid of [x, y] vectors (2D noise values)

    constructor(initialConfig: GridConfig) {
        const prng = alea(0);
        this.noise = createNoise3D(prng);
    }

    private generateNoiseValues(config: GridConfig) {
        // todo: correct for aspect ratio
        const noiseField: Array<Array<[number, number]>> = [];
        for (let x = 0; x < config.dimensions[0]; x++) {
            noiseField[x] = [];
            for (let y = 0; y < config.dimensions[1]; y++) {
                noiseField[x].push([
                    this.noise(
                        x / config.dimensions[0],
                        y / config.dimensions[1],
                        config.noiseVariant
                    ),
                    this.noise(
                        x / config.dimensions[0],
                        y / config.dimensions[1],
                        config.noiseVariant + 100
                    ),
                ]);
            }
        }
        this.noiseField = noiseField;
    }

    private pathsThroughNoiseField(config: GridConfig): Path[] {
        const paths: Path[] = [];

        const numLines = 2000;
        const numPoints = 3;

        for (let lineIndex = 0; lineIndex < numLines; lineIndex++) {
            const startingPoint: [number, number] = [
                Math.random() * config.dimensions[0],
                Math.random() * config.dimensions[1],
            ];
            const points: [number, number][] = [startingPoint];
            for (let pointIndex = 0; pointIndex < numPoints; pointIndex++) {
                const lastPoint = points[points.length - 1];
                const directionX = this.noise(
                    lastPoint[0] / config.dimensions[0],
                    lastPoint[1] / config.dimensions[1],
                    config.noiseVariant
                );
                const directionY = this.noise(
                    lastPoint[0] / config.dimensions[0],
                    lastPoint[1] / config.dimensions[1],
                    config.noiseVariant + 100
                );
                const nextPoint: [number, number] = [
                    lastPoint[0] + directionX,
                    lastPoint[1] + directionY,
                ];
                points.push(nextPoint);
            }
            paths.push(CurveUtil.createBezierSpline(points));
        }
        return paths;
    }

    public generate(config: GridConfig): Path[] {
        // this.generateNoiseValues(config);
        return this.pathsThroughNoiseField(config);
    }
}
