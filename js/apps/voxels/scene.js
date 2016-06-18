define(['exports', './camera'], function(exports, camera) {
    exports.onLoad = function() {
        this.scene = new THREE.Scene();
        this.objects = [];
        this.raycaster = new THREE.Raycaster();
        this.ground = [];
    };
    exports.getScene = function() {
        return this.scene;
    };
    exports.addNonSolid = function(object) {
        this.scene.add(object);
    };
    exports.addSolid = function(object) {
        this.scene.add(object);
        this.objects.push(object);
    };
    exports.addGround = function(object) {
        this.scene.add(object);
        this.objects.push(object);
        this.ground.push(object);
    };
    exports.removeSolid = function(object) {
        this.scene.remove( object );
        this.objects.splice( this.objects.indexOf( object ), 1 );
    };
    exports.getIntersects = function(x, y) {
        var point = new THREE.Vector2();
        point.set( ( x / window.innerWidth ) * 2 - 1, - ( y / window.innerHeight ) * 2 + 1 );
        this.raycaster.setFromCamera( point, camera.get());
        return this.raycaster.intersectObjects( this.objects );
    };
    exports.getGroundIntersects = function(x, y) {
        var point = new THREE.Vector2();
        point.set( ( x / window.innerWidth ) * 2 - 1, - ( y / window.innerHeight ) * 2 + 1 );
        this.raycaster.setFromCamera( point, camera.get());
        return this.raycaster.intersectObjects( this.ground );
    };
});
