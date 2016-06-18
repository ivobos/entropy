define(['exports', '../scene', "../center"], function(exports, scene, center) {
    exports.onLoad = function() {
        var geometry = new THREE.SphereGeometry( 50, 16, 16 );
        var material = new THREE.MeshPhongMaterial( { color: 0x22ff55, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
        this.sphere = new THREE.Mesh( geometry, material );
        this.sphere.translateY(50);
    };
    exports.initLate = function() {
    };
    exports.onEnable = function() {
        scene.addSolid( this.sphere );
    };
    exports.onReload = function() {

    };
    exports.onDisable = function() {
        scene.removeSolid( this.sphere );
    };
    exports.beforeRenderEarly = function() {
        var direction = center.get().position.clone().sub(this.sphere.position);
        direction.y = 0;
        if (direction.length() > 1) {
            direction.normalize();
            this.sphere.position.add(direction);
            var rotationAxis = direction.clone().cross(this.sphere.up).normalize();
            var q = new THREE.Quaternion();
            q.setFromAxisAngle( rotationAxis, - 1 / 50 );
            this.sphere.quaternion.multiplyQuaternions( q, this.sphere.quaternion );
        }
    };
});