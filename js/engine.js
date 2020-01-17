
const Engine = function (time_step, update, render) {

    // * Properties
    this.accumulated_time = 0; // time since last update
    this.animation_frame_request = undefined;
    this.time = undefined; // most recent timestamp
    this.time_step = time_step; // 1000/30 = 30 frames per second

    this.updated = false;
    this.update = update;
    this.render = render;

    // * Run function
    this.run = function (time_stamp) { // on cycle of the game loop
        this.accumulated_time += time_stamp - this.time;
        this.time = time_stamp;


        if (this.accumulated_time >= this.time_step * 3) {
            this.accumulated_time = this.time_step;
        }

        while (this.accumulated_time >= this.time_step) {

            this.accumulated_time -= this.time_step;
            this.update(time_stamp);

            this.updated = true; // if the game is updated, redraw it again
        }

        if (this.updated) {
            this.updated = false;
            this.render(time_stamp);
        }

        this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
    };

    // * handleRun function
    this.handleRun = (time_step) => { this.run(time_step); };
};

Engine.prototype = {
    constructor: Engine,

    start: function () {

        this.accumulated_time = this.time_step;

        this.time = window.performance.now();

        this.animation_frame_request = window.requestAnimationFrame(this.handleRun);

    },

    stop: function () {
        window.cancelAnimationFrame(this.animation_frame_request);
    }
};