/*
Constante pour les mouvements de personnages
 */

const RIGHT = 1;
const LEFT = -1;
const UP = 0;
const STAND = 0;
const FIGHT = 2;

// Variable pour detecter si le joueur viens de sauter
var jumpin = false;


// Configuration de l'environement de jeux (taille du canvas etc..)
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
// Cree un nouveaux Hero
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

// Mouvement du Hero
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
// Saut du hero
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

//================== monster
// Create new monster
// ==================
function Monster(game, x, y, sprites) {
    this.sprites = sprites;
    Phaser.Sprite.call(this, game, x, y, sprites);
    this.anchor.set(0.5, 0.5);
    //this.animations.add('stand', [0, 1], 3, true);
    this.animations.add('left', [0, 1], 3, true);
    //this.animations.add('up', [6], 3, true);
    //this.animations.add('fight', [8], 3, true);
    this.animations.add('right', [2, 3], 3, true);
    this.animations.play('right');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}


// inherit from Phaser.Sprite
Monster.prototype = Object.create(Phaser.Sprite.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.move = function (monster) {
    monster.animations.play('right');
    this.game.add.tween(monster.body).to({
        x: '+450'
    }, 6000).start();
    setTimeout(() => {
        monster.animations.play('left');
        this.game.add.tween(monster.body).to({
            x: '-450'
        }, 6000).start();
        setTimeout(() => {
            monsterMoveFinish = true
        }, 6000)
    }, 6000);
};
// =============================================================================
// game states
// =============================================================================

PlayState = {};
// ==============================================
// Initialisation du jeux
// ==============================================
PlayState.init = function () {
    this.game.renderer.renderSession.roundPixels = true;

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });

    this.keys.up.onDown.add(function () {
        let didJump = Warrior.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
};
// ==============================================
// Image pour les platforms, sprites etc..
// ==============================================
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
    this.game.load.spritesheet('flameMonster', 'images/flameMonster2.png', 100, 50, 4);
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
};
// ==============================================
// Var initialization
// ==============================================
var map;
var movingGrasseY;
var movingGrasseX;
var movingGrasseXCastle;
var portalBottomRight;
var portalTopRight;
var block;
var lava;
var timeMap = 10000;
var mage;
var Warrior;
var flameMonster;
// ==============================================
// Crée le jeux
// ==============================================
PlayState.create = function () {

    // creation des sons du jeux
    this.sfx = {
        jump: this.game.add.audio(''),
        coin: this.game.add.audio(''),
    };
    // Creation de la map
    map = this.game.add.image(0, 0, 'background');
    // Changement de la map toute les 300ms
    setInterval(() => {
        if (timeMap !== 0) {
            timeMap -= 1;
            stars()
        }
    }, 300)

    // Change la map pour faire bouger les etoiles
    function stars() {
        if (timeMap % 2 == 0) {
            map.loadTexture('background1', 0);
        } else {
            map.loadTexture('background', 0);
        }
    };
    // Charge le fichier JSON du niveaux 1
    this._loadLevel(this.game.cache.getJSON('level:1'));
};
var monsterMoveFinish = false;
// ==============================================
// Fontion qui s'active toute les 1ms pour update le jeux
// ==============================================
PlayState.update = function () {
    if (monsterMoveFinish) {
        monsterMoveFinish = false;
        flameMonster.move(flameMonster);
    }
    this._handleCollisions();
    this._handleInput();

    // Si le mange touche le portail dimemensionel il est teleporter a celui du dessus
    if ((Warrior.position.y > 390 && Warrior.position.y < 450) && (Warrior.position.x > 30 && Warrior.position.x < 85)) {
        Warrior.position.y = 200;
        Warrior.position.x = 50;
    }
};
// ==============================================
// Fonction qui remet l'etat de base si la personne viens de sauter et atterie sur une platform
// ==============================================
function spriteVsPlatform(hero) {
    if (jumpin) {
        hero.animations.play('stand');
        jumpin = false;
    }
}

// ==============================================
// Fonction au contact de la plante
// ==============================================
function spriteMovinPlant(hero) {
    if (hero.body.x >= 600) {
        hero.body.y = 550;
        hero.body.x = 650;
    } else {
        hero.body.y = 535;
        hero.body.x = 540;
    }
}

function heroVsMonster(hero, monster) {
    if (hero.body.position.x < monster.body.position.x) {
        this.game.add.tween(hero.body).to({
            x: '-50'
        }, 100).start();
    } else {
        this.game.add.tween(hero.body).to({
            x: '50'
        }, 100).start();
    }
}

// ==============================================
// Fonction qui calcule les collisions
// ==============================================
PlayState._handleCollisions = function () {
    // ==============================================
    // Ajout de tout les collider
    // ==============================================
    this.game.physics.arcade.collide(Warrior, flameMonster, heroVsMonster, null, this);
    this.game.physics.arcade.collide(Warrior, this.platforms, spriteVsPlatform, null, this);
    this.game.physics.arcade.collide(Warrior, movingGrasseX, spriteVsPlatform, null, this);
    this.physics.arcade.collide(Warrior, movingGrasseY);
    this.physics.arcade.collide(Warrior, movingGrasseXCastle);
    this.game.physics.arcade.collide(Warrior, this.portal);
    this.game.physics.arcade.collide(Warrior, plant, spriteMovinPlant, null, this);
};
// ==============================================
// Ecouteur d'evenement sur la touche du clavier pressé
// ==============================================
PlayState._handleInput = function () {
    let spaceBar = this.game.input.keyboard.addKey(32); // Recupere le ASCI de la barre d'espace
    let isDown = spaceBar.isDown;
    if (this.keys.left.isDown) { // move hero left
        Warrior.move(-1);
    } else if (this.keys.right.isDown) { // move hero right
        Warrior.move(1);
    } else if (isDown) { // move hero up
        Warrior.move(2);
    } else if (this.keys.up.isDown) { // move hero up
        Warrior.move(0);
    } else { // stop
        Warrior.animations.play('stand');
    }
};
// ==============================================
// Genere le niveau
// ==============================================
PlayState._loadLevel = function (data) {
    // Selectionne le niveau de gravité
    const GRAVITY = 1500;
    // Ajoute la gravité
    this.game.physics.arcade.gravity.y = GRAVITY;
    // ==============================================
    // create all the groups/layers that we need
    // ==============================================
    this.platforms = this.game.add.group();
    this.flag = this.game.add.group();
    this.portal = this.game.add.physicsGroup();
    this.flags = this.game.add.group();
    this.platformsMovable = this.add.physicsGroup();
    this.lavaData = this.game.add.group();
    this.platformsMovabl = this.add.physicsGroup();
    // ==============================================
    // Creation de toute les platforms/decoration/pieges
    // ==============================================
    movingGrasseY = this.platformsMovable.create(105, 535, 'grass:2x1');
    portalTopRight = this.portal.create(30, 140, 'portalTop');
    portalBottomRight = this.portal.create(30, 420, 'portalBottom');
    fireBall1 = this.platformsMovable.create(800, 600, 'fireBall');
    fireBall2 = this.platformsMovable.create(900, 600, 'fireBall');
    fireBall3 = this.platformsMovable.create(1000, 600, 'fireBall');
    fireBall4 = this.platformsMovable.create(210, 600, 'fireBall');
    fireBall5 = this.platformsMovable.create(430, 600, 'fireBall');
    plant = this.platformsMovable.create(600, 600, 'plant');
    movingGrasseX = this.platformsMovabl.create(240, 250, 'grass:2x1');
    movingGrasseXCastle = this.platformsMovable.create(760, 565, 'grass:2x1');
    // ==============================================
    // Animations
    // ==============================================
    // PLANT MOVE 
    this.game.add.tween(plant).to({
        y: plant.position.y - 50
    }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
    plant.body.setSize(plant.width, plant.height);
    // FireBall Moves
    this.game.add.tween(fireBall1).to({
        y: fireBall1.position.y - 10
    }, 300, Phaser.Easing.Linear.None, true, 0, -1, true);
    fireBall1.body.setSize(fireBall1.width, fireBall1.height);
    // FireBall Moves
    this.game.add.tween(fireBall2).to({
        y: fireBall2.position.y - 10
    }, 400, Phaser.Easing.Linear.None, true, 0, -1, true);
    fireBall2.body.setSize(fireBall2.width, fireBall2.height);
    // FireBall Moves
    this.game.add.tween(fireBall3).to({
        y: fireBall3.position.y - 10
    }, 450, Phaser.Easing.Linear.None, true, 0, -1, true);
    fireBall3.body.setSize(fireBall3.width, fireBall3.height);
    // FireBall Moves
    this.game.add.tween(fireBall4).to({
        y: fireBall4.position.y - 10
    }, 300, Phaser.Easing.Linear.None, true, 0, -1, true);
    fireBall4.body.setSize(fireBall4.width, fireBall4.height);
    // FireBall Moves
    this.game.add.tween(fireBall5).to({
        y: fireBall5.position.y - 10
    }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
    fireBall5.body.setSize(fireBall5.width, fireBall5.height);
    // Platforme de haut en bas a coter du portail Moves
    this.game.add.tween(movingGrasseY).to({
        y: movingGrasseY.position.y - 140
    }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
    movingGrasseY.body.setSize(movingGrasseY.width, movingGrasseY.height);
    // Platforme en haut de gauche a droite a coter du soleil Moves
    this.game.add.tween(movingGrasseX.body).to({
        x: '+140'
    }, 2000, Phaser.Easing.Linear.None).to({
        x: '-140'
    }, 2000, Phaser.Easing.Linear.None).yoyo().loop().start();
    // platforme qui bouge sur l'axe x a coter du chateau animation
    movingGrasseXCastle.body.kinematic = true;
    this.game.add.tween(movingGrasseXCastle.body).to({
        x: '+250'
    }, 3000, Phaser.Easing.Linear.None).to({
        x: '-250'
    }, 3000, Phaser.Easing.Linear.None).yoyo().loop().start();

    // Desactive la gravité sur les platforms (pour eviter quelle tombe
    this.portal.setAll('body.allowGravity', false);
    this.platformsMovable.setAll('body.allowGravity', false);
    this.platformsMovabl.setAll('body.allowGravity', false);
    movingGrasseXCastle.body.allowGravity = false;

    // Desactive le fait de pouvoir bouger les platformes avec le perso
    this.portal.setAll('body.immovable', true);
    this.platformsMovable.setAll('body.immovable', true);
    this.platformsMovabl.setAll('body.immovable', true);
    movingGrasseXCastle.body.immovable = true;

    // platforme qui bouge sur l'axe x a coter du portail animation (je sais pas a quoi sa sert mais c'est important)
    movingGrasseX.body.kinematic = true;
    movingGrasseXCastle.body.kinematic = true;

    // Appelle la fonction qui spawn toute les platforms contenue dans le JSON passé en parametre de la fonction loadLevel
    data.platforms.forEach(this._spawnPlatform, this);

    // spawn hero and enemies
    this._spawnCharacters({
        hero: data.hero,
        monster: data.monster
    });
    data.flag.forEach(this._spawnflag, this);

};

// ======================
// Spawn toute les platformes passé en parametre ( du json level)
// ======================
PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};
// ======================
// Crée le/les perso passé en parametre
// ======================
PlayState._spawnCharacters = function (data) {
    // spawn hero
    Warrior = new Hero(this.game, data.hero.x, data.hero.y, 'heroWarrior');
    Warrior.body.setSize(Warrior.width, Warrior.height);
    this.game.add.existing(Warrior);

    flameMonster = new Monster(this.game, data.monster.x, data.monster.y, 'flameMonster');
    flameMonster.body.setSize(flameMonster.width, flameMonster.height);
    this.game.add.existing(flameMonster);
    flameMonster.body.allowGravity = false;
    flameMonster.body.immovable = true;
    flameMonster.move(flameMonster);
};
// ==========================
// Crée les drapeaux
// ==========================
PlayState._spawnflag = function (flag) {
    let sprite = this.flags.create(flag.x, flag.y, 'flag');
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    this.game.physics.arcade.collide(Warrior, flag, this._onHeroVsflag, null, this);
    // sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    // sprite.animations.play('rotate');
};

// Quand le hero touche un drapeau
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
};
