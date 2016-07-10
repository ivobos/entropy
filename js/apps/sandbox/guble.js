define(['exports'], function(exports) {
    exports.init = function () {
        this.body = createBody();
        this.skeleton = new THREE.SkeletonHelper(this.body);
        // position on top of ground and to side
        var bbox = new THREE.Box3().setFromObject(this.body);
        this.body.position.y = - bbox.min.y;
        this.body.position.x = 35;
        this.body.position.z = 35;
        this.body.userData.velocity = new THREE.Vector3(0, 0, 0);
        this.body.add(new THREE.AxisHelper( 1 ));
    };
    exports.getPhysicsData = function() {
        return [this.body];
    };
    exports.getRenderData = function () {
        this.skeleton.update();
        return [this.body, this.skeleton];
    };
    exports.doAnimation = function() {
        var time = Date.now() * 0.001;
        this.body.rotation.y = time / 2;
        this.body.skeleton.bones[1].rotation.x = Math.sin(time) / 5;
        var body = this.body;
        // calculate acceleration
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
        var dragAccel = this.body.userData.velocity.clone().multiplyScalar(-0.01);
        acceleration.add(dragAccel);
        acceleration.y = 0;
        this.body.userData.acceleration = acceleration;

//        this.body.skeleton.bones[1].rotation.y = Math.sin(time);
//        this.body.skeleton.bones[1].rotation.y = Math.cos(time);
//        this.body.position.x = - 3 +  Math.sin(time);
//        this.body.rotation.y = time;
    };
    function createBody() {
        var body_len = 1.4;
        var body_width = 0.9;
        var body_height = 1;
        var vertex_rightfoot = 2;
        var bone_body = 0;
        var bone_rightshoulder = 1;
        var bone_rightfoot = 2;

        var geometry = new THREE.BoxGeometry(body_width, body_height, body_len, 1, 1, 1 );
        for ( var i = 0; i < geometry.vertices.length; i ++ ) {
            console.log("vertex "+ i + ",x="+geometry.vertices[i].x+",y="+geometry.vertices[i].y+",z="+geometry.vertices[i].z);
        }
        for ( var i = 0; i < geometry.vertices.length; i ++ ) {
            var skinIndex = bone_body;
            var weight = 0;
            if (i == vertex_rightfoot) {
                skinIndex = bone_rightfoot;
                weight  = 1;
            }
            geometry.skinIndices.push( new THREE.Vector4( skinIndex, 0, 0, 0 ) );
            geometry.skinWeights.push( new THREE.Vector4(weight, 0, 0, 0 ) );
        }

//        geometry.vertices[vertex_rightfoot].x += 1;
        var bones1 = [];
        bones1.push(new THREE.Bone());
        bones1.push(new THREE.Bone());
        bones1.push(new THREE.Bone());
        bones1[bone_rightshoulder].position.z = body_width / 4;
        bones1[bone_rightshoulder].position.x = body_len / 4;
        bones1[bone_rightfoot].position.y = -body_height / 2;
        bones1[bone_rightfoot].position.z = body_width / 4;
        bones1[bone_rightfoot].position.x = body_len / 4;
        bones1[bone_body].add(bones1[bone_rightshoulder]);
        bones1[bone_rightshoulder].add(bones1[bone_rightfoot]);
        var frontTexture = new THREE.TextureLoader().load('img/sandbox/guble/sprite_0.png');
        var topTexture = new THREE.TextureLoader().load('img/sandbox/guble/sprite_1.png');
        var backTexture = new THREE.TextureLoader().load('img/sandbox/guble/sprite_2.png');
        var leftTexture = new THREE.TextureLoader().load('img/sandbox/guble/sprite_3.png');
        leftTexture.wrapS = THREE.RepeatWrapping;
        leftTexture.repeat.x = - 1;
        var rightTexture = new THREE.TextureLoader().load('img/sandbox/guble/sprite_3.png');
        var bottomTexture = new THREE.TextureLoader().load('img/sandbox/guble/sprite_4.png');
        var materials = [
            new THREE.MeshLambertMaterial({ map: leftTexture, skinning: true }),
            new THREE.MeshLambertMaterial({ map: rightTexture, skinning: true }),
            new THREE.MeshLambertMaterial({ map: topTexture, skinning: true }),
            new THREE.MeshLambertMaterial({ map: bottomTexture, skinning: true }),
            new THREE.MeshLambertMaterial({ map: frontTexture, skinning: true }),
            new THREE.MeshLambertMaterial({ map: backTexture, skinning: true }),
        ];
        var material = new THREE.MeshFaceMaterial(materials);
        //var material = new THREE.MeshPhongMaterial( {
        //    skinning : true,
        //    color: 0x156289,
        //    emissive: 0x072534,
        //    side: THREE.DoubleSide,
        //    shading: THREE.FlatShading
        //} );
        var body = new THREE.SkinnedMesh(geometry, material);
        var skeleton1 = new THREE.Skeleton( bones1 );
        body.add( bones1[ 0 ] );
        body.bind( skeleton1 );
        //skeleton1.bones[ 0 ].rotation.y = -0.1;
        //skeleton1.bones[ 1 ].rotation.y = 0.2;
        return body;
    }
});