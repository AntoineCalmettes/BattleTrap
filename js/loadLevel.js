// ==============================================
// Genere le niveau
// ==============================================
PlayState._loadLevel = function (data) {
    // Selectionne le niveau de gravité
    const GRAVITY = 1500;
    // Ajoute la gravité
    this.game.physics.arcade.gravity.y = GRAVITY;
    this.lavaData = this.game.add.group();
    if (this.level === 0) {
        let keyIcon = this.game.make.image(10, 50, 'key');
        keyIcon.fixedToCamera = true;

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
        this.portal = this.game.add.physicsGroup();
        this.key = this.game.add.group();
        this.grass3data = this.game.add.group();
        this.platformsMovable = this.add.physicsGroup();
        this.spikeData = this.game.add.group();
        this.platformsMovabl = this.add.physicsGroup();
        this.pizzas = this.add.physicsGroup();
        this.stars = this.game.add.physicsGroup();
        this.enemyWalls = this.game.add.group();
        this.enemyWalls.visible = false;
        this.fireBalls = this.game.add.physicsGroup();
        this.passerelles = this.game.add.group();
        this.slims = this.game.add.group();
        this.laserAsset = this.game.add.group();
        this.trampos = this.game.add.group();
        this.boss = this.game.add.group();
        bullets = this.game.add.group();

        // ==============================================
        // Creation de toute les platforms/decoration/pieges
        // ==============================================
        movingGrasseYLeft = this.platformsMovable.create(280, 540, 'grass:2x1');
        movingGrasseYRight = this.platformsMovable.create(530, 215, 'grass:2x1');
        portalTopRight = this.portal.create(270, 100, 'portalTop');
        portalBottomRight = this.portal.create(400, 410, 'portalBottom');
        //plant = this.platformsMovable.create(600, 700, 'plant');
        pizza = this.pizzas.create(2020, 350, 'pizza');
        pizza2 = this.pizzas.create(890, 490, 'pizza');
        movingGrasseX = this.platformsMovabl.create(240, 250, 'grass:2x1');
        movingGrasseXCastle = this.platformsMovabl.create(760, 565, 'grass:2x1')
        movingGrasseDownSpike = this.platformsMovable.create(1260, 570, 'grass:2x1')
        grassx3 = this.platformsMovable.create(2000, 450, 'grassx3');
        star1 = this.stars.create(1480, 550, 'star');
        // ==============================================
        // Animations
        // ==============================================

        // platfome qui se balance
        /*    this.game.add.tween(gameTitle.scale).from({x: 0, y: 0}, 1500, Phaser.Easing.Default, true, 0);*/
        this.game.add.tween(grassx3).to({x: '-300'}, 6000, Phaser.Easing.Linear.None, true, 0, -1, true);
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

        /* // PLANT MOVE
        this.game.add.tween(plant).to({
            y: plant.position.y - 45
        }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
        plant.body.setSize(plant.width, plant.height);*/

        // Platforme de haut en bas a coter du portail Moves
        this.game.add.tween(movingGrasseYLeft).to({
            y: movingGrasseYLeft.position.y - 120
        }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
        // Platforme de haut en bas a coter de la plante
        this.game.add.tween(movingGrasseYRight).to({
            y: movingGrasseYRight.position.y - 120
        }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
        // platform qui bouge sur les piques
        this.game.add.tween(movingGrasseDownSpike.body).to({
            x: '+140'
        }, 2000, Phaser.Easing.Linear.None).to({
            x: '-140'
        }, 2000, Phaser.Easing.Linear.None).yoyo().loop().start();
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
        data.sharpers.forEach(this._spawnSharper, this);
        // Appelle la fonction qui spawn toute les platforms contenue dans le JSON passé en parametre de la fonction loadLevel
        data.platforms.forEach(this._spawnPlatform, this);
        // appel les donnée "fireBalls" dans JSON
        data.fireBalls.forEach(this._spawnFireBalls, this);
        // appel les donnée "passerelles" dans JSON
        data.passerelles.forEach(this._spawnPasserelles, this);
        // appel les donnée "keys" dans JSON
        data.keys.forEach(this._spawnKeys, this);
        // appel les donnée "laserAsset" dans JSON
        PlayState._spawnLaser();
        // appel les donnée "trampos" dans JSON
        data.trampos.forEach(this._spawnTrampo, this);
        // appel les donnée "spike" dans JSON
        data.spikeData.forEach(this._spawnSpike, this);
        // spawn hero and enemies
        this._spawnCharacters({
            hero: data.hero,
            minotaur: data.minotaur
        });
    } else {
        this.fireWorks = this.game.add.group();
        this.platforms = this.game.add.group();
        this.boss = this.game.add.group();
        bullets = this.game.add.group();
        // Appelle la fonction qui spawn toute les platforms contenue dans le JSON passé en parametre de la fonction loadLevel
        data.platforms.forEach(this._spawnPlatform, this);
        this._spawnCharacters({
            hero: data.hero,
            boss: data.boss
        });
    }
    // appel les donnée "lavaData" dans JSON
    data.lavaData.forEach(this._spawnLava, this);
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(20, 'bullet');
    bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetBullet);

    function resetBullet(bullet) {
        // Destroy the bullet
        bullet.kill();
    }

    // Same as above, set the anchor of every sprite to 0.5, 1.0
    bullets.callAll('anchor.setTo', 'anchor', 0.5, 0.5);

    // This will set 'checkWorldBounds' to true on all sprites in the group
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('body.allowGravity', false);
};
