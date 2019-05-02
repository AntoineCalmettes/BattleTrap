var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 620,
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                y: 2000
            }
        }
    }
};

// =============================================================================
// sprites
// =============================================================================
//
// hero sprite
//
function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}


// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 500;
    let canJump = this.body.touching.down;

    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
};

// =============================================================================
// game states
// =============================================================================

PlayState = {};

PlayState.init = function () {
    this.game.renderer.renderSession.roundPixels = true;

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });

    this.keys.up.onDown.add(function () {
        let didJump = mage.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
};

PlayState.preload = function () {
    this.game.load.json('level:1', 'data/level01.json');
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('background1', 'images/background1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('grass:1x1:noborder', 'images/grass_1x1_noborder.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:2x1:noborder', 'images/grass_2x1_noborder.png');
    this.game.load.image('lava', 'images/lava.png');
    this.game.load.image('plant', 'images/Plant.png');
    this.game.load.image('lava_bouncing', 'images/lava_bouncing.png');
    this.game.load.image('doorClosed', 'images/door-closed.png');
    this.game.load.image('echelle', 'images/echelle.png');
    this.game.load.image('mage', 'images/mage_stopped.png');
    this.game.load.image('mage1', 'images/mage1_stopped.png');
    this.game.load.image('castle', 'images/castle.png');
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
};
var map;
var movingGrasseY;
var movingGrasseX;
var movingGrasseXCastle;
var echelle1;
var echelle2;
var block;
var lava;
var platformH;
PlayState.create = function () {
    // create sound entities
    this.sfx = {
        jump: this.game.add.audio(''),
        coin: this.game.add.audio(''),
    };

    map = this.game.add.image(0, 0, 'background');
    setInterval(() => {
        if (timeMap !== 0) {
            timeMap -= 1;
            stars()
        }
    }, 300)


    function stars() {
        if (timeMap % 2 == 0) {
            map.loadTexture('background1', 0);
        } else {
            map.loadTexture('background', 0);
        }
    };

    this._loadLevel(this.game.cache.getJSON('level:1'));
};

var timeMap = 10000;
PlayState.update = function () {

    this._handleCollisions();
    this._handleInput();
    if ((mage.position.y > 300 && mage.position.y < 400) && (mage.position.x > 40 && mage.position.x < 60)) {
        if (this.keys.up.isDown) { // move hero left
            mage.position.y -= 100;
        }
    }
};

function spriteVsMovinPlatformY(mage, platForm) {
    if ((mage.body.y < platForm.body.y)) {
        mage.body.y = platForm.body.y - mage.body.height;
    }
}

function spriteVsMovinPlatformX(mage, platForm) {
    mage.body.y = platForm.body.y - mage.body.height;
    mage.body.x = platForm.body.x;
}

    // PLANT--------------------------------------------------

    // POSITION PLANT IN EARTH
    plant = this.platformsMovable.create(600,600,'plant');
 
    // PLANT MOVE 
    this.game.add.tween(plant).to({
        y: plant.position.y - 50
    }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
    plant.body.setSize(plant.width, plant.height);
    // END PLANT-------------------------------------------


PlayState._handleCollisions = function () {

    this.game.physics.arcade.collide(mage, this.platforms);
    this.game.physics.arcade.collide(mage, platformH);
    this.game.physics.arcade.collide(mage, this.lava);
    this.game.physics.arcade.overlap(mage, this.lava, this._onHeroVsCoin,
        null, this);
    this.physics.arcade.collide(mage, movingGrasseY, spriteVsMovinPlatformY, null, this);
    this.physics.arcade.collide(mage, movingGrasseXCastle, spriteVsMovinPlatformX, null, this);
};

PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        mage.move(-1);
    } else if (this.keys.right.isDown) { // move hero right
        mage.move(1);
    } else { // stop
        mage.move(0);
    }
};

PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.platforms = this.game.add.group();

    this.lava = this.game.add.physicsGroup();

    this.platformsMovable = this.add.physicsGroup();

    movingGrasseY = this.platformsMovable.create(105, 560, 'grass:2x1');
    movingGrasseXCastle = this.platformsMovable.create(760, 570, 'grass:2x1');

    echelle1 = this.game.add.sprite(40, 304, 'echelle');
    echelle2 = this.game.add.sprite(40, 364, 'echelle');

    this.platformsMovable.setAll('body.allowGravity', false);
    this.platformsMovable.setAll('body.immovable', true);

    this.game.add.tween(movingGrasseY).to({
        y: movingGrasseY.position.y - 140
    }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
    movingGrasseY.body.setSize(movingGrasseY.width, movingGrasseY.height);


    movingGrasseXCastle.body.setSize(movingGrasseXCastle.width, movingGrasseXCastle.height);
    this.game.add.tween(movingGrasseXCastle).to({
        x: movingGrasseXCastle.position.x + 250
    }, 4000, Phaser.Easing.Linear.None, true, 0, -1, true);


    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);
    // spawn hero and enemies
    this._spawnCharacters({
        hero: data.hero,
        spiders: data.spiders
    });

    // spawn important objects
    data.lava.forEach(this._spawnLava, this);
    this.platformsMovabl = this.add.physicsGroup();
    platformH = this.platformsMovabl.create(240, 250, 'grass:2x1');
    this.platformsMovabl.setAll('body.allowGravity', false);
    this.platformsMovabl.setAll('body.immovable', true);
    platformH.body.kinematic = true;
    this.game.add.tween(platformH.body).to({x: '+150'}, 2000, Phaser.Easing.Linear.None).to({x: '-150'}, 2000, Phaser.Easing.Linear.None).yoyo().loop().start();

    // enable gravity
    const GRAVITY = 1500;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

var mage;
var timeMage = 10000;

PlayState._spawnCharacters = function (data) {
    // spawn hero
    mage = new Hero(this.game, data.hero.x, data.hero.y);
    setInterval(() => {
        if (timeMage !== 0) {
            timeMage -= 1;
            mageMovin()
            this.game.add.existing(mage);
        }
    }, 300)


    function mageMovin() {
        if (timeMage % 2 == 0) {
            mage.loadTexture('mage', 0, false);
            mage.body.setSize(mage.width, mage.height);
        } else {
            mage.loadTexture('mage1', 0, false);
            mage.body.setSize(mage.width, mage.height);
        }
    };

};

PlayState._spawnLava = function (coin) {
    let sprite = this.lava.create(coin.x, coin.y, 'lava');
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

PlayState._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play();
    //coin.kill();
};

// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    var game = new Phaser.Game(config);
    game.state.add('play', PlayState);
    game.state.start('play');
};
