define(['exports', './debug_panel', './camera', './voxels', './scene', './keyboard','./touch'],
    function(exports, debug_panel, camera, voxels, scene, keyboard, touch) {
    // center of user's attention, that which appears at the center of the display device
    // because we're dealing with 3d space the centre is identified by
    //  - center.position - the point in 3d space the camera will be looking at
    //  - heading - a compass heading derived from center.up and center.rotation
    //  center.rotation is always assumed to be orthogonal to center.up
    exports.initEarly = function() {
        this.center = new THREE.AxisHelper( 25 );
        this.center.name = "center";
    };
    exports.initLate = function() {
        scene.addNonSolid(this.center);
    };
    exports.setPosition = function(vector3) {
        this.center.position.copy(vector3);
        this._updateDebug();
    };
    exports.moveForward = function(distance) {
        this.center.position.add(this.center.getWorldDirection().multiplyScalar(distance));
        this._updateDebug();
    };
    exports.moveStrafe = function(distance) {
        this.center.position.add(this.center.getWorldDirection().cross(this.center.up).multiplyScalar(distance));
        this._updateDebug();
    };
    exports.moveByVector3 = function(vector) {
        this.center.position.add(vector);
        this._updateDebug();
    };
    exports.rotateY = function(angle) {
        this.center.rotateY(angle);
        this._updateDebug();
    };
    exports._updateDebug = function() {
        debug_panel.setDebug("center", debug_panel.object3DtoString(this.center));
    };
    exports.get = function() {
        return this.center;
    };
});