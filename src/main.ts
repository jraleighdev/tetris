import { Point } from "./models/Point";
import { Shape } from "./models/Shape";
import { State } from "./models/State";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const nextShapeCanvas = document.getElementById('nextShapeCanvas') as HTMLCanvasElement;
const scoreCanvas = document.getElementById('scoreCanvas') as HTMLCanvasElement;
const image = document.getElementById('image') as HTMLImageElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const nctx = nextShapeCanvas.getContext('2d') as CanvasRenderingContext2D;
const sctx = scoreCanvas.getContext('2d') as CanvasRenderingContext2D;
const squareCountX = canvas.width / State.size;
const squareCountY = canvas.height / State.size;
let gameMap: Point[][] = State.initializeGameMap(squareCountX, squareCountY);
const shapesIndexes = [0, 1, 2, 3, 4, 5, 6];
let nextShape: Shape;
let currentShape: Shape;
let gameOver = false;

const deleteCompleteRows = () => {
    for (let i = 0; i < gameMap.length; i++) {
        const t = gameMap[i];
        let isComplete = true;

        for (let j = 0; j < t.length; j++) {
            const item = t[j];
            if (item.x == -1) isComplete = false;
        }
        if (isComplete) {
            State.score += 1000;
            for (let k = i; k > 0; k--) {
                gameMap[k] = gameMap[k - 1];
            }
            const temp: Point[] = [];
            for (let j = 0; j < squareCountX; j++) {
                temp.push({ x: -1, y: -1 });
            }
            gameMap[0] = temp;
        }
    }
}

const getRandomShape = (): Shape => {
    const randomIndex = Math.floor(Math.random() * shapesIndexes.length)
    return new Shape(squareCountX, squareCountY, gameMap, randomIndex);
}

const update = () => {
    console.log('hello');
    if (gameOver) return;
    if (currentShape.checkBottom()) {
        currentShape.y += 1;
    } else {
        for (let k = 0; k < currentShape.template.length; k++) {
            for (let l = 0; l < currentShape.template.length; l++) {
                if (currentShape.template[k][l] == 0) continue;
                gameMap[currentShape.getTruncatedPosition().y + l][currentShape.getTruncatedPosition().x + k] = { x: currentShape.imageX, y: currentShape.imageY };
            }
        }

        deleteCompleteRows();
        currentShape = nextShape;
        nextShape = getRandomShape();
        if (!currentShape.checkBottom()) {
            gameOver = true;
        }
        State.score += 100;
    }
}

const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

const drawBackGround = () => {
    drawRect(0, 0, canvas.width, canvas.height, '#bca0dc');
    for (let i = 0; i < squareCountX + 1; i++) {
        drawRect(
            State.size * i - State.whiteLinesThickness,
            0,
            State.whiteLinesThickness,
            canvas.height,
            'white'
        );
    }

    for (let i = 0; i < squareCountY + 1; i++) {
        drawRect(
            0,
            State.size * i - State.whiteLinesThickness,
            canvas.width,
            State.whiteLinesThickness,
            'white'
        );
    }
}

const drawCurrentShape = () => {
    for (let i = 0; i < currentShape.template.length; i++) {
        for (let j = 0; j < currentShape.template.length; j++) {
            if (currentShape.template[i][j] == 0) continue;
            ctx.drawImage(
                image,
                currentShape.imageX,
                currentShape.imageY,
                State.imageSquareSize,
                State.imageSquareSize,
                Math.trunc(currentShape.x) * State.size + State.size * i,
                Math.trunc(currentShape.y) * State.size + State.size * j,
                State.size,
                State.size
            );
        }
    }
};

const drawSquares = () => {
    for (let i = 0; i < gameMap.length; i++) {
        const t: Point[] = gameMap[i];
        for (let j = 0; j < t.length; j++) {
            if (t[j].x == -1) continue;
            ctx.drawImage(
                image,
                t[j].x,
                t[j].y,
                State.imageSquareSize,
                State.imageSquareSize,
                j * State.size,
                i * State.size,
                State.size,
                State.size
            )
        }
    }
}

const drawNextShape = () => {
    nctx.fillStyle = '#bca0dc';
    nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
    for (let i = 0; i < nextShape.template.length; i++) {
        for (let j = 0; j < nextShape.template.length; j++) {
            if (nextShape.template[i][j] == 0) continue;
            nctx.drawImage(
                image,
                nextShape.imageX,
                nextShape.imageY,
                State.imageSquareSize,
                State.imageSquareSize,
                State.size * i,
                State.size * j + State.size,
                State.size,
                State.size
            );
        }
    }
};

const drawScore = () => {
    sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    sctx.font = '64px Poppins';
    sctx.fillStyle = 'black';
    sctx.fillText(State.score.toString(), 10, 50);
}

const drawGameOver = () => {
    ctx.font = '64px Poppins';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over!', 10, canvas.height / 2);
}

const resetVars = () => {
    gameMap = State.initializeGameMap(squareCountX, squareCountY);
    State.score = 0;
    gameOver = false;
    currentShape = getRandomShape();
    nextShape = getRandomShape();
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackGround();
    drawSquares();
    drawCurrentShape();
    drawNextShape();
    drawScore();
    if (gameOver) {
        drawGameOver();
    }
}

const gameLoop = () => {
    setInterval(update, 1000 / State.gameSpeed);
    setInterval(draw, 1000 / State.framePerSecond);
}

window.addEventListener('keydown', (event) => {
    if (event.keyCode == 37) currentShape.moveLeft();
    else if (event.keyCode == 38) currentShape.changeRotation();
    else if (event.keyCode == 39) currentShape.moveRight();
    else if (event.keyCode == 40) currentShape.moveBottom();
});

document.getElementById('reset-button')?.addEventListener('click', () => {
    resetVars();
});

resetVars()
gameLoop();
