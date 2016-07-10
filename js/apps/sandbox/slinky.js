define(['exports'], function(exports) {
    exports.init = function() {
        this.mesh = createObject();
        // position on top of ground and to side
        var bbox = new THREE.Box3().setFromObject(this.mesh);
        this.mesh.position.y = -bbox.min.y;
        this.mesh.position.x = 0; // - 3 * bbox.min.x;
        this.mesh.position.z = 0; // 3 * bbox.min.z;
        this.skeleton = new THREE.SkeletonHelper(this.mesh);

    };
    exports.doAnimation = function() {
        var time = Date.now() * 0.001;
        for ( var i = 0; i < this.mesh.skeleton.bones.length; i ++ ) {
            this.mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 3 / this.mesh.skeleton.bones.length;
        }
        this.mesh.rotation.y = time / 2;
    };
    exports.getPhysicsData = function() {
        return [this.mesh];
    };
    exports.getRenderData = function() {
        this.skeleton.update();
        return [this.mesh, this.skeleton];
    };
    function createObject () {
        var segmentHeight = 1;
        var segmentCount = 4;
        var height = segmentHeight * segmentCount;
        var halfHeight = height * 0.5;
        var sizing = {
            segmentHeight : segmentHeight,
            segmentCount : segmentCount,
            height : height,
            halfHeight : halfHeight
        };
        var geometry = createGeometry( sizing );
        var bones = createBones( sizing );
        var mesh = createMesh( geometry, bones );
   //     mesh.scale.multiplyScalar( 1 );
        return mesh;
    }
    function createGeometry ( sizing ) {
        var geometry = new THREE.CylinderGeometry(
            1,                       // radiusTop
            1,                       // radiusBottom
            sizing.height,           // height
            8,                       // radiusSegments
            sizing.segmentCount * 3, // heightSegments
            true                     // openEnded
        );
        for ( var i = 0; i < geometry.vertices.length; i ++ ) {

            var vertex = geometry.vertices[ i ];
            var y = ( vertex.y + sizing.halfHeight );

            var skinIndex = Math.floor( y / sizing.segmentHeight );
            var skinWeight = ( y % sizing.segmentHeight ) / sizing.segmentHeight;

            geometry.skinIndices.push( new THREE.Vector4( skinIndex, skinIndex + 1, 0, 0 ) );
            geometry.skinWeights.push( new THREE.Vector4( 1 - skinWeight, skinWeight, 0, 0 ) );

        }
        return geometry;
    }
    function createBones ( sizing ) {
        var bones = [];
        var prevBone = new THREE.Bone();
        bones.push( prevBone );
        prevBone.position.y = - sizing.halfHeight;
        for ( var i = 0; i < sizing.segmentCount; i ++ ) {

            var bone = new THREE.Bone();
            bone.position.y = sizing.segmentHeight;
            bones.push( bone );
            prevBone.add( bone );
            prevBone = bone;

        }
        return bones;
    }
    function createMesh ( geometry, bones ) {
        var material = new THREE.MeshPhongMaterial( {
            skinning : true,
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading
        } );
        var mesh = new THREE.SkinnedMesh( geometry,	material );
        var skeleton = new THREE.Skeleton( bones );
        mesh.add( bones[ 0 ] );
        mesh.bind( skeleton );
        //skeletonHelper = new THREE.SkeletonHelper( mesh );
        //skeletonHelper.material.linewidth = 2;
        //scene.add( skeletonHelper );
        return mesh;
    }
});