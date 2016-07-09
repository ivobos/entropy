define(['exports'], function(exports) {
    exports.init = function() {
        this.camShake = new THREE.Vector2();
    };
    exports.doInput = function(data) {
        if (data.mouse) {
            if (!this.mousePosDamped) {
                this.mousePosDamped = data.mouse.normalizedPosition.clone();
            }
            this.mousePosDamped.x = dampPos(this.mousePosDamped.x, data.mouse.normalizedPosition.x, 0.1);
            this.mousePosDamped.y = dampPos(this.mousePosDamped.y, data.mouse.normalizedPosition.y, 0.1);
            var deviation = new THREE.Vector2(
                (data.mouse.normalizedPosition.x - this.mousePosDamped.x) / 2,
                (data.mouse.normalizedPosition.y - this.mousePosDamped.y) / 2
            );
            if (Math.abs(deviation.x) > 0.01 || Math.abs(deviation.y) > 0.01) {
                this.camShake = deviation;
            }
        }
        if (data.orientation) {
            if (!this.orientationDamped) {
                this.orientationDamped = data.orientation.euler.clone();
            }
            this.orientationDamped.x = dampAngle(this.orientationDamped.x, data.orientation.euler.x, 0.1);
            this.orientationDamped.y = dampAngle(this.orientationDamped.y, data.orientation.euler.y, 0.1);
            this.orientationDamped.z = dampAngle(this.orientationDamped.z, data.orientation.euler.z, 0.1);
            var deviation = new THREE.Vector2(
                Math.sin((data.orientation.euler.z - this.orientationDamped.z) / 2),
                Math.sin((data.orientation.euler.x - this.orientationDamped.x) / 2)
            );
            if (Math.abs(deviation.x) > 0.01 || Math.abs(deviation.y) > 0.01 ) {
                this.camShake = deviation;
            }
        }
    };
    function dampPos(sourceA, targetA, t) {
        var a = targetA - sourceA;
        var result = sourceA + a * t;
        return result;
    }
    function dampAngle(sourceA, targetA, t) {
        var a = targetA - sourceA;
        a = (a + Math.PI) % (2 * Math.PI) - Math.PI;
        var result = sourceA + a * t;
        return result;
    }
    exports.getCameraData = function() {
        return {
            tiltInput : this.camShake
        };
    };
});