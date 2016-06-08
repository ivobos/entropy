define(['exports', '../kernel/lib/three', './center', './dev_orientation', './debug_panel', './mouse', './scene'],
    function (exports, three, center, dev_orientation, debug_panel, mouse, scene) {
    var debug_camera = false;
    exports.initEarly = function() {
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.name = "camera";
        this.camera.position.set( 500, 800, 1300 );
        this.camera.lookAt( new THREE.Vector3() );
        if (debug_camera) this.debugCamera = new THREE.AxisHelper(20);
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    };
    exports.initLate = function() {
        if (debug_camera) scene.addNonSolid(this.debugCamera);
    };
    exports.set = function(cameraVector) {
        this.camera.position.set( cameraVector.x, cameraVector.y, cameraVector.z );
        this.camera.lookAt(new THREE.Vector3());
    };
    exports.onWindowResize = function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    };
    exports.get = function() {
        return this.camera;
    };
    exports.updateCameraMouse = function(camera, dist) {
        // camera sits behind and above center.js
        camera.position.copy(center.get().position);
        camera.quaternion.copy(center.get().quaternion);
        camera.updateMatrix();
        var mousePos = mouse.getMousePos();
        camera.rotateX( (45 + 35 * mousePos.y) * THREE.Math.DEG2RAD);
        camera.rotateY( 35 * mousePos.x * THREE.Math.DEG2RAD);
        var shoulder_offset = new THREE.Vector3(0, 0, -1);
        shoulder_offset.applyQuaternion(camera.getWorldQuaternion()).multiplyScalar(dist);
        camera.position.add(shoulder_offset);
        camera.rotateY(180 * THREE.Math.DEG2RAD); // camera faces backwards
    };
    exports.updateCameraDevOrientationOrig = function(camera, dist) {
        var c = center.get();
        // camera follows center.js, rotated by device orientation and 1000 away
        var newCameraPos = c.up.clone().applyEuler(dev_orientation.getEuler()).multiplyScalar(dist);
        camera.position.copy(newCameraPos);
        // camera always look at center
        camera.lookAt(c.position);
    };
    exports.updateCameraDevOrientation = function(camera, dist) {
        // camera sits behind and above center.js
        camera.position.copy(center.get().position);
        camera.quaternion.copy(center.get().quaternion);
        camera.updateMatrix();
        var beta = Math.max( -1.3, Math.min( 1.3, dev_orientation.betaRads ) );
        camera.rotateX( 90 * THREE.Math.DEG2RAD - beta );
        var gamma = Math.max( -1.3, Math.min( 1.3, dev_orientation.gammaRads ) );
        camera.rotateY( gamma );
        var shoulder_offset = new THREE.Vector3(0, 0, -1);
        shoulder_offset.applyQuaternion(camera.getWorldQuaternion()).multiplyScalar(dist);
        camera.position.add(shoulder_offset);
        camera.rotateY(180 * THREE.Math.DEG2RAD); // camera faces backwards
    };
    exports.beforeRenderLate = function() {
        if (mouse.getLastChangedTime() > dev_orientation.getLastChangedTime()) {
            if (debug_camera) this.updateCameraMouse(this.debugCamera, 200);
            if (!debug_camera) this.updateCameraMouse(this.camera, 1000);
        } else {
            this.updateCameraDevOrientation(this.camera, 1000);
        }
        debug_panel.setDebug("camera", debug_panel.object3DtoString(this.camera));
    };
});
