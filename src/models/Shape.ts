import { Point } from "./Point";
import { ShapeType } from "./ShapeType";
import { State } from "./State";

export class Shape {

    public imageX: number;
    public imageY: number;
    public template: number[][];
    public x = 0;
    public y = 0;

    constructor(
        public squareCountX: number,
        public squareCountY: number,
        public gameMap: Point[][],
        public shapeType: ShapeType) {
            const imagePoint = this.getImagePoint(shapeType);
            this.imageX = imagePoint.x;
            this.imageY = imagePoint.y;
            this.template = this.getTemplate(shapeType);
            this.x = squareCountX / 2;
    }

    checkBottom(): boolean {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                const point = this.getTruncatedPosition();
                const realX = i + point.x;
                const realY = j + point.y;
                if (realY + 1 >= this.squareCountY) {
                    return false;
                }
                const item = this.gameMap[realY + 1][realX];
                if (item.x != -1) {
                    return false;
                }
            }
        }
        return true;
    }

    checkLeft(): boolean {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j< this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                const point = this.getTruncatedPosition();
                const realX = i + point.x;
                const realY = i + point.y;
                if (realX - 1 < 0) {
                    return false;
                }
                if (this.gameMap[realY][realX - 1].x != -1) {
                    return false;
                }
            }
        }
        return true;
    }

    checkRight(): boolean {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j< this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                const point = this.getTruncatedPosition();
                const realX = i + point.x;
                const realY = i + point.y;
                if (realX + 1 >= this.squareCountX) {
                    return false;
                }
                if (this.gameMap[realY][realX + 1].x != -1) {
                    return false;
                }
            }
        }
        return true;
    }

    moveRight(): void {
        if (this.checkRight()) {
            this.x += 1;
        }
    }

    moveLeft(): void {
        if (this.checkLeft()) {
            this.x -= 1;
        }
    }

    moveBottom(): void {
        if (this.checkBottom()) {
            this.y += 1;
            State.score += 1;
        }
    }

    changeRotation() {
        const tempTemplate: number[][] = [];
        for (let i = 0; i < this.template.length; i++)
          tempTemplate[i] = this.template[i].slice();
        const n = this.template.length;
        for (let layer = 0; layer < n / 2; layer++) {
          const first = layer;
          const last = n - 1 - layer;
          for (let i = first; i < last; i++) {
            const offset = i - first;
            const top = this.template[first][i];
            this.template[first][i] = this.template[i][last]; // top = right
            this.template[i][last] = this.template[last][last - offset]; //right = bottom
            this.template[last][last - offset] =
              this.template[last - offset][first];
            //bottom = left
            this.template[last - offset][first] = top; // left = top
          }
        }
    
        for (let i = 0; i < this.template.length; i++) {
          for (let j = 0; j < this.template.length; j++) {
            if (this.template[i][j] == 0) continue;
            const point = this.getTruncatedPosition();
            const realX = i + point.x;
            const realY = j + point.y;
            if (
              realX < 0 ||
              realX >= this.squareCountX ||
              realY < 0 ||
              realY >= this.squareCountY
            ) {
              this.template = tempTemplate;
              return false;
            }
          }
        }
    }

    getTruncatedPosition(): Point {
        return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
    }

    getImagePoint(shapeType: ShapeType): Point {
        switch (shapeType) {
            case ShapeType.LEFT_L:
                return {x: 0, y: 120};
            case ShapeType.T:
                return {x: 0, y: 96};
            case ShapeType.RIGHT_L:
                return {x: 0, y: 72};
            case ShapeType.LEFT_Z: 
                return {x: 0, y: 48};
            case ShapeType.BAR:
                return {x: 0, y: 24};
            case ShapeType.SQUARE:
                return {x: 0, y: 0};
            case ShapeType.RIGHT_Z:
                return {x: 0, y: 48};
        }
    }

    getTemplate(shapeType: ShapeType): number[][] {
        switch (shapeType) {
            case ShapeType.LEFT_L:
                return  [
                    [0, 1, 0],
                    [0, 1, 0],
                    [1, 1, 0],
                  ];
            case ShapeType.T:
                return [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 1, 0],
                  ]
            case ShapeType.RIGHT_L:
                return [
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 1],
                  ];
            case ShapeType.LEFT_Z:
                return  [
                    [0, 0, 0],
                    [0, 1, 1],
                    [1, 1, 0],
                  ]
            case ShapeType.RIGHT_Z:
                return [
                    [0, 0, 0],
                    [1, 1, 0],
                    [0, 1, 1],
                  ];
            case ShapeType.BAR:
                return [
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                  ]
            case ShapeType.SQUARE: 
                  return [
                    [1, 1],
                    [1, 1],
                  ]
        }
    }
}