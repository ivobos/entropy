define(['exports', './center'], function(exports, center) {
    exports.onLoad = function() {
        // key codes
        this.forward_keyCode = 'W'.charCodeAt(0);
        this.backward_keyCode = 'S'.charCodeAt(0);
        this.alt_forward_keyCode = 38;
        this.alt_backward_keyCode = 40;
        this.move_left_keyCode = 'A'.charCodeAt(0);
        this.move_right_keyCode = 'D'.charCodeAt(0);
        this.rotate_left_keyCode = 37; // left arrow
        this.rotate_right_keyCode = 39; // right arrow
        this.shift_keyCode = 16;
        // key pressed state
        this.key = {};
        // TODO move to onEnable
        // event handlers
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    };
    exports.onKeyDown = function(event) {
        this.key[event.keyCode] = true;
    };
    exports.onKeyUp = function(event) {
        this.key[event.keyCode] = false;
    };
    exports.isKeyDown = function(keyCode) {
        return this.key[keyCode];
    };
    exports.beforeRenderEarly = function() {
        // keyboard related update
        var forwardVelocity = 0;
        if (this.key[this.forward_keyCode] || this.key[this.alt_forward_keyCode]) forwardVelocity += 2;
        if (this.key[this.backward_keyCode] || this.key[this.alt_backward_keyCode]) forwardVelocity -= 2;
        if (forwardVelocity) {
            center.moveForward(forwardVelocity);
        }
        var strafeVelocity = 0;
        if (this.key[this.move_left_keyCode]) strafeVelocity -= 2;
        if (this.key[this.move_right_keyCode]) strafeVelocity += 2;
        if (strafeVelocity) {
            center.moveStrafe(strafeVelocity);
        }
        var rotationRate = 0;
        if (this.key[this.rotate_left_keyCode]) rotationRate += Math.PI / 180;
        if (this.key[this.rotate_right_keyCode]) rotationRate -= Math.PI / 180;
        if (rotationRate) {
            center.rotateY(rotationRate);
        }
    };
});
