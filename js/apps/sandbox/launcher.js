define(["exports"], function(exports) {
    exports.getModuleConfig = function() {
        return {
            "apps/lib/container": { enabled: true},
            "apps/lib/scene": { enabled: true},
            "apps/lib/camera": { enabled: true},
            "apps/lib/lights": { enabled: true},
            "apps/lib/renderer": { enabled: true},
            "apps/lib/loop": { enabled: true},
            "apps/lib/mouse": { enabled: true},
            "apps/lib/touch": { enabled: true},
            "apps/lib/orientation": { enabled: true},
            "apps/lib/camshake": {enabled: true},
            "apps/lib/pointer": {enabled: true},
            "apps/lib/material_ui": {enabled: true},
            "apps/lib/physics": {enabled: true},
            "apps/sandbox/grip": {enabled: true},
            "apps/sandbox/ground": {enabled: true},
            "apps/sandbox/slinky": {enabled: true},
            "apps/sandbox/guble": {enabled: true},
            "apps/sandbox/smiley": {enabled: true}
        };
    };
});