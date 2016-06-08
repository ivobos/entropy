define(["exports", "./modules"], function(exports, modules) {
    exports.initEarly = function() {
        this.apps = {};
        this.add("Entropy", "apps/entropy/launcher");
        this.add("Voxels", "apps/voxels/loader");
        this.currentApp = null;
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
            modules.callModuleMethod(this.apps[this.currentApp].loader, "stop");
        }
        // Now start new app
        modules.requestModuleLoadAndCallbackOnDone(this.apps[appName].loader, "launcher", function() {
            modules.callModuleMethod(this.apps[appName].loader, "run");
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

});
