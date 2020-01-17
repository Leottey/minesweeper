
const Tile = function (x, y) {
    this.x = x;
    this.y = y;
    this.hasMine = false;
    this.danger = 0;
    this.currentState = "hidden";


}
Tile.prototype = {
    constructor: Tile,
    flag: function () {
        switch (this.currentState) {
            case "hidden":
                this.currentState = "flag";
                break;
            case "flag":
                this.currentState = "hidden";
                break;
        }
    },
    seeDanger: function (grid) {
        for (let r = this.x - 1; r <= this.x + 1; r++) {
            for (let c = this.y - 1; c <= this.y + 1; c++) {

                if (this.x == r && this.y == c) {
                    continue
                }
                if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) {
                    continue
                }

                grid[r][c].danger++
                // ? Have danger
                //console.log(grid[r][c])
            }
        }
    },
    revealNeighbours: function (grid) {

        for (let r = this.x - 1; r <= this.x + 1; r++) {
            for (let c = this.y - 1; c <= this.y + 1; c++) {
                if (this.x == r && this.y == c) {
                    continue
                }
                if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) {
                    continue
                }
                if (grid[r][c].currentState == "hidden" && grid[r][c].hasMine == false) {
                    //console.log(grid[r][c])
                    grid[r][c].currentState = "visible";
                    if (grid[r][c].danger == 0) {

                        grid[r][c].revealNeighbours(grid);
                    }
                }

            }
        }
    }
}
const Game = function () {

    this.state = "playing";
    this.difficulty = {};
    this.offsetX = 0;
    this.offsetY = 0;
    this.tileW = 40;
    this.tileH = 40;
    this.grid = [];

    this.getGrid = function () {
        let grid = [],
            dRows = this.difficulty.rows,
            dColumns = this.difficulty.columns;
        for (let row = 0; row < dRows; row++) {
            // Create an empty array to fill it with the Tile objects 
            // and then push it in the grid array
            let array = [];
            for (let column = 0; column < dColumns; column++) {

                let tile = new Tile(row, column);
                array.push(tile);
            }
            grid.push(array);
            array = [];
        }
        this.grid = grid;
    }

    this.placeMines = function () {
        let placedMines = 0,
            maxMines = this.difficulty.mines;
        while (placedMines < maxMines) {
            let selectedColumn = Math.floor(Math.random() * this.grid.length);
            let selectedRow = Math.floor(Math.random() * this.grid[selectedColumn].length)

            if (!this.grid[selectedColumn][selectedRow].hasMine) {
                this.grid[selectedColumn][selectedRow].hasMine = true;
                // ? Where are mines
                //console.log(this.grid[selectedColumn][selectedRow]);
                //
                // Calculate danger from the mines cells 
                this.grid[selectedColumn][selectedRow].seeDanger(this.grid);
                placedMines++
            }

        }

    }
    this.update = function (mouse, button) {

        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {

                // * Positions X and Y
                let tileX = (this.grid[r][c].x * this.tileW) + this.offsetX;
                let tileY = (this.grid[r][c].y * this.tileH) + this.offsetY;

                if (mouse.x > tileX && mouse.x < tileX + this.tileW
                    && mouse.y > tileY && mouse.y < tileY + this.tileH) {

                    // * Selected Tile
                    //console.log(this.grid[r][c])

                    // * Left-Right click handler
                    switch (button) {
                        case "left":
                            if (this.grid[r][c].hasMine == false
                                && this.grid[r][c].currentState == "hidden") {
                                // console.log(this.grid[r][c])
                                // It's possible that the cell doesn't reveal if it's surrounded by
                                // mines or danger cells if not reveal earlier
                                this.grid[r][c].currentState = "visible"
                                this.grid[r][c].revealNeighbours(this.grid);

                            } else if (this.grid[r][c].hasMine == true) {
                                // console.log(this.grid[r][c])
                                console.log("You lost")
                                this.gameOver()

                            }
                            break;
                        case "right":
                            this.grid[r][c].flag();
                            break;
                    }

                }
            }
        }


    };
    this.gameOver = function () {

    }
}
Game.prototype = {
    constructor: Game,
    start: function (difficulty) {
        this.difficulty = difficulty;
        this.getGrid();
        this.placeMines();
        // Calculate margin
        this.offsetX = Math.floor((document.getElementById('game').width -
            (difficulty.rows * this.tileW)) / 2);
        this.offsetY = Math.floor((document.getElementById('game').height -
            (difficulty.columns * this.tileH)) / 2);
    }
};
