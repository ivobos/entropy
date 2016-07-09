define(['exports'], function(exports) {
    exports.arenaSize = 300;
    exports.paddleLength = exports.arenaSize * 2 / 5;
    exports.ballRadius = 10;
    exports.getCameraData = function() {
        return {
            centerRadius: this.arenaSize
        }
    };
});
