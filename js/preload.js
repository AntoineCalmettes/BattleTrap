PlayState = {};
// ==============================================
// Image pour les platforms, sprites etc..
// ==============================================
PlayState.preload = function () {
    this.game.load.json('level:1', 'data/level01.json');
    this.game.load.image('bg_front', 'images/backgrounds/building.png');
    this.game.load.image('buildinImg', 'images/backgrounds/secondplan.png');
    this.game.load.image('bg_back', 'images/backgrounds/arriere_plan.png');
    this.game.load.image('grass:1x1', 'images/platforms/grass_1x1.png');
    this.game.load.image('grass:1x1Left', 'images/platforms/grass_1x1_borderLeft.png');
    this.game.load.image('grass:1x1:noborder', 'images/platforms/grass_1x1_noborder.png');
    this.game.load.image('grass:2x1', 'images/platforms/grass_2x1.png');
    this.game.load.image('grass:2x1:noborder', 'images/platforms/grass_2x1_noborder.png');
    this.game.load.image('lava', 'images/decorations/lava.png');
    this.game.load.image('spike', 'images/decorations/spike.png');
    this.game.load.image('grassx3', 'images/platforms/grass_3.png')
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
    this.game.load.image('plant', 'images/decorations/plant.png');
    this.game.load.image('pizza', 'images/bonus/pizza.png');
    this.game.load.spritesheet('warrior', 'images/playerWarrior/warrior.png', 61.8, 48, 20);
    this.game.load.spritesheet('assasin', 'images/playerAssasin/assasin.png', 54.7, 48, 20);
    this.game.load.spritesheet('mage', 'images/playerMage/mage.png', 48.6, 48, 13);
    this.game.load.spritesheet('key', 'images/decorations/key.png', 25, 25, 8);
    this.game.load.spritesheet('sharper', 'images/decorations/sharper.png', 62, 68, 6);
    this.game.load.spritesheet('fireWorkRed', 'images/Fireworks/redshot.png', 64, 64, 8);
    this.game.load.spritesheet('fireWorkYellow', 'images/Fireworks/yellowshot.png', 64, 64, 8);
    this.game.load.spritesheet('fireWorkYellow', 'images/Fireworks/violetshot.png', 64, 64, 8);
    this.game.load.spritesheet('fireWorkYellow', 'images/Fireworks/blueshot.png', 64, 64, 8);
    this.game.load.image('arrow', 'images/decorations/arrow.png');
    this.game.load.spritesheet('boss', 'images/monstres/boss.png', 394, 403, 20);
    this.game.load.spritesheet('minotaur', 'images/minotaur/minotaur.png', 76, 65, 45);
    this.game.load.spritesheet('slime', 'images/monstres/slime.png', 15.8, 16, 25);
    this.game.load.spritesheet('bullet', 'images/playerMage/bullet.png', 20, 14, 4);
    this.game.load.spritesheet('laserLeft', 'images/decorations/laserLeft.png', 32, 53, 2);
    this.game.load.spritesheet('laserRight', 'images/decorations/laserRight.png', 32, 53, 2);
    this.game.load.spritesheet('laser', 'images/decorations/laser.png', 32, 13, 1);
    this.game.load.image('star', 'images/bonus/beer.png');
    this.game.load.image('green-bar', 'images/health-green.png');
    this.game.load.image('red-bar', 'images/health-red.png');
    this.game.load.image('gameover', 'images/gameover-lost.png');
    // AUDIO
    //
    //
    //********************************************** */
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
    this.game.load.audio('sfx:splash', 'audio/splash.wav');
    this.game.load.audio('sfx:minotaurDie', 'audio/minotaurDie.wav');
    this.game.scale.pageAlignVertically = true;
    this.game.scale.refresh();
};
