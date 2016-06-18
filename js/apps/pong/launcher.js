define(['exports','kernel/modules'], function(exports, modules) {
    var appKey = "pong";
    var moduleNames = [
        "apps/lib/container",
        "apps/lib/camera",
        "apps/lib/lights",
        "apps/lib/renderer",
        "apps/lib/loop",
        "apps/lib/physics",
        "apps/pong/pong"
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
    exports.endApp = function() {
        console.log("stopping "+appKey);
        modules.disableModules(appKey);
    };
});