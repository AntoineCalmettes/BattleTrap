/*
Constante pour les mouvements de personnages
 */

const RIGHT = 1;
const LEFT = -1;
const UP = 0;
const STAND = 0;
const FIGHT = 2;
var dead = false;
// Variable pour detecter si le joueur viens de sauter
var jumpin = false;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

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
    this.health = 5;
    this.animations.add('right', [2, 3], 3, true);
    this.animations.add('stand', [0, 1], 3, true);
    this.animations.add('left', [4, 5], 3, true);
    this.animations.add('up', [6], 3, true);
    this.animations.add('fight', [8, 0], 6, true);
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
    if (this.alive) {
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
Hero.prototype.damage = function (amount, direction) {
    if (heroDamage === false) {
        heroDamage = true;
        setTimeout(() => {
            heroDamage = false;
        }, 300);
        switch (direction) {
            case 'left':
                console.log('left');
                this.game.add.tween(this).to({
                    x: this.body.position.x - 30
                }, 100, Phaser.Easing.Linear.None, true, 100);
                break;
            case 'right':
                console.log('right');
                this.game.add.tween(this).to({
                    x: this.body.position.x + 70
                }, 100, Phaser.Easing.Linear.None, true, 100);
                break;
            case 'up':
                console.log('up');
                this.body.velocity.y = -200;
                break;
            default:
        }
    }
    if (this.alive) {
        this.health -= amount;
        if (this.health <= 0) {
            dead = true;
            this.alive = false;
            setTimeout(() => {
                this.kill();
                this.game.state.restart();
            }, 1200)
        }
    }
    return this;
};

//==================
// Create new Boss
// ==================
function Boss(game, x, y, sprites) {
    this.sprites = sprites;
    Phaser.Sprite.call(this, game, x, y, sprites);
    this.anchor.set(0.5, 0.5);
    this.health = 2;
    this.animations.add('left', [0, 1], 3, true);
    this.animations.add('right', [2, 3], 3, true);
    this.animations.play('right');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Boss.SPEED;
}

Boss.SPEED = 50;
Slime.SPEED = 70;
// inherit from Phaser.Sprite
Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;
Boss.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.animations.play('left');
        this.body.velocity.x = -Boss.SPEED; // turn left
    } else if (this.body.touching.left || this.body.blocked.left) {
        this.animations.play('right');
        this.body.velocity.x = Boss.SPEED; // turn right
    }
};

Boss.prototype.damage = function (amount) {
    if (this.alive) {
        this.health -= amount;
        if (this.health <= 0) {
            this.kill();
        }
    }
    return this;
};
//================== Slim
// Create new slim
// ==================
function Slime(game, x, y, sprites) {
    this.sprites = sprites;
    Phaser.Sprite.call(this, game, x, y, sprites);
    this.anchor.set(0.5, 0.5);
    this.health = 1;
    this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
    this.animations.add('right', [9, 10, 11, 12, 13, 14, 15, 16], 8, true);
    this.animations.add('attack', [17, 18, 19, 20, 21, 22, 23], 7, true);
    this.animations.play('right');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Slime.SPEED;
}


// inherit from Phaser.Sprite
Slime.prototype = Object.create(Phaser.Sprite.prototype);
Slime.prototype.constructor = Slime;

Slime.prototype.damage = function (amount) {
    if (this.alive) {
        this.health -= amount;
        if (this.health <= 0) {
            this.kill();
            if (deadSlime === 0) {
                deadSlime = 1;
                PlayState._spawnSlime(5);
                spriteDmg = 0.10;
            }
        }
    }
    return this;
};

Slime.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.animations.play('left');
        this.body.velocity.x = -Boss.SPEED; // turn left
    } else if (this.body.touching.left || this.body.blocked.left) {
        this.animations.play('right');
        this.body.velocity.x = Boss.SPEED; // turn right
    }
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
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.spritesheet('fireBall', 'images/fireBall.png', 13.33, 15, 3);
    this.game.load.image('door-closed', 'images/door-closed.png');
    this.game.load.image('passerelle', 'images/passerelle.png');
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
    this.game.load.spritesheet('boss', 'images/boss.png', 80.75, 43, 4);
    this.game.load.spritesheet('slime', 'images/slime.png', 15.8, 16, 25);
    this.game.load.image('star', 'images/diament.png');
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
var counter = 20;
var heroDamage = false;
var slimeDamage = false;
var plantDamage = false;
var deadSlime = 0;
var mage;
var Warrior;
var pizza;
var walking = false;
var hiting = false;
var boss;
var spriteDmg = 0.25;
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
    // Charge le fichier JSON du niveaux 1
    this._loadLevel(this.game.cache.getJSON('level:1'));
};
// ==============================================
// Fontion qui s'active toute les 1ms pour update le jeux
// ==============================================
PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
    this._mapStars();

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
function spriteMovinPlant(hero, plant) {
    if (plantDamage === false) {
        plantDamage = true;
        setTimeout(() => {
            plantDamage = false;
        }, 300);
        if (hero.body.x >= plant.body.position.x - 40) {
            hero.damage(0.5, 'right');
        } else if (hero.body.x <= plant.body.position.x - 40) {
            hero.damage(0.5, 'left');
        }
        if (dead) {
            this.sfx.die.play();
            dead = false;
        }
        this.sfx.punch.play();
    }
}

function spriteVsPasserelle(hero, passerelle) {
    this.game.add.tween(hero.body).to({
        y: '-10',
    }, 10).start();
    this.sfx.lava.play();
    hero.damage(0.25);
    if (dead) {
        this.sfx.die.play();
        dead = false;
    }
}

function spriteDegatLava(hero) {
    hero.damage(0.5, 'up');
    this.sfx.lava.play();
    if (dead) {
        this.sfx.die.play();
        dead = false;
    }
}

function heroVsBoss(hero, boss) {
    if (hiting) {
        boss.damage(1);
    }
    this.sfx.bossHit.play();
    if (hero.body.position.x < boss.body.position.x) {
        hero.damage(0.5, 'left');
    } else {
        hero.damage(0.5, 'right');
    }
    hero.body.velocity.x = 0;
    if (dead) {
        this.sfx.die.play();
        dead = false;
    }
}

// Change la map pour faire bouger les etoiles
PlayState._mapStars = function () {
    if (counter !== 0) {
        counter -= 1;
    } else {
        counter = 20;
        if (timeMap !== 0) {
            timeMap -= 1;
        }
        if (timeMap % 2 == 0) {
            map.loadTexture('background1', 0);
        } else {
            map.loadTexture('background', 0);
        }
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
    this.game.physics.arcade.overlap(Warrior, this.lavaData, spriteDegatLava, null, this);
    this.game.physics.arcade.overlap(Warrior, boss, heroVsBoss, null, this);
    this.game.physics.arcade.collide(Warrior, this.platforms, spriteVsPlatform, null, this);
    this.game.physics.arcade.collide(Warrior, this.passerelles, spriteVsPlatform, null, this);
    this.game.physics.arcade.collide(Warrior, movingGrasseX, spriteVsPlatform, null, this);
    this.physics.arcade.collide(Warrior, movingGrasseY);
    this.physics.arcade.overlap(Warrior, this.slims, this._onSpriteVsSLime, null, this);
    this.physics.arcade.collide(Warrior, movingGrasseXCastle);
    this.game.physics.arcade.collide(Warrior, this.portal);
    this.game.physics.arcade.collide(Warrior, this.passerelles);
    this.game.physics.arcade.overlap(Warrior, plant, spriteMovinPlant, null, this);
    this.game.physics.arcade.collide(boss, this.enemyWalls);
    this.game.physics.arcade.collide(this.slims, this.enemyWalls);
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
            }, 500)
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

    // ...
    // spawn hero and enemies
    // ==============================================
    // create all the groups/layers that we need
    // ==============================================
    this.platforms = this.game.add.group();
    this.castle = this.game.add.physicsGroup();
    this.portal = this.game.add.physicsGroup();
    this.flags = this.game.add.group();
    this.platformsMovable = this.add.physicsGroup();
    this.lavaData = this.game.add.group();
    this.platformsMovabl = this.add.physicsGroup();
    this.pizzas = this.add.physicsGroup();
    this.stars = this.game.add.physicsGroup();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;
    this.fireBalls = this.game.add.physicsGroup();
    this.doors = this.game.add.physicsGroup();
    this.passerelles = this.game.add.group();
    this.slims = this.game.add.group();
    // ==============================================
    // Creation de toute les platforms/decoration/pieges
    // ==============================================
    this.castle.create(890, 70, 'castle');
    movingGrasseY = this.platformsMovable.create(115, 535, 'grass:2x1');
    portalTopRight = this.portal.create(30, 140, 'portalTop');
    portalBottomRight = this.portal.create(30, 420, 'portalBottom');
    let door = this.doors.create(1000, 250, 'door-closed');
    plant = this.platformsMovable.create(600, 600, 'plant');
    pizza = this.pizzas.create(310, 150, 'pizza');
    pizza2 = this.pizzas.create(890, 490, 'pizza');
    movingGrasseX = this.platformsMovabl.create(240, 250, 'grass:2x1');
    movingGrasseXCastle = this.platformsMovable.create(760, 565, 'grass:2x1');

    star1 = this.stars.create(395, 500, 'star');
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
    this.castle.setAll('body.allowGravity', false);
    this.doors.setAll('body.allowGravity', false);
    movingGrasseXCastle.body.allowGravity = false;
    // Desactive le fait de pouvoir bouger les platformes avec le perso
    this.portal.setAll('body.immovable', true);
    this.platformsMovable.setAll('body.immovable', true);
    this.platformsMovabl.setAll('body.immovable', true);
    this.pizzas.setAll('body.immovable', true);
    this.stars.setAll('body.immovable', true);
    this.castle.setAll('body.immovable', true);
    this.doors.setAll('body.immovable', true);
    movingGrasseXCastle.body.immovable = true;

    // platforme qui bouge sur l'axe x a coter du portail animation (je sais pas a quoi sa sert mais c'est important)
    movingGrasseX.body.kinematic = true;
    movingGrasseXCastle.body.kinematic = true;
    // Appelle la fonction qui spawn toute les platforms contenue dans le JSON passé en parametre de la fonction loadLevel
    data.platforms.forEach(this._spawnPlatform, this);
    // appel les donnée "fireBalls" dans JSON
    data.fireBalls.forEach(this._spawnFireBalls, this);
    // appel les donnée "lavaData" dans JSON
    data.lavaData.forEach(this._spawnLava, this);
    // appel les donnée "passerelles" dans JSON
    data.passerelles.forEach(this._spawnPasserelles, this);


    // spawn hero and enemies
    this._spawnCharacters({
        hero: data.hero,
        boss: data.boss
    });


    data.flags.forEach(this._spawnflag, this);

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

PlayState._spawnPasserelles = function (passerelle) {
    let sprite = this.lavaData.create(passerelle.x, passerelle.y, 'passerelle');
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
    this._spawnEnemyWall(195, 420, 'left');
    this._spawnEnemyWall(360, 420, 'right');
    this._spawnEnemyWall(840, 300, 'left');
    this._spawnEnemyWall(1190, 300, 'right');
};
// ======================
// Crée le/les perso passé en parametre
// ======================

PlayState._spawnSlime = function (nbr) {
    Slime.SPEED = 100;
    for (let i = 0; i < nbr; i++) {
        let slime = new Slime(this.game, getRandomArbitrary(240, 360), 410, 'slime');
        slime.body.setSize(slime.width, slime.height);
        this.game.add.existing(slime);
        slime.body.allowGravity = false;
        slime.body.immovable = true;
        this.slims.add(slime);
    }
    //this.physics.arcade.collide(Warrior, this.slims, this._onSpriteVsSLime, null, this);
};

PlayState._spawnCharacters = function (data) {
    // spawn hero
    Warrior = new Hero(this.game, data.hero.x, data.hero.y, 'heroWarrior');
    Warrior.body.setSize(Warrior.width, Warrior.height);
    this.game.add.existing(Warrior);

    boss = new Boss(this.game, data.boss.x, data.boss.y, 'boss');
    boss.body.setSize(boss.width, boss.height);
    this.game.add.existing(boss);
    boss.body.allowGravity = false;
    boss.body.immovable = true;

    let slime = new Slime(this.game, 330, 404, 'slime');
    slime.body.setSize(slime.width, slime.height);
    this.game.add.existing(slime);
    slime.body.allowGravity = false;
    slime.body.immovable = true;
    slime.scale.setTo(1.8, 1.8);
    this.slims.add(slime);
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

PlayState._spawnFireBalls = function (fireBall) {
    let sprite = this.fireBalls.create(fireBall.x, fireBall.y, 'fireBall');
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.animations.add('movin', [0, 1, 2], 3, true),
        sprite.animations.play('movin');
    this.game.add.tween(sprite).to({
        y: sprite.position.y + 10
    }, getRandomArbitrary(600, 1000), Phaser.Easing.Linear.None, true, 0, -1, true);
    sprite.body.setSize(sprite.width, sprite.height);
};

// Quand le hero touche un drapeau
PlayState._onHeroVsflag = function (hero, flag) {
    this.sfx.flag.play();
    flag.kill();
};
PlayState._onHeroVsPizzas = function (hero, pizza) {
    this.sfx.pizza.play();
    pizza.kill();
    hero.healt += 1;
};
PlayState._onHeroVsStars = function (hero, star) {
    this.sfx.stars.play();
    SPEED = 1.5;
    let heroHealtBefore = hero.health;
    hero.health = 9999999999;
    setTimeout(() => {
        SPEED = 1;
        hero.health = heroHealtBefore;
    }, 2000);
    star.kill();
};
PlayState._onSpriteVsSLime = function (hero, slime) {
    if (slimeDamage === false) {
        slimeDamage = true;
        setTimeout(() => {
            slimeDamage = false;
        }, 300);
        if (hero.body.x >= slime.body.position.x - 40) {
            hero.damage(spriteDmg, 'right');
        } else if (hero.body.x <= slime.body.position.x - 40) {
            hero.damage(spriteDmg, 'left');
        }
        if (hiting) {
            slime.damage(1);
        }
        this.sfx.punch.play();
    }
    //slime.kill();
};
PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);

    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};


// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    var game = new Phaser.Game(config);
    game.state.add('play', PlayState);
    game.state.start('play');
};
