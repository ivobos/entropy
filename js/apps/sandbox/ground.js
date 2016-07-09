define(['exports'], function(exports) {
    exports.init = function () {
        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('img/sandbox/ground_sandy_564x564.png');
        var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 512, 512 );
        var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
        this.mesh = new THREE.Mesh( geometry, material );
        this.mesh.rotation.x = - Math.PI / 2;
        this.mesh.scale.set( 1000, 1000, 1000 );
    };
    exports.getRenderData = function () {
        return [this.mesh];
    };
});