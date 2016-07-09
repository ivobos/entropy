define(['exports'], function(exports) {
    // this is called from loop.js and the input is all objects collected from modules using getPhysicsData method
    exports.doPhysics = function(data) {
        for (var i = 0; i < data.length; i++) {
            var position = data[i].position;
            var velocity = data[i].userData.velocity;
            if (velocity) {
                position.add(velocity);
            }
            var aabb = data[i].userData.aabb;
            if (!aabb) {
                aabb = new THREE.Box3();
                data[i].userData.aabb = aabb;
            }
            aabb.setFromObject( data[i] );
        }
        elasticCollisions(data);
    };
    function elasticCollisions(data) {
        for (var i = 0; i < data.length - 1; i++) {
            for (var j = i + 1; j < data.length; j++) {
                var overlap = calcOverlap(data[i], data[j]);
                if (overlap.x > 0 && overlap.y > 0 && overlap.z > 0) {
                    var colNormal = calcCollisionNormal(overlap);
                    doElasticCollision(data[i], colNormal);
                    doElasticCollision(data[j], colNormal);
                }
            }
        }
    }
    function calcOverlap(objA, objB) {
        var Amax = objA.userData.aabb.max;
        var Amin = objA.userData.aabb.min;
        var Bmax = objB.userData.aabb.max;
        var Bmin = objB.userData.aabb.min;
        var xsep = Math.min(Bmax.x - Amin.x, Amax.x - Bmin.x);
        var ysep = Math.min(Bmax.y - Amin.y, Amax.y - Bmin.y);
        var zsep = Math.min(Bmax.z - Amin.z, Amax.z - Bmin.z);
        var overlap = new THREE.Vector3(xsep, ysep, zsep);
        return overlap;
    }
    function  calcCollisionNormal(overlap) {
        if (overlap.x < overlap.y && overlap.x < overlap.z) {
            return new THREE.Vector3(1, 0, 0);
        } else if (overlap.y < overlap.z) {
            return new THREE.Vector3(0, 1, 0);
        } else {
            return new THREE.Vector3(0, 0, 1);
        }
    }
    function doElasticCollision(obj, colNormal) {
        var velocity = obj.userData.velocity;
        if (velocity) {
            var deltaV = velocity.clone().projectOnVector(colNormal).multiplyScalar(-2);
            velocity.add(deltaV);
        }
    }
});
