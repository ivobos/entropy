/**
 * Every module has
 * - module key - used for loading the module via requirejs
 * - context - contextKey used to control lifecycle of a collection of modules
 * - enabled flag - modules start disabled, and are enabled in modules.enableModules(context)
 * - pending flag - indicates whether the module has loaded yet or not
 * App Launcher modules have
 * - launchApp method that is called to load and run an app
 * - endApp method that is called to stop and unload an app
 * App modules have
 * - module.onLoad method called from modules.initModules(context)
 * - module.initLate method called from modules.enableModules(context) before enableModule
 * - module.onEnable method called from modules.enableModules(context) after initLate
 *                   or when modules.enableModule(moduleKey)
 * - module.onDisable method called from modules.disableModule(moduleKey), if this method is absent a module can't be disabled
 * - module.onReload method called from modules.reloadModule(moduleKey), if this method is absent a module can't be reloaded
 * - module.onUpdate method - update in the main game loop, called 60 times a second,
 *                          not called when app is paused or when module is disabled
 * - module.beforeRenderEarly method - called to render the module content, called 0-60 times a second
 *                          not called when app is paused or module is disabled
 * - module.beforeRenderLate method - called to render the module content, called 0-60 times a second
 *                          not called when app is paused or module is disabled
 * - module.onRender method - called to perform rendering
 * Module lifecycle states
 *  - not loaded - module doesn't exist
 *  - loading/pending - module has been added via modules.requestModuleLoad
 *  - loaded but uninitialised - module is loaded but waiting for other modules to load
 *  - onLoad method called after the module is loaded
 *      - do not rely on dependent modules being in correct state
 *  - initialize/initLate - once off module initialisation
 *      - can rely on other modules having executed onLoad
 *      - should add our elements to other modules
 *  - onEnable - the module was enabled, can rely on initLate/init of dependent modules being called
 *      - this is the moment when the module can add it's elements and handlers to DOM
 *      - rendering lifecycle methods will be called after this
 *  - onDisable - the module is being disabled
 *      - this is the moment when the module must remove it's elements and handlers from DOM
 *      - rendering lifecycle methods will NOT be called after this
 *  - terminate - undo the setup done in initialize
 *      - remove our data from other modules
 *      - dependent modules have all been disabled, may or may not have been terminated, have NOT been unloaded
 *  - onUnload method called before the module is unloaded
 *      - do not rely on dependent modules being in correct state
 */
define(['exports'], function(exports) {
    exports.init = function() {
       this.modules = {}; // moduleKey -> { module:module, context:context, pending:true/false, enabled: true/false }
    };
    exports.addChangeListener = function(callback) {
        this.changeListener = callback;
    };
    exports.requestModuleLoad = function(moduleKey, contextKey) {
        this.modules[moduleKey] = {
            module: null,
            context: contextKey,
            pending: true,
            enabled: false
        };
        console.log("require "+moduleKey+" url="+require.toUrl(moduleKey+".js"));
        require([moduleKey], function(newmodule) {
            console.log("loaded "+moduleKey);
            this.modules[moduleKey].module = newmodule;
            this.modules[moduleKey].pending = false;
            this.callModuleMethod(moduleKey, "onLoad");
            this.callDoneIfReady();
        }.bind(this));
    };
    exports.requestModuleLoadAndCallbackOnDone = function(moduleKey, contextKey, callback) {
        this.requestModuleLoad(moduleKey, contextKey);
        this.whenAllModulesLoaded(callback);
    };
    exports.getModuleNames = function() {
        return Object.keys(this.modules);
    };
    exports.whenAllModulesLoaded = function(doneCallback) {
        if (this.doneCallback) {
            ssfdfds;
        }
        console.log("registering cb="+doneCallback);
        this.doneCallback = doneCallback;
        this.callDoneIfReady();
    };
    exports.callDoneIfReady = function() {
        var numPending = 0;
        for (var moduleKey in this.modules) {
            if (this.modules[moduleKey].pending) {
                numPending++;
            }
        }
        console.log("numPending="+numPending+" callback="+this.doneCallback);
        if (numPending === 0 && this.doneCallback) {
            var cb = this.doneCallback;
            this.doneCallback = null;
            cb();
        }
    };
    exports.initModules = function(contextKey) {
        console.log("initing modules for "+contextKey);
        this.forAllContextModulesCallMethod(contextKey, "initLate");
    };
    exports.enableModules = function(contextKey) {
        for (var moduleKey in this.modules) {
            if (this.modules[moduleKey].context === contextKey) {
                this.enableModule(moduleKey);
            }
        }
    };
    exports.disableModules = function(contextKey) {
        for (var moduleKey in this.modules) {
            if (this.modules[moduleKey].context === contextKey) {
                this.disableModule(moduleKey);
            }
        }
    };
    exports.canEnableModule = function(modname) {
        return this.modules[modname] && !this.modules[modname].enabled;
    };
    exports.enableModule = function(modname) {
        console.log("enable "+modname);
        if (this.canEnableModule(modname)) {
            this.modules[modname].enabled = true;
            var module = this.modules[modname].module;
            if (typeof module["onEnable"] === 'function') {
                module.onEnable();
            }
            this.changeListener({function: "enable", module: modname})
        }
    };
    exports.canDisableModule = function(modname) {
        var module = this.modules[modname].module;
        return module && this.modules[modname].enabled && typeof module["onDisable"] === 'function';
    };
    exports.disableModule = function(modname) {
        console.log("disable "+modname);
        if (this.canDisableModule(modname)) {
            var module = this.modules[modname].module;
            this.modules[modname].enabled = false;
            if (typeof module["onDisable"] === 'function') {
                module.onDisable();
            }
            this.changeListener({function: "disable", module: modname})
        }
    };
    exports.enableAll = function() {
        for (var moduleKey in this.modules) {
            exports.enableModule(moduleKey);
        }
    };
    exports.forAllContextModulesCallMethod = function(contextKey, methodName) {
        for (var moduleKey in this.modules) {
            if (this.modules[moduleKey].context === contextKey && typeof this.modules[moduleKey].module[methodName] === 'function') {
                this.modules[moduleKey].module[methodName]();
            }
        }
    };
    exports.callModuleMethods = function(methodName) {
        for (var moduleKey in this.modules) {
            var module = this.modules[moduleKey].module;
            if (module && typeof module[methodName] === 'function') {
                module[methodName]();
            }
        }
    };
    exports.callModuleMethodsWithData = function(getDataMethodName, processDataMethodName) {
        var data = [];
        for (var moduleKey in this.modules) {
            var module = this.modules[moduleKey].module;
            if (module && typeof module[getDataMethodName] === 'function') {
                data = data.concat(module[getDataMethodName]());
            }
        }
        for (var moduleKey in this.modules) {
            var module = this.modules[moduleKey].module;
            if (module && typeof module[processDataMethodName] === 'function') {
                module[processDataMethodName](data);
            }
        }
    };
    exports.callModuleMethod = function(moduleKey, methodName) {
        var module = this.modules[moduleKey].module;
        if (module && typeof module[methodName] === 'function') {
            module[methodName]();
        }
    };
    // WARNING: this doesn't reload properly
    // the problem is that what it does is to re-loads the js and creates a new "exports" object, so you will end up with two
    // instances of the module that was re-loaded, and other modules will reference the old module
    // the only scenario under which it works is if you don't have any other modules that depend on the
    // module that you are trying to re-load
    exports.canReloadModule = function(modname) {
        var module = this.modules[modname].module;
        return module && typeof module["onReload"] === 'function';
    };
    exports.reloadModule = function(modname) {
        console.log("reloading "+modname);
        if (this.canReloadModule(modname)) {
            var enabled = this.modules[modname].enabled;
            if (enabled) {
                this.disableModule(modname);
            }
            require.undef(modname);
            console.log("require "+modname+" url="+require.toUrl(modname+".js"));
            require([modname], function(newmodule) {
                console.log("loaded "+modname);
                this.modules[modname].module = newmodule;
                this.callModuleMethod(modname, "onLoad");
                this.callModuleMethod(modname, "initLate");
                if (enabled) {
                    this.enableModule(modname);
                }
            }.bind(this));
        }
    };
});
