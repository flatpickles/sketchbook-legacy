// @ts-ignore - ignore unresolved import for template file
import CurveUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

export default class Generator {
    public generate(
        origin: [number, number],
        dimensions: [number, number],
        nodeCount = 10
    ): [number, number][][][] {
        const topLeftCorner: [number, number] = origin;
        const topRightCorner: [number, number] = [origin[0] + dimensions[0], origin[1]];
        const bottomRightCorner: [number, number] = [
            origin[0] + dimensions[0],
            origin[1] + dimensions[1],
        ];
        const bottomLeftCorner: [number, number] = [origin[0], origin[1] + dimensions[1]];

        // Collections of lines from each corner...
        // A is the left hand side, B is the right hand side
        // n case I want to be able to draw these out in fan order
        const topLeftLinesA: [number, number][][] = [];
        const topLeftLinesB: [number, number][][] = [];
        const topRightLinesA: [number, number][][] = [];
        const topRightLinesB: [number, number][][] = [];
        const bottomRightLinesA: [number, number][][] = [];
        const bottomRightLinesB: [number, number][][] = [];
        const bottomLeftLinesA: [number, number][][] = [];
        const bottomLeftLinesB: [number, number][][] = [];

        // Build up the lines from each corner
        const increment = [dimensions[0] / (nodeCount - 1), dimensions[1] / (nodeCount - 1)];
        for (let terminusIdx = 1; terminusIdx < nodeCount - 1; terminusIdx++) {
            const topNode: [number, number] = [terminusIdx * increment[0], 0];
            const rightNode: [number, number] = [dimensions[0], terminusIdx * increment[1]];
            const bottomNode: [number, number] = [terminusIdx * increment[0], dimensions[1]];
            const leftNode: [number, number] = [0, terminusIdx * increment[1]];

            topLeftLinesA.push([topLeftCorner, rightNode]);
            topLeftLinesB.push([topLeftCorner, bottomNode]);
            topRightLinesA.push([topRightCorner, bottomNode]);
            topRightLinesB.push([topRightCorner, leftNode]);
            bottomRightLinesA.push([bottomRightCorner, leftNode]);
            bottomRightLinesB.push([bottomRightCorner, topNode]);
            bottomLeftLinesA.push([bottomLeftCorner, topNode]);
            bottomLeftLinesB.push([bottomLeftCorner, rightNode]);
        }

        return [
            topLeftLinesA.concat(topLeftLinesB.reverse()),
            // topRightLinesA.concat(topRightLinesB.reverse()),
            bottomRightLinesA.concat(bottomRightLinesB.reverse()),
            // bottomLeftLinesA.concat(bottomLeftLinesB.reverse()),
        ];
    }
}
