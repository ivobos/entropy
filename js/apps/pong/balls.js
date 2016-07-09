define(['exports',"./consts"], function(exports, consts) {
    exports.init = function() {
        var sphereGeometry = new THREE.SphereGeometry( consts.ballRadius, 16, 16 );
        var sphereMaterial = new THREE.MeshPhongMaterial( { color: 0xff22ff, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
        this.spheres = [];
        for (var i = 0 ; i < 3; i++) {
            this.spheres[i] = new THREE.Mesh(sphereGeometry, sphereMaterial);
            this.spheres[i].userData.velocity = new THREE.Vector3(5 - i, 0, 3 + i);
            this.spheres[i].position.x = i * consts.ballRadius * 3;
            this.spheres[i].position.z = i * consts.ballRadius * 3;
        }
    };
    exports.getPhysicsData = function() {
        return this.spheres;
    };
    exports.getRenderData = function() {
        return this.spheres;
    };
});