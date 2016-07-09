define(["exports", "kernel/modules"], function(exports, modules) {
    exports.onLoad = function() {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setClearColor( 0xf2f7ff );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.windowResizeHandler = this.onWindowResize.bind(this);
    };
    exports.init = function() {
        this.getContainer().appendChild( this.renderer.domElement );
    };
    exports.onEnable = function() {
        window.addEventListener('resize', this.windowResizeHandler, false );
    };
    exports.onWindowResize = function() {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    };
    exports.doRender = function(data) {
        var camera = modules.callEnabledModuleMethod("getCameras")[0];
        var scene = getScene();
        scene.children.length = 0; // remove all objects from scene
        for (var i = 0; i < data.length; i++) {
            scene.add(data[i]);
            //var bbox = new THREE.BoundingBoxHelper( data[i], 0xff0000 );
            //bbox.update();
            //scene.add(bbox);
        }
        if (camera) {
            this.renderer.render(scene, camera);
        }
    };
    exports.onDisable = function() {
        window.removeEventListener('resize', this.windowResizeHandler);
    };
    exports.getContainer = function() {
        var containers = modules.callAppModuleMethod(this, "getContainers");
        return containers[0];
    };
    function getScene() {
        var scenes = modules.callEnabledModuleMethod("getScenes");
        if (!scenes || scenes.length == 0) {
            return new THREE.Scene()
        } else {
            return scenes[0];
        }
    }
});