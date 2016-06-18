define(["exports", "apps/lib/container"],
    function(exports, container) {
    exports.onLoad = function() {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setClearColor( 0xf0f0f0 );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.windowResizeHandler = this.onWindowResize.bind(this);
    };
    exports.initLate = function() {
        container.get().appendChild( this.renderer.domElement );
    };
    exports.onEnable = function() {
        window.addEventListener('resize', this.windowResizeHandler, false );
    };
    exports.onWindowResize = function() {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    };
    exports.doRender = function(data) {
        var camera;
        var scene = new THREE.Scene()
        // use the first camera we find in the data
        for (var i = 0; i < data.length; i++) {
            if (data[i] instanceof THREE.Camera === true) {
                camera = data[i];
            } else {
                scene.add(data[i]);
                //var bbox = new THREE.BoundingBoxHelper( data[i], 0xff0000 );
                //bbox.update();
                //scene.add(bbox);
            }
        }
        this.renderer.render(scene, camera);
    };
    exports.onDisable = function() {
        window.removeEventListener('resize', this.windowResizeHandler);
    };
});