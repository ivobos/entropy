/**
 * Every module has
 * - module key - used for loading the module via requirejs
 * - context - contextKey used to control lifecycle of a collection of modules
 * - enabled flag - modules start disabled, and are enabled in modules.enableModules(context)
 * - pending flag - indicates whether the module has loaded yet or not
 * App Launcher modules have
 * - run method that is called to load and run an app
 * - stop method that is called to stop and unload an app
 * App modules have
 * - module.initEarly method called from modules.initModules(context)
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
 * Module lifecycle
 *  - not loaded - module doesn't exist
 *  - loading/pending - module has been added via modules.requestModuleLoad
 *  - loaded but unitialised - module is loaded but waiting for other modules to load
 *  - initialised/disabled - the module was initialised via modules.initModules(context) and may have been disabled via modules.disableModule(moduleKey)
 *      - disable modules should not be added to the DOM, should not have DOM event handles added and some of their rendering lifecycle methods will not be called
 *  - enabled - the module was enabled via modules.enableModules(context) or via modules.enableModule(moduleKey)
 *      - enabled modules will have components and event handlers added to DOM and their rendering lifecycle methods will be called
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
        this.forAllContextModulesCallMethod(contextKey, "initEarly");
    };
    exports.enableModules = function(contextKey) {
        this.forAllContextModulesCallMethod(contextKey, "initLate");
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
                this.callModuleMethod(modname, "initEarly");
                this.callModuleMethod(modname, "initLate");
                if (enabled) {
                    this.enableModule(modname);
                }
            }.bind(this));
        }
    };
});
