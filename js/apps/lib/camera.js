define(['exports'], function (exports) {
    exports.onLoad = function() {
        this.camera = new THREE.PerspectiveCamera();
        this.cameraUpdateData = {
            fov : 45,                               // vertical field of view
            highAngle: 30,                          // angle towards horizontal plane
            center : new THREE.AxisHelper( 25 ),    // camera to look at this object, in the direction this object is facing
            centerRadius : 300,                     // objects within this distance of center should be visible in camera view
            tiltInput : new THREE.Vector2(),        // camera tilt input, comes from mouse or dev orientation
            tiltRange : 10                          // max tilt in degrees
        };
    };
    exports.getCameras = function() {
        return [this.camera];
    };
    exports.updateCamera = function() {
        var aspect = window.innerWidth / window.innerHeight;
        this.camera.fov = this.cameraUpdateData.fov;
        this.camera.aspect = aspect;
        this.camera.far = 10000;
        this.camera.updateProjectionMatrix();
        var distV = this.cameraUpdateData.centerRadius /  Math.atan(this.cameraUpdateData.fov * THREE.Math.DEG2RAD * 0.5);
        var distH = this.cameraUpdateData.centerRadius / aspect /  Math.atan(this.cameraUpdateData.fov * THREE.Math.DEG2RAD * 0.5);
        var dist = Math.max(distV, distH);
        this.camera.position.copy(this.cameraUpdateData.center.position);
        this.camera.quaternion.copy(this.cameraUpdateData.center.quaternion);
        this.camera.updateMatrix();
        this.camera.rotateY(180 * THREE.Math.DEG2RAD);  // the center is actually in opposite direction to camera, so reverse it now
        var tiltX = this.cameraUpdateData.tiltInput.y * this.cameraUpdateData.tiltRange / 2;
        var tiltY = this.cameraUpdateData.tiltInput.x * this.cameraUpdateData.tiltRange / 2;
        this.camera.rotateX(- (this.cameraUpdateData.highAngle + tiltX)* THREE.Math.DEG2RAD);
        this.camera.rotateY(tiltY * THREE.Math.DEG2RAD);
        var offset = new THREE.Vector3(0, 0, dist);     // and back-away from center by dist
        offset.applyQuaternion(this.camera.getWorldQuaternion());
        this.camera.position.add(offset);
    };
    exports.doCameraUpdate = function(data) {
        for (var param in data) this.cameraUpdateData[param] = data[param];
        this.updateCamera();
    };
    exports.getRenderData = function() {
        return [ this.camera, this.cameraUpdateData.center ];
    };
});
