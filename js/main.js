/*
Constante pour les mouvements de personnages
 */
const RIGHT = 1;
const LEFT = -1;
const UP = 0;
const STAND = 0;
const FIGHT = 2;
var leftOrRight = 1;
/*
Constante pour le personnage choisie
 */
var HEROCHOSEN = 'mage';
// Variable pour detecter si le joueur est mort
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
            debug: true,
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
    let frameSpeed = 0;
    this.sprites = sprites;
    Phaser.Sprite.call(this, game, x, y, sprites);
    this.anchor.set(0.5, 0.5);
    if (sprites === 'warrior') {
        this.SPEED = 150;
        this.attackSpeed = 500;
        this.health = 5;
        frameSpeed = 6;
        this.maxHealth = 5;
    } else if (sprites === 'assasin') {
        this.SPEED = 200;
        this.attackSpeed = 300;
        this.health = 3;
        this.maxHealth = 3;
        frameSpeed = 8;
    } else {
        this.SPEED = 180;
        this.attackSpeed = 500;
        this.health = 2;
        this.maxHealth = 2;
        frameSpeed = 2;
    }
    this.animations.add('right', [4, 5], 3, true);
    this.animations.add('standRight', [0, 1], 3, true);
    this.animations.add('standLeft', [2, 3], 3, true);
    this.animations.add('left', [6, 7], 3, true);
    this.animations.add('up', [8], 3, true);
    this.animations.add('fightRight', [10, 0], frameSpeed, true);
    this.animations.add('fightLeft', [11, 2], frameSpeed, true);
    // hero heroSprite.animations.add('right', [4, 5], 10, true);
    this.animations.play('standRight');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}


// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
// Mouvement du Hero
Hero.prototype.move = function (direction) {
    if (this.alive) {
        this.body.velocity.x = direction * this.SPEED;
        switch (direction) {
            case RIGHT:
                this.animations.play('right');
                break;
            case LEFT:
                this.animations.play('left');
                break;
            case FIGHT:
                this.body.velocity.x = 0 * this.SPEED;
                if (leftOrRight === 1) {
                    this.animations.play('fightRight');
                } else {
                    this.animations.play('fightLeft');
                }
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
                this.game.add.tween(this).to({
                    x: this.body.position.x - 50
                }, 100, Phaser.Easing.Linear.None, true, 0);
                break;
            case 'right':
                this.game.add.tween(this).to({
                    x: this.body.position.x + 70
                }, 100, Phaser.Easing.Linear.None, true, 0);
                break;
            case 'up':
                this.game.add.tween(this.body).to({
                    y: '-30'
                }, 100, Phaser.Easing.Linear.None, true, 0);
                break;
            default:
        }
    }
    if (this.alive) {
        this.health -= amount;
        if (this.health <= 0) {
            dead = true;
            this.alive = false;
            this.game.add.tween(this).from({
                alpha: 0
            }, 200, Phaser.Easing.Cubic.Out, true, 0, -1, true);
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
    if (bossIsChangingFrame === false) {
        bossIsChangingFrame = true
        setTimeout(() => {
            bossIsChangingFrame = false;
        }, 50);
        if (this.game.physics.arcade.distanceBetween(this, hero) < 100) {
            // if player to left of enemy AND enemy moving to right (or not moving)
            if (hero.x < this.x && this.body.velocity.x >= 0) {
                // move enemy to left
                this.animations.play('left');
                boss.body.velocity.x = -Boss.SPEED;
            }
            // if player to right of enemy AND enemy moving to left (or not moving)
            else if (hero.x > boss.x && boss.body.velocity.x <= 0) {
                // move enemy to right
                this.animations.play('right');
                this.body.velocity.x = Boss.SPEED; // turn right
            }
            bossCloseOfHero = true
        } else {
            bossCloseOfHero = false;
        }
        // check against walls and reverse direction if necessary
        if (this.body.touching.right || this.body.blocked.right) {
            this.animations.play('left');
            this.body.velocity.x = -Boss.SPEED; // turn left
        } else if (this.body.touching.left || this.body.blocked.left) {
            this.animations.play('right');
            this.body.velocity.x = Boss.SPEED; // turn right
        }
    }
};

Boss.prototype.damage = function (amount) {
    if (this.alive) {
        this.health -= amount;
        if (this.health <= 0) {
            PlayState._spawnKeys({
                x: this.body.x,
                y: this.body.y
            });
            this.kill();
        }
    }
    return this;
};

function Minotaur(game, x, y, sprites) {
    this.sprites = sprites;
    Phaser.Sprite.call(this, game, x, y, sprites);
    this.anchor.set(0.5, 0.5);
    this.health = 5;
    this.animations.add('standingLeft', [0, 1, 2, 3], 4, true);
    this.animations.add('movinLeft', [4, 5, 6, 7, 8, 9, 10, 11, 12], 12, true);
    this.animations.add('movinRight', [13, 14, 15, 16, 17, 18, 19, 20, 21], 12, true);
    this.animations.add('attackRight', [22, 23, 24, 25, 26, 27, 28, 29], 9, true);
    this.animations.add('attackLeft', [30, 31, 32, 33, 34, 35, 36, 37], 9, true);
    this.animations.play('standingLeft');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Boss.SPEED;
}

Minotaur.prototype = Object.create(Phaser.Sprite.prototype);
Minotaur.prototype.constructor = Minotaur;

Minotaur.prototype.update = function () {
    if (bossIsChangingFrame === false) {
        bossIsChangingFrame = true;
        setTimeout(() => {
            bossIsChangingFrame = false;
        }, 50);
        if (this.game.physics.arcade.distanceBetween(this, hero) < 100) {
            // if player to left of enemy AND enemy moving to right (or not moving)
            if (hero.x < this.x && this.body.velocity.x >= 0) {
                // move enemy to left
                this.animations.play('movinLeft');
                boss.body.velocity.x = -Boss.SPEED;
            }
            // if player to right of enemy AND enemy moving to left (or not moving)
            else if (hero.x > boss.x && boss.body.velocity.x <= 0) {
                // move enemy to right
                this.animations.play('movinRight');
                this.body.velocity.x = Boss.SPEED; // turn right
            }
            bossCloseOfHero = true
        } else {
            bossCloseOfHero = false;
        }
        // check against walls and reverse direction if necessary
        if (this.body.touching.right || this.body.blocked.right) {
            this.animations.play('movinLeft');
            this.body.velocity.x = -Boss.SPEED; // turn left
        } else if (this.body.touching.left || this.body.blocked.left) {
            this.animations.play('movinRight');
            this.body.velocity.x = Boss.SPEED; // turn right
        }
    }
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
                setTimeout(() => {
                    PlayState._spawnSlime(5);
                }, 200);
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
        this.body.velocity.x = -Slime.SPEED; // turn left
    } else if (this.body.touching.left || this.body.blocked.left) {
        this.animations.play('right');
        this.body.velocity.x = Slime.SPEED; // turn right
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

    KeyPickupCount = 0;


    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP,
        spaceBar: Phaser.KeyCode.SPACEBAR
    });

    this.keys.up.onDown.add(function () {
        let didJump = hero.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
    this.keys.spaceBar.onDown.add(function () {
        if (HEROCHOSEN === 'mage') {
            fireLaser()
        }
    }, this);

};
// ==============================================
// Image pour les platforms, sprites etc..
// ==============================================
PlayState.preload = function () {
    this.game.load.json('level:1', 'data/level01.json');
    this.game.load.image('bg_front', 'images/backgrounds/secondplan.png');
    this.game.load.image('buildinImg', 'images/backgrounds/building.png');
    this.game.load.image('bg_back', 'images/backgrounds/arriere_plan.png');
    this.game.load.image('grass:1x1', 'images/platforms/grass_1x1.png');
    this.game.load.image('grass:1x1Left', 'images/platforms/grass_1x1_borderLeft.png');
    this.game.load.image('grass:1x1:noborder', 'images/platforms/grass_1x1_noborder.png');
    this.game.load.image('grass:2x1', 'images/platforms/grass_2x1.png');
    this.game.load.image('grass:2x1:noborder', 'images/platforms/grass_2x1_noborder.png');
    this.game.load.image('lava', 'images/decorations/lava.png');
    this.game.load.image('spike', 'images/decorations/spike.png');
    this.game.load.image('grass_3', 'images/platforms/grass_3.png')
    this.game.load.image('invisible-wall', 'images/platforms/invisible_wall.png');
    this.game.load.spritesheet('fireBall', 'images/decorations/fireBall.png', 13.33, 15, 3);
    this.game.load.image('rond', 'images/platforms/rond_line.png')
    this.game.load.spritesheet('trampo', 'images/decorations/trampo.png', 60, 51, 2);
    this.game.load.image('door-closed', 'images/decorations/door-closed.png');
    this.game.load.spritesheet('door', 'images/decorations/door.png', 44, 51, 2);
    this.game.load.image('passerelle', 'images/platforms/passerelle.png');
    this.game.load.image('portalLeft', 'images/decorations/portalLeft.png');
    this.game.load.image('portalRight', 'images/decorations/portalRight.png');
    this.game.load.image('portalTop', 'images/decorations/portalTop.png');
    this.game.load.image('portalBottom', 'images/decorations/portalBottom.png');
    this.game.load.image('castle', 'images/decorations/castle.png');
    this.game.load.image('plant', 'images/decorations/plant.png');
    this.game.load.image('pizza', 'images/bonus/pizza.png');
    this.game.load.spritesheet('warrior', 'images/playerWarrior/warrior.png', 49, 48, 13);
    this.game.load.spritesheet('assasin', 'images/playerAssasin/assasin.png', 54.54, 48, 13);
    this.game.load.spritesheet('mage', 'images/playerMage/mage.png', 48.6, 48, 13);
    this.game.load.spritesheet('key', 'images/decorations/key.png', 25, 25, 8);
    this.game.load.spritesheet('sharper', 'images/decorations/sharper.png', 62, 68, 6);
    this.game.load.image('arrow', 'images/decorations/arrow.png');
    this.game.load.spritesheet('boss', 'images/monstres/boss.png', 80.75, 43, 4);
    this.game.load.spritesheet('minotaur', 'images/minotaur/minotaur.png', 76, 65, 40);
    this.game.load.spritesheet('slime', 'images/monstres/slime.png', 15.8, 16, 25);
    this.game.load.spritesheet('bullet', 'images/playerMage/bullet.png', 20, 14, 4);
    this.game.load.spritesheet('laserAsset', 'images/decorations/laser.png', 112, 64, 2);
    this.game.load.image('star', 'images/bonus/beer.png');
    this.game.load.image('green-bar', 'images/health-green.png');
    this.game.load.image('red-bar', 'images/health-red.png');
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.audio('sfx:key', 'audio/key.wav');
    this.game.load.audio('sfx:lava', 'audio/lava.wav');
    this.game.load.audio('sfx:walking', 'audio/walking.wav');
    this.game.load.audio('sfx:hit', 'audio/hit.wav');
    this.game.load.audio('sfx:bossHit', 'audio/boss-hit.wav');
    this.game.load.audio('sfx:punch', 'audio/punch.wav');
    this.game.load.audio('sfx:pizza', 'audio/pizza.wav');
    this.game.load.audio('sfx:die', 'audio/die.wav');
    this.game.load.audio('sfx:stars', 'audio/stars.wav');
    this.game.load.audio('sfx:portal', 'audio/portal.wav');
    this.game.load.audio('sfx:bullet', 'audio/bullet.wav');
    this.game.load.audio('sfx:explosion', 'audio/explosion1.wav');
    this.game.load.audio('sfx:sharpe', 'audio/sharpe.wav');
    this.game.load.audio('sfx:getingHit', 'audio/getingHit.wav');
    this.game.load.audio('sfx:blade', 'audio/blade.wav');
    this.game.load.audio('sfx:splash', 'audio/splash.wav');
};
// ==============================================
// Var initialization
// ==============================================
var fontMap;
var building
var background;
var movingGrasseYLeft;
var movingGrasseYRight;
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
var heroJumpinOnTrampo = false;
var heroTouchBoss = false;
var lavaDamage = false;
var spikeDamage = false;
var bossDamage = false;
var bulletDamage = false;
var deadSlime = 0;
var mage;
var hero;
var healthBar;
var pizza;
var walking = false;
var hiting = false;
var boss;
var spriteDmg = 0.50;
var mouseTouchDown = false;
var mageBulletReady = true;
var bossIsChangingFrame = false;
var sharperDamage = false;
var bullets;
var bossCloseOfHero = false;
var keynumber;
var KeyPickupCount;
var door;
var isDownX;
var pad1;
let upAXbox;
// ==============================================
// Crée le jeux
// ==============================================
PlayState.create = function () {

    this.game.input.gamepad.start();

    // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
    pad1 = this.game.input.gamepad.pad1;

    this.game.input.onDown.add(dump, this);


    // creation des sons du jeux
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        key: this.game.add.audio('sfx:key'),
        lava: this.game.add.audio('sfx:lava'),
        walking: this.game.add.audio('sfx:walking'),
        hit: this.game.add.audio('sfx:hit'),
        bossHit: this.game.add.audio('sfx:bossHit'),
        punch: this.game.add.audio('sfx:punch'),
        pizza: this.game.add.audio('sfx:pizza'),
        die: this.game.add.audio('sfx:die'),
        stars: this.game.add.audio('sfx:stars'),
        portal: this.game.add.audio('sfx:portal'),
        bullet: this.game.add.audio('sfx:bullet'),
        explosion: this.game.add.audio('sfx:explosion'),
        sharpe: this.game.add.audio('sfx:sharpe'),
        getingHit: this.game.add.audio('sfx:getingHit'),
        blade: this.game.add.audio('sfx:blade'),
        splash: this.game.add.audio('sfx:splash')

    };

    function dump() {
/*
        console.log(pad1._axes[0]);
        console.log(pad1._rawPad.axes[0]);*/

    }





    // Creation de la map en parallax
    background = this.add.tileSprite(0, 0, 3410, 620, "bg_back");
    building = this.add.tileSprite(0, 0, 2210, 620, "buildinImg");
    fontMap = this.add.tileSprite(0, 0, 3410, 620, "bg_front");
    building.fixedToCamera = true; // Creer le parallax    
    this.game.world.setBounds(0, 0, 3410, 620); // taille du monde
    
    // rond de deco pour platfome bascule
    var rond_line = this.game.add.image(1907, 250, 'rond');

    // Charge le fichier JSON du niveaux 1
    this._loadLevel(this.game.cache.getJSON('level:1'));
    
    var grass_3 = this.game.add.image(1870, 400, 'grass_3')

    // change position if needed (but use same position for both images)
    var backgroundBar = this.game.add.image(100, 20, 'red-bar');
    backgroundBar.fixedToCamera = true;

    healthBar = this.game.add.image(100, 20, 'green-bar');
    healthBar.fixedToCamera = true;

    // add text label to left of bar
    var healthLabel = this.game.add.text(10, 20, 'Health', {
        fontSize: '20px',
        fill: '#ffffff'
    });

    healthLabel.fixedToCamera = true;
    keynumber = this.game.add.text(50, 60, KeyPickupCount, {
        fontSize: '20px',
        fill: '#ffffff',
    });
};

// ==============================================
// Fontion qui s'active toute les 1ms pour update le jeux
// ==============================================
PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
    this._handleBullet();
    keynumber.text = KeyPickupCount;
    if (KeyPickupCount === 5) {
        door.animations.play('open')
    }
            
// ==============================================
// Fonction qui tue le hero si il est en dehors de la map
// ==============================================
/*
    if (hero.body.position.y === 570) {
        hero.damage(hero.health);
        this.sfx.die.play(); a améliorer avec la fonction ONDEAD
    }*/
    
    // Si le mange touche le portail dimemensionel il est teleporter a celui du dessus
    if ((hero.position.y > 380 && hero.position.y < 450) && (hero.position.x > 380 && hero.position.x < 480)) {
        hero.position.y = 200;
        hero.position.x = 360;
        this.sfx.portal.play();
    }
    this.game.debug.spriteInfo(hero, 40, 50);
    healthBar.scale.setTo(hero.health / hero.maxHealth, 1);

    if (HEROCHOSEN === 'mage' && isDownX) {
        fireLaser();
    }
        this.game.debug.spriteInfo(hero, 40,50)
};
// ==============================================
// Fonction qui remet l'etat de base si la personne viens de sauter et atterie sur une platform
// ==============================================
function spriteVsPlatform(hero) {
    if (jumpin) {
        if (leftOrRight === 1) {
            hero.animations.play('standRight');

        } else {
            hero.animations.play('standLeft');

        }
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
        this.sfx.getingHit.play();
    }
}

function spriteDegatSpike(hero) {
    if (!spikeDamage) {
        spikeDamage = true;
        setTimeout(() => {
            spikeDamage = false;
        }, 100);
        hero.damage(0.25, 'up');
        this.sfx.lava.play();
        if (dead) {
            this.sfx.die.play();
            dead = false;
        }
    }
}

function spriteDegatLava(hero) {
    if (!lavaDamage) {
        lavaDamage = true;
        setTimeout(() => {
            lavaDamage = false;
        }, 100);
        hero.damage(0.25, 'up');
        this.sfx.lava.play();
        if (dead) {
            this.sfx.die.play();
            dead = false;
        }
    }
}

function heroVsBoss(hero, boss) {
    heroTouchBoss = true
    setTimeout(() => {
        heroTouchBoss = false;
    }, 100);
    if (hiting === false) {
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
    } else {
        if (!bossDamage) {
            bossDamage = true;
            setTimeout(() => {
                bossDamage = false;
            }, 500);
            boss.body.velocity.x *= -1;
            boss.damage(1);
        }
    }
}

// ==============================================
// Fonction qui calcule les collisions
// ==============================================f
PlayState._handleCollisions = function () {
    // ==============================================
    // Ajout de tout les collider
    // ==============================================
    this.game.physics.arcade.collide(hero, this.key, this._onHeroVsKey, null, this);
    this.game.physics.arcade.collide(hero, this.pizzas, this._onHeroVsPizzas, null, this);
    this.game.physics.arcade.collide(hero, this.stars, this._onHeroVsStars, null, this);
    this.game.physics.arcade.collide(hero, this.lavaData, spriteDegatLava, null, this);
    this.game.physics.arcade.collide(hero, this.spikeData, spriteDegatSpike, null, this);
    this.game.physics.arcade.overlap(hero, boss, heroVsBoss, null, this);
    this.game.physics.arcade.collide(hero, this.platforms, spriteVsPlatform, null, this);
    this.game.physics.arcade.collide(hero, this.passerelles, this._onHerovsPasserelle, null, this);
    this.game.physics.arcade.collide(hero, movingGrasseX, spriteVsPlatform, null, this);
    this.physics.arcade.collide(hero, this.platformsMovable);
    this.physics.arcade.overlap(hero, this.slims, this._onSpriteVsSLime, null, this);
    this.physics.arcade.overlap(hero, this.sharpers, this._onSpriteVsSharper, null, this);
    this.physics.arcade.collide(hero, movingGrasseXCastle);
    this.game.physics.arcade.collide(hero, this.portal);
    this.game.physics.arcade.overlap(bullets, this.slims, this._onBulletVsMonster, null, this);
    this.game.physics.arcade.overlap(bullets, this.boss, this._onBulletVsMonster, null, this);
    this.game.physics.arcade.collide(hero, this.trampos, this._onHerovsTrampos, null, this);
    this.game.physics.arcade.collide(hero, plant, spriteMovinPlant, null, this);
    this.game.physics.arcade.collide(boss, this.enemyWalls);
    this.game.physics.arcade.collide(this.slims, this.enemyWalls);
};

PlayState._handleBullet = function () {
    if (this.game.input.activePointer.isDown) {
        // We'll manually keep track if the pointer wasn't already down
        if (!mouseTouchDown) {
            touchDown();
        }
    } else {
        if (mouseTouchDown) {
            touchUp();
        }
    }

}

function touchDown() {
    // Set touchDown to true, so we only trigger this once
    mouseTouchDown = true;
}

function touchUp() {
    // Set touchDown to false, so we can trigger touchDown on the next click
    mouseTouchDown = false;
}

function fireLaser() {
    if (mageBulletReady === true) {
        mageBulletReady = false;
        setTimeout(() => {
            mageBulletReady = true;
        }, hero.attackSpeed);
        // Get the first laser that's inactive, by passing 'false' as a parameter
        let laser = bullets.getFirstExists(false);
        if (laser) {
            laser.animations.add('explode', [0, 3], 10, true);
            laser.animations.add('fire', [0, 1, 2], 10, true);
            laser.animations.play('fire');
            laser.body.setCircle(10, 5, 5);
            if (leftOrRight === 1) {
                // If we have a laser, set it to the starting position
                laser.reset(hero.x + 20, hero.y + 25);

                // Give it a velocity of -500 so it starts shooting
                laser.body.velocity.x = +400;
            } else {
                // If we have a laser, set it to the starting position
                laser.reset(hero.x - 20, hero.y + 25);
                // Give it a velocity of -500 so it starts shooting
                laser.body.velocity.x = -400;
            }
            laser.scale.setTo(1.8, 1.8);
        }
    }
}

// ==============================================
// Ecouteur d'evenement sur la touche du clavier pressé
// ==============================================
/*



*/
PlayState._handleInput = function () {




    let spaceBar = this.game.input.keyboard.addKey(32);
    let attackAXbox = pad1.justPressed(Phaser.Gamepad.XBOX360_B)
    let upAXbox= pad1.justPressed(Phaser.Gamepad.XBOX360_A);
    let upAna = pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
    // Recupere le ASCI de la barre d'espace
    let isDown = spaceBar.isDown;
    isDownX = attackAXbox;
    if (this.keys.left.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) { // move hero left
        leftOrRight = -1;
        this.game.camera.follow(hero)
        hero.move(-1);
        if (walking === false) {
            walking = true;
            this.sfx.walking.play();
            setTimeout(() => {
                walking = false;
            }, 500)
        }
    } else if (this.keys.right.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) { // move hero right
        leftOrRight = 1;
        hero.move(1);
        this.game.camera.follow(hero) //camera suit le hero
        if (walking === false) {
            walking = true;
            this.sfx.walking.play();
            setTimeout(() => {
                walking = false;
            }, 500)
        }
    } else if (isDown || isDownX) { // fighting
        if (hiting === false) {
            hiting = true;
            if (HEROCHOSEN === 'mage') {
                this.sfx.bullet.play();
            } else if (HEROCHOSEN === 'warrior') {
                this.sfx.blade.play();
            } else {
                this.sfx.hit.play();
            }
            hero.move(2);
            setTimeout(() => {
                hiting = false;
            }, hero.attackSpeed)
        }
    } else if (this.keys.up.isDown || upAXbox || upAna) { // move hero up
        console.log("je saute wllh ! ")
        hero.jump();
        this.game.camera.y += 1;
        hero.move(0);
    } else { // stop
        hero.move(0);
        if (leftOrRight === 1) {
            hero.animations.play('standRight');
        } else {
            hero.animations.play('standLeft');
        }
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

    let keyIcon = this.game.make.image(10, 50, 'key');

    this.hud = this.game.add.group();
    this.hud.add(keyIcon);
    this.hud.position.set(10, 10);

    // ...
    // spawn hero and enemies
    // ==============================================
    // create all the groups/layers that we need
    // ==============================================
    this.sharpers = this.game.add.group();
    this.platforms = this.game.add.group();
    this.castle = this.game.add.physicsGroup();
    this.portal = this.game.add.physicsGroup();
    this.key = this.game.add.group();
    this.platformsMovable = this.add.physicsGroup();
    this.lavaData = this.game.add.group();
    this.spikeData = this.game.add.group();
    this.platformsMovabl = this.add.physicsGroup();
    this.pizzas = this.add.physicsGroup();
    this.stars = this.game.add.physicsGroup();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;
    this.fireBalls = this.game.add.physicsGroup();
    this.doors = this.game.add.physicsGroup();
    this.passerelles = this.game.add.group();
    this.slims = this.game.add.group();
    this.laserAsset = this.game.add.group();
    this.trampos = this.game.add.group();
    bullets = this.game.add.group();
    this.boss = this.game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(20, 'bullet');
    bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetBullet);

    function resetBullet(bullet) {
        // Destroy the bullet
        bullet.kill();
    }

    // Same as above, set the anchor of every sprite to 0.5, 1.0
    bullets.callAll('anchor.setTo', 'anchor', 0.5, 1.0);

    // This will set 'checkWorldBounds' to true on all sprites in the group
    bullets.setAll('checkWorldBounds', true);
    // ==============================================
    // Creation de toute les platforms/decoration/pieges
    // ==============================================
    this.castle.create(3100, 70, 'castle');
    movingGrasseYLeft = this.platformsMovable.create(280, 540, 'grass:2x1');
    movingGrasseYRight = this.platformsMovable.create(520, 215, 'grass:2x1');
    portalTopRight = this.portal.create(270, 100, 'portalTop');
    portalBottomRight = this.portal.create(400, 410, 'portalBottom');
    door = this.doors.create(1000, 250, 'door');
    door.animations.add('open', [1], 1, true);
    plant = this.platformsMovable.create(600, 600, 'plant');
    pizza = this.pizzas.create(310, 150, 'pizza');
    pizza2 = this.pizzas.create(890, 490, 'pizza');
    movingGrasseX = this.platformsMovabl.create(240, 250, 'grass:2x1');
    movingGrasseXCastle = this.platformsMovable.create(760, 565, 'grass:2x1');
    star1 = this.stars.create(300, 500, 'star');
    // ==============================================
    // Animations
    // ==============================================
    
    // platfome qui se balance
/*    this.game.add.tween(target).to({ property: value }, duration, easing,
    autostart, delay, repeat, yoyo);*/
    
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
    this.game.add.tween(movingGrasseYLeft).to({
        y: movingGrasseYLeft.position.y - 120
    }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
    // Platforme de haut en bas a coter de la plante
    this.game.add.tween(movingGrasseYRight).to({
        y: movingGrasseYRight.position.y - 120
    }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
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
    bullets.setAll('body.allowGravity', false);
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
    data.sharpers.forEach(this._spawnSharper, this);
    // Appelle la fonction qui spawn toute les platforms contenue dans le JSON passé en parametre de la fonction loadLevel
    data.platforms.forEach(this._spawnPlatform, this);
    // appel les donnée "fireBalls" dans JSON
    data.fireBalls.forEach(this._spawnFireBalls, this);
    // appel les donnée "lavaData" dans JSON
    data.lavaData.forEach(this._spawnLava, this);
    // appel les donnée "passerelles" dans JSON
    data.passerelles.forEach(this._spawnPasserelles, this);
    // appel les donnée "keys" dans JSON
    data.keys.forEach(this._spawnKeys, this);
    // appel les donnée "laserAsset" dans JSON
    data.laserAsset.forEach(this._spawnLaser, this);
    // appel les donnée "trampos" dans JSON
    data.trampos.forEach(this._spawnTrampo, this);
    // appel les donnée "spike" dans JSON
    data.spikeData.forEach(this._spawnSpike, this);
    // spawn hero and enemies
    this._spawnCharacters({
        hero: data.hero,
        boss: data.boss
    });

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

PlayState._spawnSpike = function (spike) {
    let sprite = this.spikeData.create(spike.x, spike.y, spike.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

PlayState._spawnPasserelles = function (passerelle) {
    let sprite = this.passerelles.create(passerelle.x, passerelle.y, 'passerelle');
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
    this._spawnEnemyWall(470, 420, 'right');
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
};

PlayState._spawnCharacters = function (data) {
    // spawn hero
    hero = new Hero(this.game, data.hero.x, data.hero.y, HEROCHOSEN);
    hero.body.setSize(40, 50);
    this.game.add.existing(hero);

    /* boss = new Boss(this.game, data.boss.x, data.boss.y, 'boss');
    boss.body.setSize(boss.width, boss.height);
    this.game.add.existing(boss);
    boss.body.allowGravity = false;
    boss.body.immovable = true;
    boss.body.bounce.x = 1;
    this.boss.add(boss); */

    boss = new Minotaur(this.game, data.boss.x, data.boss.y, 'minotaur');
    boss.body.setSize(boss.width, boss.height);
    this.game.add.existing(boss);
    boss.body.allowGravity = false;
    boss.body.immovable = true;
    boss.body.bounce.x = 1;
    this.boss.add(boss);

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
PlayState._spawnKeys = function (key) {
    let sprite = this.key.create(key.x, key.y, 'key');
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.animations.add('movin', [0, 1, 2, 3, 4, 5, 6], 4, true);
    sprite.animations.play('movin');
    this.game.physics.arcade.collide(hero, key, this._onHeroVskey, null, this);
};
PlayState._spawnTrampo = function (trampo) {
    let sprite = this.trampos.create(trampo.x, trampo.y, 'trampo');
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    sprite.animations.add('upDown', [0, 1, 0], 6, false)
};

PlayState._spawnLaser = function (laser) {
    let sprite = this.laserAsset.create(laser.x, laser.y, 'laserAsset');
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.animations.add('rotate', [0, 1], 1, true);
    sprite.animations.play('rotate');
    sprite.scale.setTo(1, 1);
};


PlayState._spawnSharper = function (sharper) {
    let sprite = this.sharpers.create(sharper.x, sharper.y, 'sharper');
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.animations.add('rotate', [0, 1, 2, 3, 4, 5], 30, true);
    sprite.animations.play('rotate');
    this.game.add.tween(sprite.body).to({
        x: '+200'
    }, 1000, Phaser.Easing.Linear.None).to({
        x: '-200'
    }, 1000, Phaser.Easing.Linear.None).yoyo().loop().start();
    sprite.scale.setTo(0.8, 0.8);
};

PlayState._spawnFireBalls = function (fireBall) {
    let sprite = this.fireBalls.create(fireBall.x, fireBall.y, 'fireBall');
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.animations.add('movin', [0, 1, 2], 3, true);
    sprite.animations.play('movin');
    this.game.add.tween(sprite).to({
        y: sprite.position.y + 10
    }, getRandomArbitrary(600, 1000), Phaser.Easing.Cubic.In, true, 0, -1, true);
    sprite.body.setSize(sprite.width, sprite.height);
};

// Quand le hero touche un drapeau
PlayState._onHeroVsKey = function (hero, key) {
    KeyPickupCount++;
    this.sfx.key.play();
    key.kill();
};
PlayState._onHeroVsPizzas = function (hero, pizza) {
    this.sfx.pizza.play();
    pizza.kill();
    hero.heal(1);
};
PlayState._onHeroVsStars = function (hero, star) {
    this.sfx.stars.play();
    let heroSpeed = hero.SPEED
    hero.SPEED += 20;
    let heroHealtBefore = hero.health;
    hero.health = 3;
    setTimeout(() => {
        hero.SPEED = heroSpeed;
        hero.health = heroHealtBefore;
    }, 4000);
    star.kill();
};
PlayState._onSpriteVsSharper = function (hero, sharper) {
    if (sharperDamage === false) {
        sharperDamage = true;
        setTimeout(() => {
            sharperDamage = false;
        }, 500);
        if (hero.body.position.y < sharper.body.position.y) {
            if (hero.body.position.x < sharper.body.position.x) {
                hero.damage(0.5, 'left');
            } else {
                hero.damage(0.5, 'right');
            }
            this.sfx.sharpe.play();
        }
    }
    if (dead) {
        this.sfx.die.play();
        dead = false;
    }
};
PlayState._onBulletVsMonster = function (bullet, monster) {
    if (bulletDamage === false) {
        bulletDamage = true;
        bullet.body.velocity.x = 0;
        monster.damage(0.5);
        this.sfx.explosion.play();
        bullet.animations.play('explode');
        setTimeout(() => {
            bullet.kill();
        }, 200)
        setTimeout(() => {
            bulletDamage = false;
        }, 200)
    }
};

PlayState._onSpriteVsSLime = function (hero, slime) {
    if (hiting === false) {
        if (slimeDamage === false) {
            slimeDamage = true;
            setTimeout(() => {
                slimeDamage = false;
            }, 300);
            if (hero.body.x >= slime.body.position.x) {
                hero.damage(spriteDmg, 'right');
            } else if (hero.body.x <= slime.body.position.x) {
                hero.damage(spriteDmg, 'left');
            }
            this.sfx.getingHit.play();
        }
    } else {
        this.sfx.splash.play();
        slime.damage(1);
    }
    if (dead) {
        this.sfx.die.play();
        dead = false;
    }
};



PlayState._onHerovsTrampos = function (hero, trampo) {
    if (heroJumpinOnTrampo === false) {
        heroJumpinOnTrampo = true;
        trampo.animations.play('upDown');
        setTimeout(() => {
            hero.body.velocity.y -= 600;
            setTimeout(() => {
                heroJumpinOnTrampo = false;
            }, 350)
        }, 350)
    }
};
PlayState._onHerovsPasserelle = function (hero, passerelle) {
    setTimeout(() => {
        passerelle.body.allowGravity = true;
    }, 600);
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


function runGame(persoChoose) {
    HEROCHOSEN = persoChoose;
    var game = new Phaser.Game(config);
    game.state.add('play', PlayState);
    game.state.start('play');
}