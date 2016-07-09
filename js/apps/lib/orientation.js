define(["exports"], function(exports) {
    exports.init = function() {
        this.orientationDetected = false;
        this.orientationEventHandler = this.onDeviceOrientation.bind(this);
        this.orientation = new THREE.Euler(0, 0, 0, 'YXZ');
    };
    exports.onEnable = function() {
        window.addEventListener('deviceorientation', this.orientationEventHandler, false);
    };
    exports.onDeviceOrientation = function(event) {
        if (event.alpha && event.beta && event.gamma) {
            this.orientationDetected = true;
            this.orientation = new THREE.Euler(
                event.beta * THREE.Math.DEG2RAD,
                event.alpha * THREE.Math.DEG2RAD,
                -event.gamma * THREE.Math.DEG2RAD,
                'YXZ');
        }
    };
    exports.getInputData = function() {
        var data = {};
        if (this.orientationDetected) {
            data.orientation = {};
            data.orientation.euler = this.orientation;
        }
        return data;
    };
    exports.onDisable = function() {
        window.removeEventListener('deviceorientation', this.orientationEventHandler);
    };
});