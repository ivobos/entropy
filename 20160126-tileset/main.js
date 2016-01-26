var ivobos_20160126_tileset_main = (function() {

    var NUM_TILE_ROWS = 16;
    var NUM_TILE_COLS = 12;
    var TILE_WIDTH = 32;
    var TILE_HEIGHT = 32;

    var renderer = PIXI.autoDetectRenderer(NUM_TILE_COLS * TILE_WIDTH, NUM_TILE_ROWS * TILE_HEIGHT);
    document.body.appendChild(renderer.view);
    scaleToWindow(renderer.view);
    window.addEventListener("resize", function(event){
        scaleToWindow(renderer.view);
    });

    var stage = new PIXI.Container();

    PIXI.loader
        .add("mountain_landscape.png")
        .load(setup);

    var tiles;
    var count = 0;

    function setup() {
        var texture = PIXI.loader.resources["mountain_landscape.png"].texture;
        tiles = [];
        for (var col = 0; col < NUM_TILE_COLS; col++) {
            tiles[col] = [];
            for (var row = 0; row < NUM_TILE_ROWS; row++) {
                var tile = new PIXI.extras.TilingSprite(texture, TILE_WIDTH, TILE_HEIGHT);
                tile.tilePosition = new PIXI.Point(-TILE_WIDTH*randomInt(0, texture.width / TILE_WIDTH),
                                                   -TILE_HEIGHT*randomInt(0, texture.height / TILE_HEIGHT));
                tile.x = col * TILE_WIDTH;
                tile.y = row * TILE_HEIGHT;
                tiles[col][row] = tile;
                stage.addChild(tile);
            }
        }
        animate();
    }

    function animate() {
        count += 0.005;

        // render the root container
        renderer.render(stage);

        requestAnimationFrame(animate);
    }

    function randomInt(minimum, maximum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    return {};
})();

