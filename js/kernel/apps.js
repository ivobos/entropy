define(["exports", "./modules"], function(exports, modules) {
    exports.onLoad = function() {
        this.apps = {};
        this.add("Sandbox", "apps/sandbox/launcher");
        this.add("PONG", "apps/pong/pong");
        this.add("Entropy", "apps/entropy/launcher");
        // comment out Voxels for now because it doesn't unload correctly
        //this.add("Voxels", "apps/voxels/loader");
        this.currentApp = null;
    };
    exports.onEnable = function() {
        // having onEnable method and NOT a onDisable method will prevent this module from being disabled
    };
    exports.add = function(appName, loader) {
       this.apps[appName] = {
           name: appName,
           loader: loader,
           launched: false
       };
    };
    exports.getAppNames = function() {
        var appNames = [];
        for(var key in this.apps) {
            if(this.apps.hasOwnProperty(key)) { //to be safe
                appNames.push(key);
            }
        }
        return appNames;
    };
    exports.runApp = function(appName) {
        // stop currently running app
        if (this.currentApp) {
            var appKey = this.currentApp;
            endApp(appKey);
        }
        // Now start new app
        var appKey = appName;
        var loaderModuleKey = this.apps[appName].loader;
        modules.requestModuleLoadAndCallbackOnDone(loaderModuleKey, appKey, function() {
            var moduleConfig = modules.callModuleMethod(loaderModuleKey, "getModuleConfig");
            launchApp(appKey, moduleConfig);
            this.currentApp = appName;
        }.bind(this));
    };
    exports.getDefaultAppKey = function() {
        for (var appKey in this.apps) {
            return appKey;
        }
    };
    exports.runDefaultApp = function() {
        this.runApp(this.getDefaultAppKey());
    };
    function launchApp(appKey, moduleConfig) {
        console.log("launchApp "+appKey);
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
            console.log(appKey+" launched");
        });
    }
    function endApp(appKey) {
        console.log("stopping "+appKey);
        modules.disableModules(appKey);
    }
});
