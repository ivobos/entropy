define(["exports", "./consts", "apps/lib/container"], function(exports, consts, container) {
    exports.init = function() {
        // paddles
        var geometry = new THREE.BoxGeometry(consts.ballRadius * 2, consts.ballRadius * 2, consts.paddleLength);
        this.paddles = [];
        var i = 0;
        var material = new THREE.MeshPhongMaterial( { color: 0xaabb33, specular: 0x009900, shininess: 10, shading: THREE.FlatShading } );
        this.paddles[i] = new THREE.Mesh(geometry, material);
        this.paddles[i].translateX(- ( consts.arenaSize - 5 * consts.ballRadius) );
        i++;
        material = new THREE.MeshPhongMaterial( { color: 0xaabb33, specular: 0x009900, shininess: 10, shading: THREE.FlatShading } );
        this.paddles[i] = new THREE.Mesh(geometry, material);
        this.paddles[i].translateX( ( consts.arenaSize - 5 * consts.ballRadius) );
        this.selectedPaddle = -1;
    };
    exports.doInput = function(data) {
        if (data.pointer && data.pointer.selectedObject) {
            for (var i = 0; i < this.paddles.length; i++) {
                if (this.paddles[i] == data.pointer.selectedObject) {
                    this.selectedPaddle = i;
                }
            }
        }
        if (data.pointer && data.pointer.floorIntercept && this.selectedPaddle >= 0) {
            // move selected paddle towards pointer intercept point
            var paddle = this.paddles[this.selectedPaddle];
            var z = data.pointer.floorIntercept.z;
            var range = consts.arenaSize - consts.paddleLength / 2;
            z = Math.max(Math.min(z, range), -range);
            paddle.position.z = z;
        }
    };
    exports.getPhysicsData = function() {
        return this.paddles;
    };
    exports.getRenderData = function() {
        for (var i = 0; i < this.paddles.length; i++) {
            if (i == this.selectedPaddle) {
                this.paddles[i].material.color.set( 0xff0000 );
            } else {
                this.paddles[i].material.color.set( 0x00ff00 );
            }
        }
        return this.paddles;
    };
});
