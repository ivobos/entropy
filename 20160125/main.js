var renderer = PIXI.autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// create a texture from an image path
var texture = PIXI.Texture.fromImage('tile.png');

var playerTexture = PIXI.Texture.fromImage('players.png');

/* create a tiling sprite ...
 * requires a texture, a width and a height
 * in WebGL the image size should preferably be a power of two
 */
var tilingSprite = new PIXI.extras.TilingSprite(texture, renderer.width, renderer.height);
var bunny = new PIXI.Sprite(playerTexture);

stage.addChild(tilingSprite);
stage.addChild(bunny);

var count = 0;

animate();

function animate() {

    count += 0.005;

    tilingSprite.tileScale.x = 1 + Math.sin(count) / 10;
    tilingSprite.tileScale.y = 1 + Math.sin(count) / 10;

    tilingSprite.tilePosition.x = 100 * Math.sin(count);
    tilingSprite.tilePosition.y = 100 * count;

    bunny.position.x = renderer.width / 2 - Math.sin(count) * 100;
    bunny.position.y = renderer.height / 2 - Math.cos(count) * 100;


    // render the root container
    renderer.render(stage);

    requestAnimationFrame(animate);
}
