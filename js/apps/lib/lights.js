define(["exports"], function(exports) {
    exports.onLoad = function() {
    };
    exports.initLate = function() {
        this.ambientLight = new THREE.AmbientLight( 0x606060 );
        this.directionalLight = new THREE.DirectionalLight( 0xffffff );
        this.directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    };
    exports.getRenderData = function() {
        return [ this.ambientLight, this.directionalLight ];
    };
});