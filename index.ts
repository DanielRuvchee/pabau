type Grid = string[][];

interface Position {
    row: number;
    col: number;
}

interface Direction {
    rowChange: number;
    colChange: number;
}

const DIRECTIONS: { [key: string]: Direction } = {
    'right': { rowChange: 0, colChange: 1 },
    'left': { rowChange: 0, colChange: -1 },
    'up': { rowChange: -1, colChange: 0 },
    'down': { rowChange: 1, colChange: 0 }
};

function findStart(grid: Grid): Position | null {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === '>') {
                return { row, col };
            }
        }
    }
    return null;
}

function followPath(grid: Grid): { path: string, letters: string } {
    const start = findStart(grid);
    if (!start) return { path: '', letters: '' };

    let currentPos: Position = start;
    let direction: Direction = DIRECTIONS['right'];
    let path: string = '>';
    let letters: string = '';

    while (true) {
        const nextPos: Position = {
            row: currentPos.row + direction.rowChange,
            col: currentPos.col + direction.colChange
        };

        if (nextPos.row < 0 || nextPos.row >= grid.length ||
            nextPos.col < 0 || nextPos.col >= grid[0].length) {
            break; // Out of bounds
        }

        const nextChar = grid[nextPos.row][nextPos.col];
        path += nextChar;

        if (nextChar === 's') {
            break;
        } else if (nextChar >= 'A' && nextChar <= 'Z') {
            letters += nextChar;
        } else if (nextChar === '+') {
            direction = changeDirection(grid, nextPos, direction);
        }

        currentPos = nextPos;
    }

    return { path, letters };
}

function changeDirection(grid: Grid, pos: Position, currentDirection: Direction): Direction {
    const possibleDirections = [DIRECTIONS['up'], DIRECTIONS['down'], DIRECTIONS['left'], DIRECTIONS['right']];
    for (const direction of possibleDirections) {
        if (direction === currentDirection || direction === invertDirection(currentDirection)) {
            continue;
        }
        const newPos = {
            row: pos.row + direction.rowChange,
            col: pos.col + direction.colChange
        };
        if (newPos.row >= 0 && newPos.row < grid.length &&
            newPos.col >= 0 && newPos.col < grid[0].length) {
            const newChar = grid[newPos.row][newPos.col];
            if (newChar !== ' ') {
                return direction;
            }
        }
    }
    return currentDirection; // Fallback to current direction if no change is found
}

function invertDirection(direction: Direction): Direction {
    return { rowChange: -direction.rowChange, colChange: -direction.colChange };
}

// Example usage
const grid: Grid = [
    ['>', '-', '-', '-', 'A', '-', '-', '-', '+'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['s', '-', 'B', '-', '+', ' ', 'C', ' ', ' '],
    [' ', ' ', '|', ' ', '|', ' ', ' ', ' ', ' '],
    [' ', '+', '-', '-', '+', ' ', ' ', ' ', ' ']
];

const result = followPath(grid);
console.log('Path:', result.path);
console.log('Letters:', result.letters);
