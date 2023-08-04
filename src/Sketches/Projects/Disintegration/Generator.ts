import alea from 'alea';
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise';

type Point = [number, number];
type Line = [Point, Point];

const sigmoidEasing = (t: number, k: number) => {
    const sigmoidBase = (t: number, k: number) => {
        return 1.0 / (1.0 + Math.exp(-k * t)) - 0.5;
    };
    const correction = 0.5 / sigmoidBase(1.0, k);
    return correction * sigmoidBase(2.0 * t - 1.0, k) + 0.5;
};

export default class Generator {
    private noise: NoiseFunction3D;

    constructor() {
        const prng = alea(0);
        this.noise = createNoise3D(prng);
    }

    // todo: maybe reintegrate this as a parameter option
    public generateFlippy(width: number, height: number): Line[] {
        const columns = 10;
        const rows = 10;
        const columnSize = width / (columns + 1.5);
        const rowSize = width / (rows + 1.5);
        const paths: Line[] = [];

        for (let col = 0; col <= columns; col++) {
            for (let row = 0; row <= rows; row++) {
                const x = (col + 0.5) * columnSize;
                const y = (row + 0.5) * rowSize;

                // Horizontal lines
                const hAngle = ((col / columns) * Math.PI) / 2;
                const hCenter = [x + columnSize / 2, y];
                const hPoint1: Point = [
                    hCenter[0] + (Math.cos(hAngle) * columnSize) / 2,
                    hCenter[1] + (Math.sin(hAngle) * columnSize) / 2,
                ];
                const hPoint2: Point = [
                    hCenter[0] - (Math.cos(hAngle) * columnSize) / 2,
                    hCenter[1] - (Math.sin(hAngle) * columnSize) / 2,
                ];
                paths.push([hPoint1, hPoint2]);

                // Vertical lines
                const vAngle = Math.PI / 2 + ((col / columns) * Math.PI) / 2;
                const vCenter = [x, y + rowSize / 2];
                const vPoint1: Point = [
                    vCenter[0] + (Math.cos(vAngle) * rowSize) / 2,
                    vCenter[1] + (Math.sin(vAngle) * rowSize) / 2,
                ];
                const vPoint2: Point = [
                    vCenter[0] - (Math.cos(vAngle) * rowSize) / 2,
                    vCenter[1] - (Math.sin(vAngle) * rowSize) / 2,
                ];
                paths.push([vPoint1, vPoint2]);
            }
        }

        return paths;
    }

    public generate(
        origin: Point,
        size: Point,
        columns = 30,
        rows = 30,
        rotationMin = 0,
        rotationMax = Math.PI / 2,
        rotationEasing = 0.01,
        thereAndBack = false,
        noiseScaleX = 0.2,
        noiseScaleY = 0.2,
        noiseVariant = 0,
        noiseXYOffset = 0
    ): Line[] {
        const columnSize = size[0] / columns;
        const rowSize = size[1] / rows;
        const paths: Line[] = [];

        for (let col = 0; col <= columns; col++) {
            for (let row = 0; row <= rows; row++) {
                const x = origin[0] + col * columnSize;
                const y = origin[1] + row * rowSize;
                let progress = row / rows;
                if (thereAndBack) {
                    progress = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
                }
                const onset =
                    rotationMin +
                    sigmoidEasing(progress, rotationEasing) * (rotationMax - rotationMin);

                // Horizontal lines
                if (col < columns) {
                    const hAngle =
                        0 + onset * this.noise(row * noiseScaleY, col * noiseScaleX, noiseVariant);
                    const hCenter = [x + columnSize / 2, y];
                    const hPoint1: Point = [
                        hCenter[0] + (Math.cos(hAngle) * columnSize) / 2,
                        hCenter[1] + (Math.sin(hAngle) * columnSize) / 2,
                    ];
                    const hPoint2: Point = [
                        hCenter[0] - (Math.cos(hAngle) * columnSize) / 2,
                        hCenter[1] - (Math.sin(hAngle) * columnSize) / 2,
                    ];
                    paths.push([hPoint1, hPoint2]);
                }

                // Vertical lines
                if (row < rows) {
                    const vAngle =
                        Math.PI / 2 -
                        onset *
                            this.noise(
                                row * noiseScaleY,
                                col * noiseScaleX,
                                noiseVariant + noiseXYOffset
                            );
                    const vCenter = [x, y + rowSize / 2];
                    const vPoint1: Point = [
                        vCenter[0] + (Math.cos(vAngle) * rowSize) / 2,
                        vCenter[1] + (Math.sin(vAngle) * rowSize) / 2,
                    ];
                    const vPoint2: Point = [
                        vCenter[0] - (Math.cos(vAngle) * rowSize) / 2,
                        vCenter[1] - (Math.sin(vAngle) * rowSize) / 2,
                    ];
                    paths.push([vPoint1, vPoint2]);
                }
            }
        }

        return paths;
    }
}
