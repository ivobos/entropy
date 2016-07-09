define(['exports', "apps/lib/material_ui"], function(exports, material_ui) {
    exports.init = function () {
        this.body = createBody();
        // position on top of ground and to side
        var bbox = new THREE.Box3().setFromObject(this.body);
        this.body.position.y = - bbox.min.y;
        this.body.position.x = 0;
        this.body.position.z = - 10;
    };
    exports.getRenderData = function () {
        return [this.body];
    };
    exports.doAnimation = function() {
        var time = Date.now() * 0.001;
        this.body.rotation.y = time / 2;
    };
    function createBody() {
        var geometry = new THREE.SphereBufferGeometry( 1, 32, 32, 0, Math.PI * 1.4 );
        var imgTexture = new THREE.TextureLoader().load('img/sandbox/1f601.png');

        var material = new THREE.MeshLambertMaterial( {
            map: imgTexture, color: 0xaabbcc, transparent: true, emissive: 0x600000
        } );
        var mesh = new THREE.Mesh( geometry, material );
        material_ui.setMaterialUI(material);
        return mesh;
    }
});