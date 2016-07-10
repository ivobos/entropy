requirejs.config({
    // bust browser caching, see http://stackoverflow.com/questions/8315088/prevent-requirejs-from-caching-required-scripts
    urlArgs: "bust=v0.0.8"
});
requirejs(['kernel/lib/three', 'kernel/modules'], function(three, modules) {
    var appKey = "kernel";
    var moduleConfig = {
        "kernel/stats" : { enabled: true},
        "kernel/modules_ui" : { enabled: true},
        "kernel/apps" : { enabled: true},
        "kernel/menu" : { enabled: true},
        "kernel/livereload" : { enabled: true}
    };
    for (var moduleKey in moduleConfig) {
        modules.requestModuleLoad(moduleKey, appKey);
    }
    modules.whenAllModulesLoaded(function() {
        modules.initModules(appKey);
        for (var moduleKey in moduleConfig) {
            if (moduleConfig[moduleKey].enabled) {
                modules.enableModule(moduleKey);
            }
        }
        modules.callModuleMethod("kernel/apps", "runDefaultApp");
    });
});
