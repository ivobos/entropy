var ivobos_20160125_scaleToWindow_main = (function() {
    var renderer = PIXI.autoDetectRenderer(640, 200);

    document.body.appendChild(renderer.view);

    // for usage see https://github.com/kittykatattack/scaleToWindow
    scaleToWindow(renderer.view);
    window.addEventListener("resize", function(event){
        scaleToWindow(renderer.view);
    });

    var stage = new PIXI.Container();

    PIXI.loader
        .add("tile.png")
        .load(setup);

    var tileSprite;
    var count = 0;

    function setup() {
        var tileTexture = PIXI.loader.resources["tile.png"].texture;
        tileSprite = new PIXI.extras.TilingSprite(tileTexture, renderer.width, renderer.height);
        stage.addChild(tileSprite);
        animate();
    }

    function animate() {

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

