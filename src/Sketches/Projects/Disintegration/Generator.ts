import alea from 'alea';
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise';

type Point = [number, number];
type Line = [Point, Point];

export default class Generator {
    private noise: NoiseFunction3D;
    private noiseField: Array<Array<[number, number]>> = []; // grid of [x, y] vectors (2D noise values)

    constructor() {
        const prng = alea(0);
        this.noise = createNoise3D(prng);
    }

    public generate(width: number, height: number): Line[] {
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
}
