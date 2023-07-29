// @ts-ignore - ignore unresolved import for template file
import CurveUtil from '../../Util/PathUtil';

type Line = [[number, number], [number, number]];

export default class Generator {
    public generate(width: number, height: number): Line[] {
        const columns = 10;
        const rows = 10;

        const columnSize = width / columns;
        const rowSize = height / rows;
        const paths: Line[] = [];

        for (let col = 0; col <= columns; col++) {
            for (let row = 0; row <= rows; row++) {
                // Horizontal lines
                const x1 = col * columnSize;
                const x2 = (col + 1) * columnSize;
                const y = row * rowSize;
                paths.push([
                    [x1, y],
                    [x2, y],
                ]);

                // Vertical lines
                const y1 = row * rowSize;
                const y2 = (row + 1) * rowSize;
                const x = col * columnSize;
                paths.push([
                    [x, y1],
                    [x, y2],
                ]);
            }
        }

        return paths;
    }
}
