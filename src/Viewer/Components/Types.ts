export enum Direction {
    Down,
    Left,
    Right
}

export class DisclosureConfig {
    openTransX: number;
    openTransY: number;
    openRotation: number;
    closeRotation: number;
    constructor(
        openTransX: number = 0,
        openTransY: number = 0,
        openRotation: number = 0,
        closeRotation: number = 0,
    ) {
        this.openTransX = openTransX;
        this.openTransY = openTransY;
        this.openRotation = openRotation;
        this.closeRotation = closeRotation;
    }
}