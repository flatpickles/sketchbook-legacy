// @ts-ignore - ignore unresolved import for template file
import CurveUtil from '../../Util/PathUtil';

type Point = [number, number];
type Line = [Point, Point];

export default class Generator {
    public generate(width: number, height: number): Line[] {
        const columns = 10;
        const rows = 10;

        const columnSize = width / columns;
        const rowSize = height / rows;
        const paths: Line[] = [];

        for (let col = 0; col <= columns; col++) {
            for (let row = 0; row <= rows; row++) {
                const x = col * columnSize;
                const y = row * rowSize;

                // Horizontal lines
                const hAngle = 0;
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
                const vAngle = Math.PI / 2;
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
