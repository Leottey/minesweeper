window.addEventListener("load", function (event) {
    "use strict";


    var render = function () {
        display.paint(game.color);
        display.render();
    }

    var update = function () {
        game.update();
    }

    var display = new Display(document.getElementById("game"));
    var game = new Game();
    var engine = new Engine(1000 / 60, render, update);



    window.addEventListener("resize", display.handleResize);

    display.resize();
    engine.start();
})