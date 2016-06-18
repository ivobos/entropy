define(['exports','./scene','./debug_panel','./voxels','./center'], function(exports, scene, debug_panel, voxels, center) {
    exports.onLoad = function() {
       // touch control
       this.touchFingerId = 0;
       this.touchMoved = false;
       this.touchPoint3d = null;
       this.translateDelta = new THREE.Vector3(); // push translate delta to center
        // TODO move to onEnable
       // event handlers
       document.addEventListener('touchstart', this.onTouchStart.bind(this), false);
       document.addEventListener('touchmove', this.onTouchMove.bind(this), false);
       document.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    };
    exports.onTouchStart = function(event) {
        event.preventDefault();
        if (event.touches.length == 1) {
            var touch = event.touches[0];
            // commence touch operation
            var intersects = scene.getGroundIntersects(touch.screenX, touch.screenY);
            if (intersects.length > 0) {
                var intersect = intersects[0];
                this.touchPoint3d = intersect.point.clone();
                this.touchFingerId = event.touches[0].identifier;
                this.translateDelta.set(0, 0, 0);
                this.touchMoved = false;
                debug_panel.setDebug("center_touch", "TouchStart " + debug_panel.vector3toString(this.touchPoint3d));
            }
        }
    };
    exports.onTouchMove = function(event) {
        event.preventDefault();
        if (this.touchPoint3d != null && event.changedTouches.length == 1 && event.changedTouches[0].identifier == this.touchFingerId) {
            this.translateInProgress = true;
            this.touchMoved = true;
            var touch = event.changedTouches[0];
            // translate if possible
            var intersects = scene.getGroundIntersects(touch.screenX, touch.screenY);
            if (intersects.length > 0) {
                this.translateDelta.subVectors(this.touchPoint3d, intersects[0].point);
                debug_panel.setDebug("center_touch", "TouchMove " + debug_panel.vector3toString(this.translateDelta));
            }
        }
    };
    exports.onTouchEnd = function(event) {
        event.preventDefault();
        if (this.touchPoint3d != null && event.changedTouches.length == 1 && event.changedTouches[0].identifier == this.touchFingerId) {
            debug_panel.setDebug("center_touch", "TouchEnd " + debug_panel.changedTouchesToString(event));
            if (!this.touchMoved) {
                var touch = event.changedTouches[0];
                var intersects = scene.getIntersects(touch.screenX, touch.screenY);
                if (intersects.length > 0) {
                    voxels.createVoxel(intersects[0]);
                }
            }
            this.touchPoint3d = null;
        }
    };
    exports.beforeRenderEarly = function() {
        if (this.translateInProgress) {
            center.moveByVector3(this.translateDelta);
            this.translateDelta.set(0, 0, 0);
        }
    };
});