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
// ==============================================
// Var initialization
// ==============================================
var fontMap;
var building
var background;
var grassx3;
var movingGrasseDownSpike;
var movingGrasseYLeft;
var movingGrasseYRight;
var movingGrasseX;
var movingGrasseXCastle;
var portalBottomRight;
var portalTopRight;
var block;
var heroDamage = false;
var slimeDamage = false;
var plantDamage = false;
var heroJumpinOnTrampo = false;
var lavaDamage = false;
var spikeDamage = false;
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
var minotaur;
var minotaureHitHero = false;
var slime;
var minotaurKey = false;
var laser = 0;
var laserCount = 100;
var laserLeft;
var laserRight;
var laserTop;
var laserTo2;
var grass_3;
var bossCanAttack = true;
var attackFinished = true;
var bossAnimationAttackPLaying = false;
var level = 0;
var fireworkYellow;
var fireworkRed;
var firePurple;
var win = false;
var test = false;
// ==============================================
// Initialisation du jeux
// ==============================================
PlayState.init = function () {
    this.game.renderer.renderSession.roundPixels = true;

    KeyPickupCount = 0;

    this.level = level;
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
