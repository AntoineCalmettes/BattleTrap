const RIGHT = 1;
const LEFT = -1;
const UP = 0;
const STAND = 0;
const FIGHT = 2;
var jumpin = false;
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
    this.animations.add('stand', [0, 1], 3, true);
    this.animations.add('left', [4, 5], 3, true);
    this.animations.add('up', [6], 3, true);
    this.animations.add('fight', [8], 3, true);
    // heroWarriorSprite.animations.add('right', [4, 5], 10, true);
    this.animations.play('stand');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}


// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    const SPEED = 200;
    //this.body.velocity.x = direction * SPEED;
    switch (direction) {
        case RIGHT:
            this.body.position.x += 3;
            this.animations.play('right');
            break;
        case LEFT:
            this.body.position.x -= 3;
            this.animations.play('left');
            break
        case FIGHT:
            this.animations.play('fight');
            break
        default:

    }
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 500;
    let canJump = this.body.touching.down;
    this.animations.play('up');
    jumpin = true;
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
    this.game.load.image('fireBall', 'images/fireBall.png')
    this.game.load.image('doorClosed', 'images/door-closed.png');
    this.game.load.image('portalLeft', 'images/portalLeft.png');
    this.game.load.image('portalRight', 'images/portalRight.png');
    this.game.load.image('portalTop', 'images/portalTop.png');
    this.game.load.image('portalBottom', 'images/portalBottom.png');
    this.game.load.image('mage', 'images/mage_stopped.png');
    this.game.load.image('mage1', 'images/mage1_stopped.png');
    this.game.load.image('castle', 'images/castle.png');
    this.game.load.image('plant', 'images/plant.png');
    this.game.load.spritesheet('heroWarrior', 'images/playerWar/warrior_animated.png', 49, 45, 10);
    this.game.load.image('flag', 'images/flag.png');
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
};
var map;
var movingGrasseY;
var movingGrasseX;
var movingGrasseXCastle;
var portalBottomRight;
var portalTopRight;
var block;
var lava;
var lavaBouncing;
var heroWarriorSprite;

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
    if ((mage.position.y > 390 && mage.position.y < 450) && (mage.position.x > 30 && mage.position.x < 85)) {
        mage.position.y = 200;
        mage.position.x = 50;
    }
};

function spriteVsPlatform(mage, platForm) {
    if (jumpin) {
        mage.animations.play('stand');
        jumpin = false;
    }
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

PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(mage, this.platforms, spriteVsPlatform, null, this);
    this.game.physics.arcade.collide(mage, movingGrasseX, spriteVsPlatform, null, this);
    this.physics.arcade.collide(mage, movingGrasseY);
    this.physics.arcade.collide(mage, movingGrasseXCastle);
    this.game.physics.arcade.collide(mage, this.portal)
    this.game.physics.arcade.collide(mage, plant, spriteMovinPlant, null, this);
};

PlayState._handleInput = function () {
    let spaceBar = this.game.input.keyboard.addKey(32); // Get key object
    let isDown = spaceBar.isDown;
    if (this.keys.left.isDown) { // move hero left
        mage.move(-1);
    } else if (this.keys.right.isDown) { // move hero right
        mage.move(1);
    } else if (isDown) {
        mage.move(2);
    } else if (this.keys.up.isDown) { // move hero up
        mage.move(0);
    } else { // stop
        mage.animations.play('stand');
    }
};

PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.platforms = this.game.add.group();
    this.portal = this.game.add.physicsGroup();
    this.flags = this.game.add.group();
    this.platformsMovable = this.add.physicsGroup();
    this.lavaData = this.game.add.group();

    movingGrasseY = this.platformsMovable.create(105, 560, 'grass:2x1');
    portalTopRight = this.portal.create(30, 140, 'portalTop');
    portalBottomRight = this.portal.create(30, 420, 'portalBottom');
    fireBall1 = this.platformsMovable.create(800, 600, 'fireBall');
    fireBall2 = this.platformsMovable.create(900, 600, 'fireBall');
    fireBall3 = this.platformsMovable.create(1000, 600, 'fireBall');
    fireBall4 = this.platformsMovable.create(210, 600, 'fireBall');
    fireBall5 = this.platformsMovable.create(430, 600, 'fireBall');
    // PLANT--------------------------------------------------

    // POSITION PLANT IN EARTH
    plant = this.platformsMovable.create(600, 600, 'plant');
    // PLANT MOVE 
    this.game.add.tween(plant).to({
        y: plant.position.y - 50
    }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
    plant.body.setSize(plant.width, plant.height);

    this.game.add.tween(fireBall1).to({
        y: fireBall1.position.y - 10
    }, 300, Phaser.Easing.Linear.None, true, 0, -1, true);
    fireBall1.body.setSize(fireBall1.width, fireBall1.height);

    this.game.add.tween(fireBall2).to({
        y: fireBall2.position.y - 10
    }, 400, Phaser.Easing.Linear.None, true, 0, -1, true);
    fireBall2.body.setSize(fireBall2.width, fireBall2.height);

    this.game.add.tween(fireBall3).to({
        y: fireBall3.position.y - 10
    }, 450, Phaser.Easing.Linear.None, true, 0, -1, true);
    fireBall3.body.setSize(fireBall3.width, fireBall3.height);

    this.game.add.tween(fireBall4).to({
        y: fireBall4.position.y - 10
    }, 300, Phaser.Easing.Linear.None, true, 0, -1, true);
    fireBall4.body.setSize(fireBall4.width, fireBall4.height);

    this.game.add.tween(fireBall5).to({
        y: fireBall5.position.y - 10
    }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
    fireBall5.body.setSize(fireBall5.width, fireBall5.height);

    // END PLANT-------------------------------------------
    this.portal.setAll('body.allowGravity', false);
    this.portal.setAll('body.immovable', true);
    this.platformsMovable.setAll('body.allowGravity', false);
    this.platformsMovable.setAll('body.immovable', true);

    this.game.add.tween(movingGrasseY).to({
        y: movingGrasseY.position.y - 140
    }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
    movingGrasseY.body.setSize(movingGrasseY.width, movingGrasseY.height);

    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);

    // spawn hero and enemies
    this._spawnCharacters({
        hero: data.hero
    });

    // spawn important objects
    this.platformsMovabl = this.add.physicsGroup();
    movingGrasseX = this.platformsMovabl.create(240, 250, 'grass:2x1');
    movingGrasseXCastle = this.platformsMovable.create(760, 565, 'grass:2x1');
    this.platformsMovabl.setAll('body.allowGravity', false);
    this.platformsMovabl.setAll('body.immovable', true);
    // platforme qui bouge sur l'axe x a coter du portail animation
    movingGrasseX.body.kinematic = true;
    movingGrasseXCastle.body.kinematic = true;
    movingGrasseXCastle.body.allowGravity = false;
    movingGrasseXCastle.body.immovable = true;
    this.game.add.tween(movingGrasseX.body).to({
        x: '+150'
    }, 2000, Phaser.Easing.Linear.None).to({
        x: '-150'
    }, 2000, Phaser.Easing.Linear.None).yoyo().loop().start();
    // platforme qui bouge sur l'axe x a coter du chateau animation
    movingGrasseXCastle.body.kinematic = true;
    this.game.add.tween(movingGrasseXCastle.body).to({
        x: '+250'
    }, 3000, Phaser.Easing.Linear.None).to({
        x: '-250'
    }, 3000, Phaser.Easing.Linear.None).yoyo().loop().start();
    // enable gravity
    const GRAVITY = 1500;
    this.game.physics.arcade.gravity.y = GRAVITY;
}
;

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
    mage = new Hero(this.game, data.hero.x, data.hero.y, 'heroWarrior');
    mage.body.setSize(mage.width, mage.height);
    this.game.add.existing(mage);
};

PlayState._spawnflag = function (flag) {
    let sprite = this.flags.create(flag.x, flag.y, 'flag');
    sprite.anchor.set(0.5, 0.5);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
};


PlayState._onHeroVsflag = function (hero, flag) {
    this.sfx.flag.play();
    flag.kill();
};

// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    var game = new Phaser.Game(config);
    game.state.add('play', PlayState);
    game.state.start('play');

//MUSIC

    var music = document.getElementById('music'); // id for audio element
    var duration = music.duration; // Duration of audio clip, calculated here for embedding purposes
    var pButton = document.getElementById('pButton'); // play button
    var playhead = document.getElementById('playhead'); // playhead
    var timeline = document.getElementById('timeline'); // timeline

// timeline width adjusted for playhead
    var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

// play button event listenter
    pButton.addEventListener("click", play);

// timeupdate event listener
    music.addEventListener("timeupdate", timeUpdate, false);

// makes timeline clickable
    timeline.addEventListener("click", function(event) {
        moveplayhead(event);
        music.currentTime = duration * clickPercent(event);
    }, false);

// returns click as decimal (.77) of the total timelineWidth
    function clickPercent(event) {
        return (event.clientX - getPosition(timeline)) / timelineWidth;
    }

// makes playhead draggable
    playhead.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that audio position is updated only when the playhead is released
    var onplayhead = false;

// mouseDown EventListener
    function mouseDown() {
        onplayhead = true;
        window.addEventListener('mousemove', moveplayhead, true);
        music.removeEventListener('timeupdate', timeUpdate, false);
    }

// mouseUp EventListener
// getting input from all mouse clicks
    function mouseUp(event) {
        if (onplayhead == true) {
            moveplayhead(event);
            window.removeEventListener('mousemove', moveplayhead, true);
            // change current time
            music.currentTime = duration * clickPercent(event);
            music.addEventListener('timeupdate', timeUpdate, false);
        }
        onplayhead = false;
    }
// mousemove EventListener
// Moves playhead as user drags
    function moveplayhead(event) {
        var newMargLeft = event.clientX - getPosition(timeline);

        if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
            playhead.style.marginLeft = newMargLeft + "px";
        }
        if (newMargLeft < 0) {
            playhead.style.marginLeft = "0px";
        }
        if (newMargLeft > timelineWidth) {
            playhead.style.marginLeft = timelineWidth + "px";
        }
    }

// timeUpdate
// Synchronizes playhead position with current point in audio
    function timeUpdate() {
        var playPercent = timelineWidth * (music.currentTime / duration);
        playhead.style.marginLeft = playPercent + "px";
        if (music.currentTime == duration) {
            pButton.className = "";
            pButton.className = "play";
        }
    }

//Play and Pause
    function play() {
        // start music
        if (music.paused) {
            music.play();
            // remove play, add pause
            pButton.className = "";
            pButton.className = "pause";
        } else { // pause music
            music.pause();
            // remove pause, add play
            pButton.className = "";
            pButton.className = "play";
        }
    }

// Gets audio file duration
    music.addEventListener("canplaythrough", function() {
        duration = music.duration;
    }, false);

// getPosition
// Returns elements left position relative to top-left of viewport
    function getPosition(el) {
        return el.getBoundingClientRect().left;
    }
// ---------------------------------------------------------------------------------------

};
