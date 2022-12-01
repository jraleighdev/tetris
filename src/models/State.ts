import { Point } from "./Point";

export class State {
  public static readonly imageSquareSize = 24;
  public static readonly size = 40;
  public static readonly framePerSecond = 24;
  public static readonly gameSpeed = 5;
  public static readonly whiteLinesThickness = 4;
  public static score = 0;

  public static initializeGameMap(squareCountX: number, squareCountY: number): Point[][] {
    const initial2dArray: Point[][] = [];
    for (let i = 0; i < squareCountY; i++) {
      const temp: Point[] = [];
      for (let j = 0; j < squareCountX; j++) {
        temp.push({ x: -1, y: -1 });
      }
      initial2dArray.push(temp);
    }
    return initial2dArray;
  }
}