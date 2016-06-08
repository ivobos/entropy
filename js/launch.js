requirejs(['kernel/lib/three', 'kernel/modules'], function(three, modules) {
    modules.init();
    modules.requestModuleLoad("kernel/stats", "kernel");
    modules.requestModuleLoad("kernel/modules_ui", "kernel");
    modules.requestModuleLoad("kernel/apps", "kernel");
    modules.requestModuleLoad("kernel/menu", "kernel");
    modules.requestModuleLoad("kernel/livereload", "kernel");
    modules.whenAllModulesLoaded(function() {
        modules.initModules("kernel");
        modules.enableModules("kernel");
        modules.callModuleMethod("kernel/apps", "runDefaultApp");
    });
});