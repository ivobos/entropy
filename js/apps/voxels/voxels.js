define(['exports','./scene'], function(exports, scene) {
    exports.onLoad = function() {
        this.cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
        this.cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( "img/logo.png" ) } );
    };
    exports.createVoxel = function(intersect) {
        var voxel = new THREE.Mesh( this.cubeGeo, this.cubeMaterial );
        voxel.position.copy( intersect.point ).add( intersect.face.normal );
        voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
        scene.addSolid(voxel);
    };
    exports.removeVoxel = function(intersect) {
        scene.removeSolid(intersect.object);
    }
});