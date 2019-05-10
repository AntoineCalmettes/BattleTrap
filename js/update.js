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
    // debug
    // his.game.debug.spriteInfo(hero, 40, 50);
    healthBar.scale.setTo(hero.health / hero.maxHealth, 1);

    if (HEROCHOSEN === 'mage' && isDownX) {
        fireLaser();
    }
    this.game.debug.spriteInfo(hero, 40, 50)
};
