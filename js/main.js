// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('ground_1x1', 'assets/block.png');
	game.load.image('dude','assets/phaser-dude.png');
}

var map;
var layer1;
var layer2;
var layer3;

var marker;
var currentTile = 0;
var currentLayer;

var cursors;
var showLayersKey;
var layer1Key;
var layer2Key;
var layer3Key;

var sprite;
var tileSelector;
var tileStrip;

function create() {


	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';

    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Add a Tileset image to the map
    map.addTilesetImage('ground_1x1');
	map.setCollisionBetween(1, 12);
    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer1 = map.create('level1', 40, 30, 32, 32);
	
    layer1.scrollFactorX = 0.5;
    layer1.scrollFactorY = 0.5;

	//adding goal
	tileSelector = game.add.group();
	tileStrip = tileSelector.create(1, 100, 'ground_1x1');
	tileStrip.fixedToCamera=true;
	
	sprite=game.add.sprite(50,50,'dude');
	game.physics.enable(sprite,Phaser.Physics.ARCADE);
	
	sprite.body.bounce.set(0.6);
    sprite.body.tilePadding.set(32);
	
	game.camera.follow(sprite);

    game.physics.arcade.gravity.y = 25;
	
    //  Resize the world
    layer1.resizeWorld();

    layer2 = map.createBlankLayer('level2', 40, 30, 32, 32);
    layer2.scrollFactorX = 0.8;
    layer2.scrollFactorY = 0.8;

    layer3 = map.createBlankLayer('level3', 40, 30, 32, 32);

    currentLayer = layer1;
	game.physics.enable(currentLayer,Phaser.Physics.ARCADE);
    //  Create our tile selector at the top of the screen
    createTileSelector();

    game.input.addMoveCallback(updateMarker, this);

    cursors = game.input.keyboard.createCursorKeys();

    showLayersKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    layer1Key = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    layer2Key = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    layer3Key = game.input.keyboard.addKey(Phaser.Keyboard.THREE);

    showLayersKey.onDown.add(changeLayer, this);
    layer1Key.onDown.add(changeLayer, this);
    layer2Key.onDown.add(changeLayer, this);
    layer3Key.onDown.add(changeLayer, this);

    console.log(layer1.index);
    console.log(layer2.index);
    console.log(layer3.index);

}

function changeLayer(key) {

    switch (key.keyCode)
    {
        case Phaser.Keyboard.SPACEBAR:
            layer1.alpha = 1;
            layer2.alpha = 1;
            layer3.alpha = 1;
            break;

        case Phaser.Keyboard.ONE:
            currentLayer = layer1;
            layer1.alpha = 1;
            layer2.alpha = 0.2;
            layer3.alpha = 0.2;
            break;

        case Phaser.Keyboard.TWO:
            currentLayer = layer2;
            layer1.alpha = 0.2;
            layer2.alpha = 1;
            layer3.alpha = 0.2;
            break;

        case Phaser.Keyboard.THREE:
            currentLayer = layer3;
            layer1.alpha = 0.2;
            layer2.alpha = 0.2;
            layer3.alpha = 1;
            break;
    }

}

function pickTile(sprite, pointer) {

    currentTile = game.math.snapToFloor(pointer.x, 32) / 32;
	
}

function updateMarker() {

    marker.x = currentLayer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = currentLayer.getTileY(game.input.activePointer.worldY) * 32;

    if (game.input.mousePointer.isDown)
    {
        map.putTile(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), currentLayer);
        // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);
    }

}

function update() {

	//window.alert(tileSelector);
	if(game.physics.arcade.collide(sprite, tileStrip))
		{
			sprite.body.velocity.setTo(50,0);
		}
	
	sprite.body.velocity.setTo(100,0);
	sprite.animations.add('walk');
	sprite.animations.play('walk', 30, true);
	
    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

}


function createTileSelector() {

    //  Our tile selection window
    
	game.physics.enable(tileSelector,Phaser.Physics.ARCADE);
    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.5);
    tileSelectorBackground.drawRect(0, 0, 800, 34);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(pickTile, this);

    tileSelector.fixedToCamera = true;

    //  Our painting marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);

}