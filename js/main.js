window.addEventListener("load", function (event) {
    "use strict";

    var difficulties = {
        Easy: {
            name: "Easy",
            rows: 10,
            columns: 10,
            mines: 10
        },
        Medium: {
            name: "Medium",
            rows: 13,
            columns: 13,
            mines: 20
        },
        Hard: {
            name: "Hard",
            rows: 15,
            columns: 15,
            mines: 50
        }
    }

    var mousePos = {
        x: 0,
        y: 0,
        click: null,
    }
    // * calculate position in the canvas takeing out the space of the page
    let position = function (x, y) {
        let canvas = document.getElementById("game");
        do {
            x -= canvas.offsetLeft;
            y -= canvas.offsetTop;

            canvas = canvas.offsetParent;
        } while (canvas != null)

        return [x, y]
    }
    var render = function (time_stamp) {
        display.paint({
            grid: game.grid,
            offsetX: game.offsetX,
            offsetY: game.offsetY,
            tileW: game.tileW,
            tileH: game.tileH
        });
        display.render();
    }

    var update = function (time_stamp) {
        if (mousePos.click != null) {
            game.update(mousePos, mousePos.click)
            mousePos.click = null;
        }
    }



    var display = new Display(document.getElementById("game"));
    var game = new Game();
    var engine = new Engine(1000 / 60, render, update);

    document.getElementById("game").addEventListener("click", function (e) {
        let pos = position(e.pageX, e.pageY);
        mousePos.x = pos[0];
        mousePos.y = pos[1];
        mousePos.click = "left";

        // * Game update left click
    })
    document.getElementById("game").addEventListener("contextmenu", function (e) {
        e.preventDefault();
        let pos = position(e.pageX, e.pageY);
        mousePos.x = pos[0];
        mousePos.y = pos[1];
        mousePos.click = "right";

        // * Game update right click, flag    
    })


    game.start(difficulties.Hard);
    engine.start();



})