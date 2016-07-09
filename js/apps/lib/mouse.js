define(["exports", "kernel/modules"], function(exports, modules) {
    exports.init = function() {
        this.mouseDetected = false;
        this.mouseWindowPos = new THREE.Vector2();
        this.normalizedPosition = new THREE.Vector2();
        this.onMouseMoveCallback = onMouseMove.bind(this);
    };
    exports.onEnable = function() {
        modules.callAppModuleMethod(this, "getContainers")[0].addEventListener('mousemove', this.onMouseMoveCallback, false);
    };
    function onMouseMove(event) {
        event.preventDefault();
        this.mouseDetected = true;
        this.mouseWindowPos.x = event.clientX;
        this.mouseWindowPos.y = event.clientY;
        this.normalizedPosition.set(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
    }
    exports.getInputData = function() {
        var data = {};
        if (this.mouseDetected) {
            data.mouse = {};
            data.mouse.windowPosition = this.mouseWindowPos;
            data.mouse.normalizedPosition = this.normalizedPosition;
        }
        return data;
    };
    exports.onDisable = function() {
        modules.callAppModuleMethod(this, "getContainers")[0].removeEventListener('mousemove', this.onMouseMoveCallback);
    };
});
