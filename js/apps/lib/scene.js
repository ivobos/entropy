define(["exports"], function(exports) {
    exports.onLoad = function() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0xf2f7ff, 1, 10000 );
    };
    exports.getScenes = function() {
        return [this.scene];
    };
});