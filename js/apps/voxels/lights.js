define(["exports", "./scene"], function(exports, scene) {
    exports.onLoad = function() {
    };
    exports.init = function() {
        // Lights
        var ambientLight = new THREE.AmbientLight( 0x606060 );
        scene.addNonSolid( ambientLight);
        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
        scene.addNonSolid( directionalLight );
    };
});