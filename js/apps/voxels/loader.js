define(['exports', 'kernel/modules'], function(exports, modules) {
    var appKey = "voxels";
    var moduleNames = [
        'app/dev_accelerometer',
        'app/avatar/sphere',
        'app/debug_panel',
        'app/camera',
        'app/center',
        'app/dev_orientation',
        'app/voxels',
        'app/scene',
        'app/keyboard',
        'app/touch',
        'app/mouse',
        "app/terrain/flat",
        "app/lights",
        "app/container",
        "app/renderer"
    ];
    exports.run = function() {
        console.log("launching "+appKey);
        for (var i = 0, len = moduleNames.length; i < len; i++) {
            modules.requestModuleLoad(moduleNames[i], appKey);
        }
        modules.whenAllModulesLoaded(function() {
            modules.initModules(appKey);
            modules.enableModules(appKey);

        });
    }
});