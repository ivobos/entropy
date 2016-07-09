define(["exports"], function(exports) {
    exports.init = function() {
        this.ambientLight = new THREE.AmbientLight( 0x808080 );
        this.directionalLight = new THREE.DirectionalLight( 0xffffff );
        this.directionalLight.position.set( 0, 0.75, -2 ).normalize();
    };
    exports.getRenderData = function() {
        return [ this.ambientLight, this.directionalLight ];
    };
});