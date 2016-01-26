var ivobos_20160126_fps_main = (function() {
    var IMG_TILE = "download.jpeg";
    var renderer = PIXI.autoDetectRenderer(640, 480);
    document.body.appendChild(renderer.view);
    // for usage see https://github.com/kittykatattack/scaleToWindow
    scaleToWindow(renderer.view);
    window.addEventListener("resize", function(event){
        scaleToWindow(renderer.view);
    });

    var stage = new PIXI.Container();

    var tileSprite;
    var count = 0;
    var fpsText;
    PIXI.loader
        .add(IMG_TILE)
        .load(setup);

    function setup() {
        var tileTexture = PIXI.loader.resources[IMG_TILE].texture;
        tileSprite = new PIXI.extras.TilingSprite(tileTexture, renderer.width, renderer.height);
        stage.addChild(tileSprite);
        fpsText = new PIXI.Text('FPS',{font : '14px Arial', fill : 0xf0f0f0, align : 'center'});
        stage.addChild(fpsText);
        animate();
    }

    var lastTimestamp = null;
    function animate(timestamp) {

        if (timestamp) {
            if (lastTimestamp) {
                var measuredFps = Math.round(1000 / (timestamp - lastTimestamp));
                fpsText.text = "FPS:"+measuredFps;
            }
            lastTimestamp = timestamp;
        }
        count += 0.005;

        tileSprite.tileScale.x = 1 + Math.sin(count) / 10;
        tileSprite.tileScale.y = 1 + Math.sin(count) / 10;

        tileSprite.tilePosition.x = 100 * Math.sin(count);
        tileSprite.tilePosition.y = 100 * count;

        // render the root container
        renderer.render(stage);

        requestAnimationFrame(animate);
    }

    return {};
})();

