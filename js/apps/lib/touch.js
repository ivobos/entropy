define(["exports", "apps/lib/container"], function(exports, container) {
    exports.init = function() {
        this.touchStartHandler = onTouchStart.bind(this);
        this.touchMoveHandler = onTouchMove.bind(this);
        this.touchEndHandler = onTouchEnd.bind(this);
        this.touch = null;
    };
    exports.onEnable = function() {
        document.addEventListener('touchstart', this.touchStartHandler, false);
        document.addEventListener('touchmove', this.touchMoveHandler, false);
        document.addEventListener('touchend', this.touchEndHandler, false);
    };
    function onTouchStart(event) {
        event.preventDefault();
        if (event.touches.length == 1) {
            this.touch = event.touches[0];
        }
    }
    function onTouchMove(event) {

    }
    function onTouchEnd(event) {

    }
    exports.getInputData = function() {
        var data = {};
        if (this.touch) {
            data.pointer = new THREE.Vector2();
            data.pointer.set(( this.touch.clientX / window.innerWidth ) * 2 - 1, - ( this.touch.clientY / window.innerHeight ) * 2 + 1);
            this.touch = null;
        }
        return data;
    };
    exports.onDisable = function() {
        document.removeEventListener('touchstart', this.touchStartHandler);
        document.removeEventListener('touchmove', this.touchMoveHandler);
        document.removeEventListener('touchend', this.touchEndHandler);
    };
});