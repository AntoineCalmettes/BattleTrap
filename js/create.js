// ==============================================
// Crée le jeux
// ==============================================
PlayState.create = function () {

    this.game.input.gamepad.start();

    // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
    pad1 = this.game.input.gamepad.pad1;
    // creation des sons du jeux
    this.sfx = {
        gameover: this.game.add.audio('gameover'),
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
        splash: this.game.add.audio('sfx:splash'),
        minotaurDie: this.game.add.audio('sfx:minotaurDie'),
        win: this.game.add.audio('sfx:win'),
        laser: this.game.add.audio('sfx:laser'),
        orcLaugh: this.game.add.audio('sfx:orcLaugh')
    };


    // Creation de la map en parallax
    background = this.add.tileSprite(0, 0, 3410, 620, "bg_back");
    building = this.add.tileSprite(0, 0, 2210, 620, "buildinImg");
    fontMap = this.add.tileSprite(0, 0, 3410, 620, "bg_front");
    building.fixedToCamera = true; // Creer le parallax
    this.game.world.setBounds(0, 0, 2130, 620); // taille du monde

    // Charge le fichier JSON du niveaux 1
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));

    // change position if needed (but use same position for both images)
    var backgroundBar = this.game.add.image(70, 20, 'red-bar');
    backgroundBar.fixedToCamera = true;

    healthBar = this.game.add.image(70, 20, 'green-bar');
    healthBar.fixedToCamera = true;

    // add text label to left of bar
    var healthLabel = this.game.add.text(20, 20, 'Vie', {
        fontSize: '20px',
        fill: '#ffffff'
    });

    healthLabel.fixedToCamera = true;
    keynumber = this.game.add.text(50, 60, KeyPickupCount, {
        fontSize: '20px',
        fill: '#ffffff',
    });
    keynumber.fixedToCamera = true;
};
