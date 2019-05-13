// ==============================================
// Fontion qui s'active toute les 1ms pour update le jeux
// ==============================================
PlayState.update = function () {
    this._handleInput();
    this._handleCollisions();
    this._handleBullet();
    healthBar.scale.setTo(hero.health / hero.maxHealth, 1);

    if (HEROCHOSEN === 'mage' && isDownX) {
        fireLaser();
    }
    if (this.level === 0) {
        this._handleLaser();
        // go to boss
        KeyPickupCount = 5;
        keynumber.text = KeyPickupCount;
        if (KeyPickupCount >= 5) {
            level = 1;
            this.game.state.restart(true, false, {level: 1});
        }

        // Si le hero touche le portail dimemensionel il est teleporter a celui du dessus
        if ((hero.position.y > 380 && hero.position.y < 450) && (hero.position.x > 380 && hero.position.x < 480)) {
            hero.position.y = 200;
            hero.position.x = 360;
            this.sfx.portal.play();
        }
    }
    // debug
    this.game.debug.spriteInfo(hero, 40, 50);
};
