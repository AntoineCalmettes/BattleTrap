// ==============================================
// Ecouteur d'evenement sur la touche du clavier pressé
// ==============================================
PlayState._handleInput = function () {
    let spaceBar = this.game.input.keyboard.addKey(32);
    let attackAXbox = pad1.justPressed(Phaser.Gamepad.XBOX360_B)
    let upAXbox = pad1.justPressed(Phaser.Gamepad.XBOX360_A);
    let upAna = pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
    // Recupere le ASCI de la barre d'espace
    let isDown = spaceBar.isDown;
    isDownX = attackAXbox;
    if (this.keys.up.isDown || upAXbox || upAna || ((pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) && upAXbox) || ((pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) && upAXbox)) {
        hero.jump();
        this.game.camera.y += 1;
    } else if (this.keys.left.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) { // move hero left

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
        hero.jump();
        this.game.camera.y += 1;
    } else { // stop
        hero.move(0);
        if (leftOrRight === 1) {
            hero.animations.play('standRight');
        } else {
            hero.animations.play('standLeft');
        }
    }

};
