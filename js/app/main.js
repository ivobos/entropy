define(['exports',"./../kernel/modules"], function(exports, modules) {
    exports.start = function() {
        modules.callModuleMethods("initEarly");
        modules.callModuleMethods("initLate");
        modules.enableAll();
    };
});
