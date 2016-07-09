define(['exports'], function(exports) {
    exports.getModuleConfig = function() {
        return {
            "apps/lib/container" : { enabled: true},
            'apps/voxels/camera' : { enabled: true},
            'apps/voxels/scene' : { enabled: true},
            'apps/voxels/avatar/sphere' : { enabled: true},
            'apps/voxels/debug_panel' : { enabled: true},
            'apps/voxels/center' : { enabled: true},
            'apps/voxels/dev_orientation' : { enabled: true},
            'apps/voxels/voxels' : { enabled: true},
            'apps/voxels/keyboard' : { enabled: true},
            'apps/voxels/touch' : { enabled: true},
            'apps/voxels/mouse' : { enabled: true},
            "apps/voxels/terrain/flat" : { enabled: true},
            "apps/voxels/lights" : { enabled: true},
            "apps/voxels/renderer" : { enabled: true}
        };
    };
});