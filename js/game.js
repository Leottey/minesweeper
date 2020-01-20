
const Tile = function (x, y) {
    this.x = x;
    this.y = y;
    this.hasMine = false;
    this.danger = 0;
    this.currentState = "hidden";


}
Tile.prototype = {
    constructor: Tile,
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
    this.minesLeft = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.tileW = 32;
    this.tileH = 32;
    this.menuTop = {
        x: 35,
        y: 35,
        width: 480,
        height: 64
    };
    this.menuBottom = {
        x: 35,
        y: 645,
        width: 480,
        height: 64
    };
    this.grid = [];
    this.revealed = 0;

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
        let numberTiles = 0;

        // * Reset button
        let resetX = this.menuTop.x + (this.menuTop.width / 2) - 20;
        let resetY = this.menuTop.y + (this.menuTop.height / 2) - 20;
        if (mouse.x > resetX && mouse.x < resetX + 40 && mouse.y > resetY && mouse.y < resetY + 40) {
            this.start(this.difficulty);
            this.state = "playing";
            this.minesLeft = 0;
        }


        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {

                // * Positions X and Y
                let tileX = (this.grid[r][c].x * this.tileW) + this.offsetX;
                let tileY = (this.grid[r][c].y * this.tileH) + this.offsetY;

                let selectedTile = this.grid[r][c];

                if (selectedTile.currentState == "visible" && selectedTile.hasMine == false) {
                    numberTiles++
                    this.revealed = numberTiles;
                }

                if (this.revealed == (this.difficulty.rows * this.difficulty.columns) - this.difficulty.mines) {
                    this.state = "won";
                }

                if (this.state == "playing") {
                    if (mouse.x > tileX && mouse.x < tileX + this.tileW
                        && mouse.y > tileY && mouse.y < tileY + this.tileH) {

                        // * Selected Tile
                        //console.log(this.grid[r][c])

                        // * Left-Right click handler
                        switch (button) {
                            case "left":
                                if (selectedTile.hasMine == false
                                    && selectedTile.currentState == "hidden") {
                                    // console.log(this.grid[r][c])
                                    // It's possible that the cell doesn't reveal if it's surrounded by
                                    // mines or danger cells if not reveal earlier
                                    selectedTile.currentState = "visible"
                                    selectedTile.revealNeighbours(this.grid);

                                } else if (selectedTile.hasMine == true) {

                                    this.gameOver()

                                }
                                break;
                            case "right":
                                switch (selectedTile.currentState) {
                                    case "hidden":
                                        selectedTile.currentState = "flag";
                                        this.minesLeft--;
                                        break;
                                    case "flag":
                                        selectedTile.currentState = "hidden";
                                        this.minesLeft++;
                                        break;
                                }
                                break;
                        } // end switch
                    } //end if
                } else {

                } //end if == playing
            } //end inner for
        }// end for


    }; // end function
    this.gameOver = function () {
        this.state = "lost";
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                if (this.grid[r][c].hasMine == true) {
                    this.grid[r][c].currentState = "visible";
                }
            }
        }
    }
}
Game.prototype = {
    constructor: Game,
    start: function (difficulty) {
        this.difficulty = difficulty;
        this.minesLeft = difficulty.mines;
        this.getGrid();
        this.placeMines();
        // Calculate margin
        this.offsetX = Math.floor((document.getElementById('game').width -
            (difficulty.rows * this.tileW)) / 2);
        this.offsetY = Math.floor((document.getElementById('game').height -
            (difficulty.columns * this.tileH)) / 2);
    }
};
