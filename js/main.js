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
    this.animations.add('fight', [8, 0], 8, true);
    // heroWarriorSprite.animations.add('right', [4, 5], 10, true);
    this.animations.play('stand');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}


// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
var SPEED = 1;
// Mouvement du Hero
Hero.prototype.move = function (direction) {
    //this.body.velocity.x = direction * SPEED;
    switch (direction) {
        case RIGHT:
            this.body.position.x += 3 * SPEED;
            this.animations.play('right');
            break;
        case LEFT:
            this.body.position.x -= 3 * SPEED;
            this.animations.play('left');
            break;
        case FIGHT:
            this.animations.play('fight');
            break;
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

// Prise de degats du hero
Hero.prototype.damage = function (amount) {
    if (this.alive) {
        this.health -= amount;
        if (this.health <= 0) {
            dead = true;
            setTimeout(() => {
                this.kill();
                this.game.state.restart();
            }, 1200)
        }
    }
    return this;
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
    }, 6000, Phaser.Easing.Linear.None).to({
        x: '-450'
    }, 6000, Phaser.Easing.Linear.None).yoyo().loop().start();
    setTimeout(() => {
        monsterMoveFinish = true
    }, 12000)
    setTimeout(() => {
        monster.animations.play('left');
    }, 6000);
};

//================== Slim
// Create new slim
// ==================
function Slime(game, x, y, sprites) {
    this.sprites = sprites;
    Phaser.Sprite.call(this, game, x, y, sprites);
    this.anchor.set(0.5, 0.5);
    this.animations.add('waiting', [0, 1, 2, 3, 4, 5, 6, 7], 7, true);
    this.animations.play('waiting');
    this.scale.setTo(1.5, 1.5)
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}


// inherit from Phaser.Sprite
Slime.prototype = Object.create(Phaser.Sprite.prototype);
Slime.prototype.constructor = Slime;

Slime.prototype.move = function (slime) {

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
    this.game.load.image('pizza', 'images/pizza.png');
    this.game.load.spritesheet('heroWarrior', 'images/playerWar/warrior_animated.png', 49, 45, 10);
    this.game.load.image('flag', 'images/flag.png');
    this.game.load.spritesheet('flameMonster', 'images/flameMonster2.png', 100, 50, 4);
    this.game.load.spritesheet('slime', 'images/slime.png', 16, 16, 9);
    this.game.load.image('star', 'images/star.png');
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.audio('sfx:flag', 'audio/key.wav');
    this.game.load.audio('sfx:lava', 'audio/lava.wav');
    this.game.load.audio('sfx:walking', 'audio/walking.wav');
    this.game.load.audio('sfx:hit', 'audio/hit.wav');
    this.game.load.audio('sfx:bossHit', 'audio/boss-hit.wav');
    this.game.load.audio('sfx:punch', 'audio/punch.wav');
    this.game.load.audio('sfx:pizza', 'audio/pizza.wav');
    this.game.load.audio('sfx:die', 'audio/die.wav');
    this.game.load.audio('sfx:stars', 'audio/stars.wav');
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
var timeMap = 10000;
var mage;
var Warrior;
var pizza;
var walking = false;
var hiting = false;
var flameMonster;
var dead = false;
// ==============================================
// Crée le jeux
// ==============================================
PlayState.create = function () {

    // creation des sons du jeux
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        flag: this.game.add.audio('sfx:flag'),
        lava: this.game.add.audio('sfx:lava'),
        walking: this.game.add.audio('sfx:walking'),
        hit: this.game.add.audio('sfx:hit'),
        bossHit: this.game.add.audio('sfx:bossHit'),
        punch: this.game.add.audio('sfx:punch'),
        pizza: this.game.add.audio('sfx:pizza'),
        die: this.game.add.audio('sfx:die'),
        stars: this.game.add.audio('sfx:stars')
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
        this.game.add.tween(hero.body).to({
            x: '+50'
        }, 100).start();
    } else {
        this.game.add.tween(hero.body).to({
            x: '-50'
        }, 100).start();
    }
    this.sfx.punch.play();
}

function spriteDamagePlant(hero) {
    hero.damage(1);
    if (dead) {
        this.sfx.die.play();
        dead = false;
    }
}

function spriteDegatLava(hero) {
    hero.body.y = 540;
    this.sfx.lava.play();
}

function heroVsMonster(hero, monster) {
    this.sfx.bossHit.play();
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
    this.game.physics.arcade.collide(Warrior, this.flags, this._onHeroVsflag, null, this);
    this.game.physics.arcade.collide(Warrior, this.pizzas, this._onHeroVsPizzas, null, this);
    this.game.physics.arcade.collide(Warrior, this.stars, this._onHeroVsStars, null, this);
    this.game.physics.arcade.collide(Warrior, this.lavaData, spriteDegatLava, null, this);
    this.game.physics.arcade.collide(Warrior, flameMonster, heroVsMonster, null, this);
    this.game.physics.arcade.collide(Warrior, this.platforms, spriteVsPlatform, null, this);
    this.game.physics.arcade.collide(Warrior, movingGrasseX, spriteVsPlatform, null, this);
    this.physics.arcade.collide(Warrior, movingGrasseY);
    this.physics.arcade.collide(Warrior, movingGrasseXCastle);
    this.game.physics.arcade.collide(Warrior, this.portal);
    this.game.physics.arcade.collide(Warrior, plant, spriteMovinPlant, null, this);
    this.game.physics.arcade.collide(Warrior, plant, spriteDamagePlant, null, this);
};
// ==============================================
// Ecouteur d'evenement sur la touche du clavier pressé
// ==============================================
PlayState._handleInput = function () {
    let spaceBar = this.game.input.keyboard.addKey(32); // Recupere le ASCI de la barre d'espace
    let isDown = spaceBar.isDown;
    if (this.keys.left.isDown) { // move hero left
        Warrior.move(-1);
        if (walking === false) {
            walking = true;
            this.sfx.walking.play();
            setTimeout(() => {
                walking = false;
            }, 500)
        }
    } else if (this.keys.right.isDown) { // move hero right
        Warrior.move(1);
        if (walking === false) {
            walking = true;
            this.sfx.walking.play();
            setTimeout(() => {
                walking = false;
            }, 500)
        }
    } else if (isDown) { // fighting
        if (hiting === false) {
            hiting = true;
            this.sfx.hit.play();
            Warrior.move(2);
            setTimeout(() => {
                hiting = false;
            }, 300)
        }
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
    this.portal = this.game.add.physicsGroup();
    this.flags = this.game.add.group();
    this.platformsMovable = this.add.physicsGroup();
    this.lavaData = this.game.add.group();
    this.platformsMovabl = this.add.physicsGroup();
    this.pizzas = this.add.physicsGroup();
    this.stars = this.game.add.physicsGroup();
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
    pizza = this.pizzas.create(310, 150, 'pizza');
    pizza2 = this.pizzas.create(890, 490, 'pizza');
    movingGrasseX = this.platformsMovabl.create(240, 250, 'grass:2x1');
    movingGrasseXCastle = this.platformsMovable.create(760, 565, 'grass:2x1');
    star1 = this.stars.create(400, 500, 'star');
    // ==============================================
    // Animations
    // ==============================================
    // PIZZA MOVE
    this.game.add.tween(pizza).to({
        y: pizza.position.y - 50
    }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
    pizza.body.setSize(pizza.width, pizza.height);

    this.game.add.tween(pizza2).to({
        x: pizza2.position.x + 150
    }, 2500, Phaser.Easing.Linear.None, true, 0, -1, true);
    pizza2.body.setSize(pizza2.width, pizza2.height);


    this.game.add.tween(star1).to({
        y: star1.position.y - 10
    }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
    pizza.body.setSize(star1.width, star1.height);

    // PLANT MOVE
    this.game.add.tween(plant).to({
        y: plant.position.y - 45
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
        y: movingGrasseY.position.y - 120
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
    this.pizzas.setAll('body.allowGravity', false);
    this.stars.setAll('body.allowGravity', false);
    movingGrasseXCastle.body.allowGravity = false;
    // Desactive le fait de pouvoir bouger les platformes avec le perso
    this.portal.setAll('body.immovable', true);
    this.platformsMovable.setAll('body.immovable', true);
    this.platformsMovabl.setAll('body.immovable', true);
    this.pizzas.setAll('body.immovable', true);
    this.stars.setAll('body.immovable', true);
    movingGrasseXCastle.body.immovable = true;

    // platforme qui bouge sur l'axe x a coter du portail animation (je sais pas a quoi sa sert mais c'est important)
    movingGrasseX.body.kinematic = true;
    movingGrasseXCastle.body.kinematic = true;

    // appel les donnée "lavaData" dans JSON
    data.lavaData.forEach(this._spawnLava, this);

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
// Spawn toute les lave passé en parametre ( du json level)
// ======================
PlayState._spawnLava = function (lava) {
    let sprite = this.lavaData.create(lava.x, lava.y, lava.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

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
    Warrior.health = 5;
    this.game.add.existing(Warrior);


    flameMonster = new Monster(this.game, data.monster.x, data.monster.y, 'flameMonster');
    flameMonster.body.setSize(flameMonster.width, flameMonster.height);
    this.game.add.existing(flameMonster);
    flameMonster.body.allowGravity = false;
    flameMonster.body.immovable = true;
    flameMonster.move(flameMonster);

    slime = new Slime(this.game, 550, 590, 'slime');
    slime.body.setSize(slime.width, slime.height);
    this.game.add.existing(slime);
    slime.body.allowGravity = false;
    slime.body.immovable = true;
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
};

// Quand le hero touche un drapeau
PlayState._onHeroVsflag = function (hero, flag) {
    this.sfx.flag.play();
    flag.kill();
};
PlayState._onHeroVsPizzas = function (hero, pizza) {
    this.sfx.pizza.play();
    pizza.kill();
};
PlayState._onHeroVsStars = function (hero, star) {
    this.sfx.stars.play();
    SPEED = 1.5;
    setTimeout(() => {
        SPEED = 1;
    }, 2000);
    star.kill();
};


// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    var game = new Phaser.Game(config);
    game.state.add('play', PlayState);
    game.state.start('play');
};
