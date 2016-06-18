define(["exports", "apps/lib/container", "kernel/stats", "kernel/modules", "./scene", "./camera"],
    function(exports, container, stats, modules, scene, camera) {
   exports.onLoad = function() {
       this.renderer = new THREE.WebGLRenderer( { antialias: true } );
       this.renderer.setClearColor( 0xf0f0f0 );
       this.renderer.setPixelRatio( window.devicePixelRatio );
       this.renderer.setSize( window.innerWidth, window.innerHeight );
       // move to onEnable
       window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

   };
   exports.initLate = function() {
       container.get().appendChild( this.renderer.domElement );
       requestAnimationFrame( this.render.bind(this) );
   };
   exports.onWindowResize = function() {
       this.renderer.setSize( window.innerWidth, window.innerHeight );
   };
   exports.render = function() {
        stats.begin();
        requestAnimationFrame( this.render.bind(this) );
        modules.callModuleMethods("beforeRenderEarly", false);
        modules.callModuleMethods("beforeRenderLate", false);
        this.renderer.render( scene.getScene(), camera.get());
        stats.end();
    };
});