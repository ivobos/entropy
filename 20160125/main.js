var ivobos_20160125_main = (function() {
    var renderer = PIXI.autoDetectRenderer(800, 600);

    document.body.appendChild(renderer.view);

    var stage = new PIXI.Container();

    PIXI.loader
        .add("tile.png")
        .add("players.png")
        .load(setup);

    var tileSprite;
    var playerSprite;
    var count = 0;

    function setup() {
        var tileTexture = PIXI.loader.resources["tile.png"].texture;
        var playerTexture = PIXI.loader.resources["players.png"].texture;
        tileSprite = new PIXI.extras.TilingSprite(tileTexture, renderer.width, renderer.height);
        playerSprite = new PIXI.Sprite(playerTexture);
        stage.addChild(tileSprite);
        stage.addChild(playerSprite);
        animate();
    }

    function animate() {

        count += 0.005;

        tileSprite.tileScale.x = 1 + Math.sin(count) / 10;
        tileSprite.tileScale.y = 1 + Math.sin(count) / 10;

        tileSprite.tilePosition.x = 100 * Math.sin(count);
        tileSprite.tilePosition.y = 100 * count;

        playerSprite.position.x = renderer.width / 2 - Math.sin(count) * 100;
        playerSprite.position.y = renderer.height / 2 - Math.cos(count) * 100;

        // render the root container
        renderer.render(stage);

        requestAnimationFrame(animate);
    }

    return {};
})();

