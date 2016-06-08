define(["exports", "kernel/modules"], function(exports, modules) {
    var appKey = "entropy";
    var moduleNames = [
        'apps/entropy/threejs_canvas_geometry_hierarchy'
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
    };
    exports.stop = function() {
        console.log("stopping "+appKey);
        modules.disableModules(appKey);
    };
});