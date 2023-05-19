// @ts-ignore - ignore unresolved import for template file
import PathUtil from '../../Util/PathUtil';
import type { Path } from 'd3-path';

import alea from 'alea';
import { createNoise2D, type NoiseFunction2D } from 'simplex-noise';

interface GridCorner {
    position: [number, number];
    noiseValue: number;
}

interface IsolineNode {
    position: [number, number];
    connections: IsolineNode[];
}

class IsolineGridCell {
    // Grid corners
    topLeft: GridCorner;
    topRight: GridCorner;
    bottomLeft: GridCorner;
    bottomRight: GridCorner;

    // Isoline connection nodes
    topNode: IsolineNode;
    rightNode: IsolineNode;
    bottomNode: IsolineNode;
    leftNode: IsolineNode;

    constructor(
        topLeft: GridCorner,
        topRight: GridCorner,
        bottomLeft: GridCorner,
        bottomRight: GridCorner,
        leftNode: IsolineNode,
        topNode: IsolineNode,
        rightNode: IsolineNode,
        bottomNode: IsolineNode
    ) {
        // Assign corners
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
        // Assign nodes
        this.leftNode = leftNode;
        this.topNode = topNode;
        this.rightNode = rightNode;
        this.bottomNode = bottomNode;
    }

    updateConnections(noiseEdge: number) {
        // Calculate distances for interpolation (todo - update node positions)
        const topLeftDistance = this.topLeft.noiseValue - noiseEdge;
        const topRightDistance = this.topRight.noiseValue - noiseEdge;
        const bottomLeftDistance = this.bottomLeft.noiseValue - noiseEdge;
        const bottomRightDistance = this.bottomRight.noiseValue - noiseEdge;

        // Use distance signs to lookup connections (per Marching Squares wikipedia)
        const lookupState =
            1 * (bottomLeftDistance > 0 ? 1 : 0) +
            2 * (bottomRightDistance > 0 ? 1 : 0) +
            4 * (topRightDistance > 0 ? 1 : 0) +
            8 * (topLeftDistance > 0 ? 1 : 0);
        switch (lookupState) {
            case 1:
                this.leftNode.connections.push(this.bottomNode);
                this.bottomNode.connections.push(this.leftNode);
                break;
            case 2:
                this.bottomNode.connections.push(this.rightNode);
                this.rightNode.connections.push(this.bottomNode);
                break;
            case 3:
                this.leftNode.connections.push(this.rightNode);
                this.rightNode.connections.push(this.leftNode);
                break;
            case 4:
                this.topNode.connections.push(this.rightNode);
                this.rightNode.connections.push(this.topNode);
                break;
            case 5:
                this.leftNode.connections.push(this.topNode);
                this.topNode.connections.push(this.leftNode);
                this.bottomNode.connections.push(this.rightNode);
                this.rightNode.connections.push(this.bottomNode);
                break;
            case 6:
                this.topNode.connections.push(this.bottomNode);
                this.bottomNode.connections.push(this.topNode);
                break;
            case 7:
                this.leftNode.connections.push(this.topNode);
                this.topNode.connections.push(this.leftNode);
                break;
            case 8:
                this.leftNode.connections.push(this.topNode);
                this.topNode.connections.push(this.leftNode);
                break;
            case 9:
                this.topNode.connections.push(this.bottomNode);
                this.bottomNode.connections.push(this.topNode);
                break;
            case 10:
                this.leftNode.connections.push(this.bottomNode);
                this.bottomNode.connections.push(this.leftNode);
                this.topNode.connections.push(this.rightNode);
                this.rightNode.connections.push(this.topNode);
                break;
            case 11:
                this.topNode.connections.push(this.rightNode);
                this.rightNode.connections.push(this.topNode);
                break;
            case 12:
                this.leftNode.connections.push(this.rightNode);
                this.rightNode.connections.push(this.leftNode);
                break;
            case 13:
                this.bottomNode.connections.push(this.rightNode);
                this.rightNode.connections.push(this.bottomNode);
                break;
            case 14:
                this.leftNode.connections.push(this.bottomNode);
                this.bottomNode.connections.push(this.leftNode);
                break;
            default:
                break;
        }
    }
}

export default class IsolineGrid {
    private noise: NoiseFunction2D;
    private gridCorners: GridCorner[][];
    private isolineNodes: IsolineNode[];
    private gridCells: IsolineGridCell[][];

    constructor(gridResolution: number, dimensions: [number, number]) {
        // Create the noise function
        const prng = alea(0);
        this.noise = createNoise2D(prng);

        // Create the grid entities
        this.gridCorners = [];
        this.isolineNodes = [];
        this.gridCells = [];
        for (let rowIdx = 0; rowIdx <= gridResolution; rowIdx++) {
            const cornerRow: GridCorner[] = [];
            const cellRow: IsolineGridCell[] = [];

            for (let colIdx = 0; colIdx <= gridResolution; colIdx++) {
                // Create grid corner
                const position: [number, number] = [
                    (colIdx / gridResolution) * dimensions[0],
                    (rowIdx / gridResolution) * dimensions[1],
                ];
                const noiseValue = this.noise(position[0], position[1]);
                const gridCorner: GridCorner = { position, noiseValue };
                cornerRow.push(gridCorner);

                // Create cell with shared corner & node references
                // (cell indices are 1 less than corner indices)
                if (rowIdx > 0 && colIdx > 0) {
                    // Retrieve corners
                    const topLeft = this.gridCorners[rowIdx - 1][colIdx - 1];
                    const topRight = this.gridCorners[rowIdx - 1][colIdx];
                    const bottomLeft = cornerRow[colIdx - 1];
                    const bottomRight = gridCorner;

                    // Create / retrieve nodes
                    const leftNode: IsolineNode = cellRow.length
                        ? cellRow[cellRow.length - 1].rightNode
                        : {
                              position: [
                                  topLeft.position[0],
                                  (topLeft.position[1] + bottomLeft.position[1]) / 2,
                              ],
                              connections: [],
                          };
                    const topNode: IsolineNode = this.gridCells.length
                        ? this.gridCells[this.gridCells.length - 1][colIdx - 1].bottomNode
                        : {
                              position: [
                                  (topLeft.position[0] + topRight.position[0]) / 2,
                                  topLeft.position[1],
                              ],
                              connections: [],
                          };
                    const rightNode: IsolineNode = {
                        position: [
                            topRight.position[0],
                            (topRight.position[1] + bottomRight.position[1]) / 2,
                        ],
                        connections: [],
                    };
                    const bottomNode: IsolineNode = {
                        position: [
                            (bottomLeft.position[0] + bottomRight.position[0]) / 2,
                            bottomLeft.position[1],
                        ],
                        connections: [],
                    };

                    // Collect nodes (for later traversal)
                    if (!cellRow.length) this.isolineNodes.push(leftNode);
                    if (!this.gridCells.length) this.isolineNodes.push(topNode);
                    this.isolineNodes.push(rightNode);
                    this.isolineNodes.push(bottomNode);

                    // Create cell with shared corner & node references
                    const cell = new IsolineGridCell(
                        topLeft,
                        topRight,
                        bottomLeft,
                        bottomRight,
                        leftNode,
                        topNode,
                        rightNode,
                        bottomNode
                    );
                    cellRow.push(cell);
                }
            }
            this.gridCorners.push(cornerRow);
            if (cellRow.length) this.gridCells.push(cellRow);
        }
    }

    private updateAllConnections(noiseEdge: number) {
        // Clear all current connections
        // todo: maybe not necessary, since traversal clears them anyway?
        for (const node of this.isolineNodes) {
            node.connections = [];
        }

        // Ask each cell to update the connections traversing its nodes
        for (let rowIdx = 0; rowIdx < this.gridCells.length; rowIdx++) {
            for (let colIdx = 0; colIdx < this.gridCells[rowIdx].length; colIdx++) {
                const cell = this.gridCells[rowIdx][colIdx];
                cell.updateConnections(noiseEdge);
            }
        }
    }

    public generateIsolines(noiseEdge: number): Path[] {
        // Update data model
        this.updateAllConnections(noiseEdge);

        // Helper function to get path points from a node, recursively
        function getPathPointsFromNode(
            currentNode: IsolineNode,
            previousNode: IsolineNode | null = null
        ): [number, number][] {
            if (currentNode.connections.length > 2) {
                throw 'Node should not be connected in more than two directions';
            } else if (currentNode.connections.length) {
                // Collect the one or two valid connections from this node
                const validConnectionNodes: IsolineNode[] = [];
                while (currentNode.connections.length) {
                    // Remove all connections
                    const nextNode = currentNode.connections.pop()!;
                    // ... and follow those that aren't the previous node
                    if (nextNode !== previousNode) validConnectionNodes.push(nextNode);
                }

                // Follow the valid connections
                const pathPoints: [number, number][][] = validConnectionNodes.map((node) =>
                    getPathPointsFromNode(node)
                );

                // Return the connected path
                if (pathPoints.length === 1) {
                    return [currentNode.position, ...pathPoints[0]];
                } else if (pathPoints.length === 2) {
                    return [...pathPoints[0].reverse(), currentNode.position, ...pathPoints[1]];
                } else {
                    throw 'Paths should not exist in more than two directions';
                }
            }
            return [];
        }

        // Generate isoline layer (set) from data model
        const isolinePointSets: [number, number][][] = [];
        for (const isolineNode of this.isolineNodes) {
            const pathPoints = getPathPointsFromNode(isolineNode);
            // console.log(pathPoints);
            if (pathPoints.length > 2) {
                console.log(pathPoints);
                isolinePointSets.push(pathPoints);
            }
        }

        // Create bezier paths and return them
        const isolinePaths: Path[] = [];
        for (const pointSet of isolinePointSets) {
            isolinePaths.push(PathUtil.createBezierSpline(pointSet));
        }
        return isolinePaths;
    }

    public generateIsolineLayers(lineCount: number): Path[][] {
        const isolineLayers: Path[][] = [];
        for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            const noiseEdge = (lineIndex / lineCount) * 2 - 1; // [-1, 1]
            const isolines = this.generateIsolines(noiseEdge);
            isolineLayers.push(isolines);
        }
        return isolineLayers;
    }
}

// export default class Generator {
//     private grid: IsolineGrid;
//     constructor(gridResolution: number, dimensions: [number, number]) {
//         this.grid = new IsolineGrid(gridResolution, dimensions);
//         this.grid.updateAllConnections(0);
//     }

//     public generate(): Path[] {
//         const paths: Path[] = [];
//         for (let rowIdx = 0; rowIdx < this.grid.gridCells.length; rowIdx++) {
//             for (
//                 let colIdx = 0;
//                 colIdx < this.grid.gridCells[rowIdx].length;
//                 colIdx++
//             ) {
//                 const cell = this.grid.gridCells[rowIdx][colIdx];
//                 if (cell.topNode.connections.length)
//                     paths.push(this.makeDot(cell.topNode.position));
//             }
//         }
//         return paths;
//     }

//     private makeDot(center: [number, number]): Path {
//         const radius = 0.01;
//         const circlePath = PathUtil.approximateCircle(center, radius);
//         return circlePath;
//     }
// }
