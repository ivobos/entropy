/*
 * Convert from mouse/touch input into pointer input with following attributes:
 * groundIntercept - 2d vector where ground is being intercepted by touch or mouse
 * selectedObject - object that was selected on touch start or left click
 */
define(["exports", "kernel/modules"], function(exports, modules) {
    exports.init = function() {
        this.raycaster = new THREE.Raycaster();
        var geometry = new THREE.PlaneGeometry( 5000, 5000, 1, 1 );
        geometry.rotateX( - Math.PI / 2 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.floor = new THREE.Mesh( geometry, material );
    };
    // process mouse / touch input
    exports.doInput = function(data) {
        if (data.mouse) {
            this.mouseNormPos = data.mouse.normalizedPosition;
        } else {
            this.mouseNormPos = null;
        }
    };
    // use rendering phase to determine which object we've intercepted
    exports.doRender = function(data) {
        this.selectedObject = null;
        this.floorIntercept = null;
        if (!this.mouseNormPos) return;
        var cameras = modules.callEnabledModuleMethod("getCameras");
        if (cameras.length > 0) {
            var camera = cameras[0];
            // intercept with drawn objects
            this.raycaster.setFromCamera(this.mouseNormPos, camera);
            var intersects = this.raycaster.intersectObjects(data);
            if (intersects.length > 0) {
                this.selectedObject = intersects[0].object;
            }
            // intercept with floor
            var intersects = this.raycaster.intersectObject(this.floor);
            if (intersects.length > 0) {
                this.floorIntercept = intersects[0].point;
            }
        }
    };
    // return converted pointer input
    exports.getInputData = function() {
        var data = {};
        data.pointer = {};
        if (this.selectedObject) {
            data.pointer.selectedObject = this.selectedObject;
        }
        if (this.floorIntercept) {
            data.pointer.floorIntercept = this.floorIntercept;
        }
        return data;
    };
});