define(['exports', 'kernel/modules'], function(exports, modules) {
    var appKey = "voxels";
    var moduleNames = [
//        'app/dev_accelerometer',
        "apps/lib/container",
        'apps/voxels/camera',
        'apps/voxels/scene',
        'apps/voxels/avatar/sphere',
        'apps/voxels/debug_panel',
        'apps/voxels/center',
        'apps/voxels/dev_orientation',
        'apps/voxels/voxels',
        'apps/voxels/keyboard',
        'apps/voxels/touch',
        'apps/voxels/mouse',
        "apps/voxels/terrain/flat",
        "apps/voxels/lights",
        "apps/voxels/renderer"
    ];
    exports.launchApp = function() {
        console.log("launching "+appKey);
        for (var i = 0, len = moduleNames.length; i < len; i++) {
            modules.requestModuleLoad(moduleNames[i], appKey);
        }
        modules.whenAllModulesLoaded(function() {
            modules.initModules(appKey);
            modules.enableModules(appKey);

        });
    };
    exports.endApp =  function() {
        modules.disableModules(appKey);
    };
});