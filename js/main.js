const RIGHT = 1;
const LEFT = -1;
const UP = 0;
const STAND = 0;

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
function Hero(game, x, y, sprites) {
    this.sprites = sprites;
    Phaser.Sprite.call(this, game, x, y, sprites);
    this.anchor.set(0.5, 0.5);
    this.animations.add('right', [2, 3], 3, true);
    this.animations.add('stand', [0], 1, true);
    this.animations.add('left', [4, 5], 3, true);
    this.animations.add('up', [1, 6], 3, true);
    // heroWarriorSprite.animations.add('right', [4, 5], 10, true);
    this.animations.play('right');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}


// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function(direction) {
    const SPEED = 200;
    //this.body.velocity.x = direction * SPEED;

    switch (direction) {
        case RIGHT:
            this.body.position.x += 3;
            this.animations.play('right');
            break;
        case UP:
            this.animations.play('up');
            break;
        case LEFT:
            this.body.position.x -= 3;
            this.animations.play('left');
            break
        default:

    }
};

Hero.prototype.jump = function() {
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

PlayState.init = function() {
    this.game.renderer.renderSession.roundPixels = true;

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });

    this.keys.up.onDown.add(function() {
        let didJump = mage.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
};

PlayState.preload = function() {
    this.game.load.json('level:1', 'data/level01.json');
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('background1', 'images/background1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('grass:1x1:noborder', 'images/grass_1x1_noborder.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:2x1:noborder', 'images/grass_2x1_noborder.png');
    this.game.load.image('lava', 'images/lava.png');
    this.game.load.image('lava_bouncing', 'images/lava_bouncing.png');
    this.game.load.image('doorClosed', 'images/door-closed.png');
    this.game.load.image('echelle', 'images/echelle.png');
    this.game.load.image('mage', 'images/mage_stopped.png');
    this.game.load.image('mage1', 'images/mage1_stopped.png');
    this.game.load.image('castle', 'images/castle.png');
    this.game.load.image('plant', 'images/plant.png');
    this.game.load.spritesheet('heroWarrior', 'images/playerWar/warrior_animated.png', 61, 45, 10);
    this.game.load.image('flag', 'images/flag.png');
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
var lavaBouncing;
var heroWarriorSprite;

PlayState.create = function() {

    // ajouter hero
    heroWarriorSprite = this.game.add.sprite(600, 45, 'heroWarrior');
    heroWarriorSprite.frame = 0;

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
PlayState.update = function() {

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

// Fonction propre au colline physic
function spriteMovinPlant(mage, platForm) {
    if(mage.body.x >= 550){
        mage.body.y = 550;
        mage.body.x = 650;

    } else {
        mage.body.y = 535;
        mage.body.x = 500;
    }
        
    
}



PlayState._handleCollisions = function() {

    this.game.physics.arcade.collide(mage, this.platforms);
    this.game.physics.arcade.collide(mage, platformH);
    this.physics.arcade.collide(mage, movingGrasseY, spriteVsMovinPlatformY, null, this);
    this.physics.arcade.collide(mage, movingGrasseXCastle, spriteVsMovinPlatformX, null, this);
    this.game.physics.arcade.collide(mage, plant, spriteMovinPlant, null, this);
};

PlayState._handleInput = function() {
    if (this.keys.left.isDown) { // move hero left
        mage.move(-1);
        heroWarriorSprite.animations.play('left');
    } else if (this.keys.right.isDown) { // move hero right
        mage.move(1);
        heroWarriorSprite.animations.play('right');
    } else if (this.keys.up.isDown) { // move hero up
        mage.move(0);
        heroWarriorSprite.animations.play('up');
    } else { // stop
        heroWarriorSprite.animations.play('stand');
    }
};

PlayState._loadLevel = function(data) {
    // create all the groups/layers that we need
    this.platforms = this.game.add.group();

    this.flags = this.game.add.group();

    this.platformsMovable = this.add.physicsGroup();

    movingGrasseY = this.platformsMovable.create(105, 560, 'grass:2x1');
    movingGrasseXCastle = this.platformsMovable.create(760, 570, 'grass:2x1');

    echelle1 = this.game.add.sprite(40, 304, 'echelle');
    echelle2 = this.game.add.sprite(40, 364, 'echelle');

    // PLANT--------------------------------------------------

    // POSITION PLANT IN EARTH
    plant = this.platformsMovable.create(600, 600, 'plant');
    // PLANT MOVE 
    this.game.add.tween(plant).to({
        y: plant.position.y - 35
    }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
    plant.body.setSize(plant.width, plant.height);
    // END PLANT-------------------------------------------

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
        hero: data.hero
    });

    // spawn important objects
    this.platformsMovabl = this.add.physicsGroup();
    platformH = this.platformsMovabl.create(240, 250, 'grass:2x1');
    this.platformsMovabl.setAll('body.allowGravity', false);
    this.platformsMovabl.setAll('body.immovable', true);
    platformH.body.kinematic = true;
    this.game.add.tween(platformH.body).to({
        x: '+150'
    }, 2000, Phaser.Easing.Linear.None).to({
        x: '-150'
    }, 2000, Phaser.Easing.Linear.None).yoyo().loop().start();

    // enable gravity
    const GRAVITY = 1500;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnPlatform = function(platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

var mage;
var timeMage = 10000;

PlayState._spawnCharacters = function(data) {
    // spawn hero
    mage = new Hero(this.game, data.hero.x, data.hero.y, 'heroWarrior');
    mage.body.setSize(mage.width, mage.height);
    this.game.add.existing(mage);
};

PlayState._spawnflag = function(flag) {
    let sprite = this.flags.create(flag.x, flag.y, 'flag');
    sprite.anchor.set(0.5, 0.5);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
};


PlayState._onHeroVsflag = function(hero, flag) {
    this.sfx.flag.play();
    flag.kill();
};

// =============================================================================
// entry point
// =============================================================================

window.onload = function() {
    var game = new Phaser.Game(config);
    game.state.add('play', PlayState);
    game.state.start('play');
};