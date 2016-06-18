define(['exports'], function (exports) {
    exports.onLoad = function() {
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.name = "camera";
        this.camera.position.set( 0, 600, 1000 );
        this.camera.lookAt( new THREE.Vector3() );
        this.windowResizeHandler = this.onWindowResize.bind(this);
    };
    exports.onEnable = function() {
        window.addEventListener('resize', this.windowResizeHandler, false );
    };
    exports.onWindowResize = function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    };
    exports.getRenderData = function() {
        return [ this.camera ];
    };
    exports.onDisable = function() {
        window.removeEventListener('resize', this.windowResizeHandler);
    };
});
