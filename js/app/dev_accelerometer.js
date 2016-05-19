define(['exports'], function(exports) {
    exports.initEarly = function() {
        // motion stuff
        // android works best with 20-60Hz sampling, ie 50ms to 16ms
        // ios supports 40ms to 1000ms
        // so lets go with 40ms, 25Hz
        this.accelWatchID = navigator.accelerometer.watchAcceleration(
            this.accelerationSuccess.bind(this),
            this.accelerationError.bind(this),
            {frequency: 40});
    };
    exports.accelerationSuccess = function(acceleration) {
        var scale = 10;
        //console.log(
        //    'Accel x=' + Math.round() +
        //    ' y=' + Math.round(acceleration.y) +
        //    ' z=' + Math.round(acceleration.z) +
        //    ' t=' + acceleration.timestamp);
    };
    exports.accelerationError = function() {
    };
});