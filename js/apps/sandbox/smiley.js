define(['exports', "apps/lib/material_ui"], function(exports, material_ui) {
    var imgTexture = new THREE.TextureLoader().load('img/sandbox/1f601.png');
    var faceGeometry = new THREE.SphereBufferGeometry( 1.0, 16, 16, -0.2 * Math.PI, 1.4 * Math.PI);
    var backGeometry = new THREE.SphereBufferGeometry( 0.99, 8,  8,  0.8 * Math.PI, 1.4 * Math.PI);
    var faceMaterial = new THREE.MeshLambertMaterial( {
        map: imgTexture, color: 0xffffff, transparent: true, emissive: 0x000000
    });
    var backMaterial = new THREE.MeshLambertMaterial({ color: 0xffdd67});
    var bodies;
    exports.onLoad = function() {
        bodies = [];
        for (var i = 0; i < 6; i++) {
            var body = new THREE.Object3D();
            body.add(new THREE.Mesh(faceGeometry, faceMaterial));
            body.add(new THREE.Mesh(backGeometry, backMaterial));
            // position on top of ground and to side
            var bbox = new THREE.Box3().setFromObject(body);
            body.position.y = - bbox.min.y;
            body.position.x = 4 * (i % 5) - 5;
            body.position.z = - 4 * (i % 2) + 1;
            body.userData.velocity = new THREE.Vector3(i/60, 0, (i%2)/60);
            body.add(new THREE.AxisHelper( 2 ));
            bodies.push(body);
        }
    };
    exports.init = function () {
        material_ui.setMaterialUI(faceMaterial);
    };
    exports.getPhysicsData = function() {
        return bodies;
    };
    exports.getRenderData = function () {
        return bodies;
    };
    exports.doAnimation = function() {
        var time = Date.now() * 0.001;
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            body.rotation.y = (time + i);
            var acceleration = new THREE.Vector3();
            var forward = new THREE.Vector3(0, 0, 1);
            forward.applyQuaternion(body.getWorldQuaternion());
            // if close origin
            if (body.position.lengthSq() < 80) {
                // move away from origin when facing away
                if (forward.dot(body.position) > 0) {
                    forward.multiplyScalar(0.001);
                    acceleration.add(forward);
                }
            } else { // otherwise we must be far from origin
                // move towards origin when facing inward
                if (forward.dot(body.position) < 0) {
                    forward.multiplyScalar(0.001);
                    acceleration.add(forward);
                }
            }
            // deceleration due to friction/air drag
            var dragAccel = body.userData.velocity.clone().multiplyScalar(-0.01);
            acceleration.add(dragAccel);
            acceleration.y = 0;
            body.userData.acceleration = acceleration;
        }
    };
});