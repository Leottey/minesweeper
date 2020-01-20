

const Display = function (canvas) {

    this.buffer = document.createElement("canvas").getContext("2d");
    this.context = canvas.getContext("2d");
    this.buffer.canvas.width = this.context.canvas.width;
    this.buffer.canvas.height = this.context.canvas.height;

    this.tile_sheet = new Image();

    this.paint = function (game) {
        // *background
        this.buffer.fillStyle = "hsla(233, 23%, 5%, 1)";
        this.buffer.strokeStyle = "#black";
        this.buffer.strokeRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
        this.buffer.fillRect(1, 1, this.buffer.canvas.width - 2, this.buffer.canvas.height - 2);
        this.buffer.textAlign = "center";
        this.buffer.font = "16px sans-serif";

        //this.buffer.fillRect(offsetX, offsetY,(difficulty.rows * tileW), (difficulty.columns * tileH));

        this.buffer.fillStyle = "hsla(233, 23%, 3%, 1)";

        // * Painting menus
        this.buffer.fillRect(game.menuTop.x, game.menuTop.y, game.menuTop.width, game.menuTop.height);
        this.buffer.fillRect(game.menuBottom.x, game.menuBottom.y, game.menuBottom.width, game.menuBottom.height);

        // * Reset button
        this.buffer.fillStyle = "white";
        this.buffer.fillRect(game.menuTop.x + (game.menuTop.width / 2) - 20, game.menuTop.y + (game.menuTop.height / 2) - 20, 40, 40);
        this.buffer.drawImage(this.tile_sheet, 64, 0, 40, 40, game.menuTop.x + (game.menuTop.width / 2) - 20, game.menuTop.y + (game.menuTop.height / 2) - 20, 40, 40);

        this.buffer.fillStyle = "hsla(37, 89%, 52%, 1)";
        // * Top menu text
        this.buffer.fillText("Level: " + game.difficulty.name,
            game.menuTop.x + (game.menuTop.width / 4),
            game.menuTop.y + (game.menuTop.height / 2.5));
        this.buffer.fillText("State: " + game.state,
            game.menuTop.x + (game.menuTop.width / 4),
            game.menuTop.y + (game.menuTop.height * 2 / 2.5));
        this.buffer.fillText("Mines: " + game.minesLeft,
            game.menuTop.x + (game.menuTop.width * 3 / 4),
            game.menuTop.y + (game.menuTop.height / 1.75));


        // * Bottom menu text
        this.buffer.fillText("Easy",
            game.menuBottom.x + (game.menuBottom.width / 4),
            game.menuBottom.y + (game.menuBottom.height / 1.75));
        this.buffer.fillText("Medium",
            game.menuBottom.x + (game.menuBottom.width * 2 / 4),
            game.menuBottom.y + (game.menuBottom.height / 1.75));
        this.buffer.fillText("Hard",
            game.menuBottom.x + (game.menuBottom.width * 3 / 4),
            game.menuBottom.y + (game.menuBottom.height / 1.75));

        for (let r = 0; r < game.grid.length; r++) {
            for (let c = 0; c < game.grid[r].length; c++) {
                let px = game.offsetX + (game.grid[r][c].x * game.tileW);
                let py = game.offsetY + (game.grid[r][c].y * game.tileH);

                // Cells outline
                //this.buffer.strokeStyle = "#000"
                //this.buffer.strokeRect(px, py, game.tileW, game.tileH)




                switch (game.grid[r][c].currentState) {
                    case "hidden":
                        // * Beginning cells


                        //this.buffer.fillStyle = "hsla(233, 23%, 3%, 1)";
                        //this.buffer.fillRect(px, py, game.tileW, game.tileH);

                        this.buffer.drawImage(this.tile_sheet, 0, 0, 32, 32, px, py, 32, 32)
                        break;
                    case "flag":
                        // * Paint Flag

                        //this.buffer.fillStyle = "hsla(37, 89%, 52%, 1)";
                        //this.buffer.fillText("F", px + (game.tileW / 2), py + (game.tileH / 1.5));

                        this.buffer.drawImage(this.tile_sheet, 0, 32, 32, 32, px, py, 32, 32)
                        break;
                    case "visible":
                        // * Paint visible
                        //this.buffer.fillStyle = "hsla(37, 89%, 52%, 1)";
                        //this.buffer.fillRect(px, py, game.tileW, game.tileH);

                        this.buffer.drawImage(this.tile_sheet, 32, 0, 32, 32, px, py, 32, 32)

                        if (game.grid[r][c].hasMine == true) {

                            // * Paint visible -> mines
                            //this.buffer.fillStyle = "hsla(233, 23%, 3%, 1)";
                            //this.buffer.fillText("M", px + (game.tileW / 2), py + (game.tileH / 1.5));

                            this.buffer.drawImage(this.tile_sheet, 32, 32, 32, 32, px, py, 32, 32)
                        } else if (game.grid[r][c].danger != 0) {

                            // * Paint visible -> danger
                            this.buffer.fillStyle = "hsla(233, 23%, 3%, 1)";
                            this.buffer.fillText(game.grid[r][c].danger, px + (game.tileW / 2), py + (game.tileH / 1.5));

                        }
                        break;
                }
                //this.buffer.fillRect(game.offsetX + 3 * game.tileW, game.offsetY + 6 * game.tileH, game.tileW, game.tileH);
            }
        }
    }
}

Display.prototype = {
    constructor: Display,

    render: function () {
        this.context.drawImage(
            this.buffer.canvas,
            0,
            0,
            this.buffer.canvas.width,
            this.buffer.canvas.height,
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height);
    }
};