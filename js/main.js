// create Hero
function Hero(game, x, y, sprites, speed, attackSpeed, health, maxHealth, range, damageCount) {
    this.sprites = sprites;
    Phaser.Sprite.call(this, game, x, y, sprites);
    this.anchor.set(0.5, 0.5);
    this.SPEED = speed;
    this.attackSpeed = attackSpeed;
    this.health = health;
    this.maxHealth = maxHealth;
    this.range = range;
    this.damageCount = damageCount;
    if (HEROCHOSEN === 'mage') {
        this.animations.add('right', [4, 5], 3, true);
        this.animations.add('standRight', [0, 1], 3, true);
        this.animations.add('standLeft', [2, 3], 3, true);
        this.animations.add('left', [6, 7], 3, true);
        this.animations.add('up', [9], 3, true);
        this.animations.add('fightRight', [10], this.attackSpeed / 10, true);
        this.animations.add('fightLeft', [11], this.attackSpeed / 10, true);
        this.animations.add('getingHitLeft', [13], 3, false);
        this.animations.add('getingHitRight', [14], 3, false);
        this.animations.add('getingHitFireLeft', [15, 16], 2, true);
        this.animations.add('dieLeft', [19], 2, true);
        this.animations.add('dieRight', [20], 2, true);
    } else {
        this.animations.add('right', [4, 5], 3, true);
        this.animations.add('standRight', [0, 1], 3, true);
        this.animations.add('standLeft', [2, 3], 3, true);
        this.animations.add('left', [6, 7], 3, true);
        this.animations.add('up', [9], 3, true);
        this.animations.add('fightRight', [10, 12, 12, 13, 14], this.attackSpeed / 10, false);
        this.animations.add('fightLeft', [15, 16, 17, 18, 19], this.attackSpeed / 10, false);
        this.animations.add('getingHitLeft', [20], 3, false);
        this.animations.add('getingHitRight', [21], 3, false);
        this.animations.add('getingHitFireLeft', [22, 23], 2, true);
        this.animations.add('dieLeft', [26], 2, true);
        this.animations.add('dieRight', [27], 2, true);
    }
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
                if (!lavaDamage) {
                    this.animations.play('right');
                }
                break;
            case LEFT:
                if (!lavaDamage) {
                    this.animations.play('left');
                }
                break;
            case FIGHT:
                this.hit();
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
                this.animations.play('getingHitLeft');
                heroFrame = true;
                setTimeout(() => {
                    heroFrame = false;
                }, 300);
                break;
            case 'right':
                this.game.add.tween(this).to({
                    x: this.body.position.x + 70
                }, 100, Phaser.Easing.Linear.None, true, 0);
                this.animations.play('getingHitRight');
                heroFrame = true;
                setTimeout(() => {
                    heroFrame = false;
                }, 300);
                break;
                break;
            case 'up':
                this.game.add.tween(this.body).to({
                    y: '-10'
                }, 100, Phaser.Easing.Linear.None, true, 0);
                break;
            default:
        }
    }
    if (this.alive) {
        this.health -= amount;
        if (this.health <= 0) {
            heroFrame = true;
            setTimeout(() => {
                heroFrame = false;
            }, 500);
            hero.animations.play('dieLeft');
            dead = true;
            this.alive = false;
            this.game.add.tween(this).from({
                alpha: 0
            }, 200, Phaser.Easing.Cubic.Out, true, 0, -1, true);
            setTimeout(() => {
                this.kill();
                PlayState._soundEffect('gameover')
                this.game.state.restart();
                minotaurKey = false


                var canvasTest = document.getElementsByTagName('canvas')[0];
                canvasTest.hidden = true;
                let containerGameOver = document.createElement("div")
                document.body.appendChild(containerGameOver)
                let buttonRestart = document.createElement("button")
                let buttonChoosePerso = document.createElement("button")

                buttonRestart.className = "pixel"
                buttonRestart.textContent = "Restart"
                buttonRestart.style.fontSize = "25px"

                buttonChoosePerso.className = "pixel"
                buttonChoosePerso.textContent = "Exit"
                buttonChoosePerso.style.fontSize = "25px"

                containerGameOver.appendChild(buttonRestart)
                containerGameOver.appendChild(buttonChoosePerso)

                buttonRestart.addEventListener("click", () => {
                    canvasTest.hidden = false;
                    containerGameOver.remove();
                }, false);

                buttonChoosePerso.addEventListener("click", () => {
                    buttonChoosePerso.onclick = screenChoosePerso.hidden = false;
                    canvasTest.remove();

                    containerGameOver.remove();
                    this.game.remove();


                }, false);

                laser = 1;
                laserCount = 53;
            }, 1200)
        }
    }
    return this;
};

Hero.prototype.hit = function () {
    if (this.game.physics.arcade.distanceBetween(this, minotaur) < this.range) {
        if (this.position.y >= minotaur.position.y - 10 && this.position.y <= minotaur.position.y + 10) {
            if (this.sprites !== 'mage' && minotaur.health > 0) {
                minotaur.damage(this.damageCount);
                PlayState._soundEffect('splash');
            }
        }
    }
    if (level === 1) {
        if (this.game.physics.arcade.distanceBetween(this, boss) < this.range + 200) {
            if (this.sprites !== 'mage' && boss.health > 0) {
                boss.damage(this.damageCount);
                PlayState._soundEffect('splash');
            }
        }
    }
    if (this.game.physics.arcade.distanceBetween(this, slime) < this.range) {
        if (this.position.y >= slime.position.y - 10 && this.position.y <= slime.position.y + 10) {
            slime.damage(this.damageCount);
            PlayState._soundEffect('splash');
        }
    }
};


//==================
// Create new Boss
// ==================
function Boss(game, x, y, sprites) {
    this.sprites = sprites;
    Phaser.Sprite.call(this, game, x, y, sprites);
    this.anchor.set(0.5, 0.5);
    this.health = 5;
    this.attackSpeed = 1500;
    this.animations.add('movinLeft', [0, 1, 2, 3], 8, true);
    this.animations.add('movinRight', [6, 7, 8, 9], 8, true);
    this.animations.add('attackLeft', [12, 13], 10, true);
    this.animations.add('attackRight', [14, 15], 10, true);
    this.animations.add('damageLeft', [16], 4, false);
    this.animations.add('damageRight', [18], 4, false);
    this.animations.add('dieLeft', [17], 1, false);
    this.animations.add('dieRight', [19], 1, false);
    this.animations.play('movinLeft');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.events.onAnimationComplete.add(function (event) {
        bossAnimationAttackPLaying = false;
    }, this);
}

Boss.SPEED = 70;
Slime.SPEED = 70;
Minotaur.SPEED = 60;
// inherit from Phaser.Sprite
Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;
Boss.prototype.damage = function (amount) {
    this.health -= amount;
    if (hero.x < boss.x) {
        this.animations.play('damageLeft', false, false);
    } else {
        this.animations.play('damageRight', false, false);
    }
    this.events.onAnimationComplete.add(function (event) {
        if (event.animations.currentAnim.name === 'damageLeft') {
            this.animations.play('movinLeft');
            this.body.velocity.x = -Boss.SPEED;
        } else {
            this.animations.play('movinRight');
            this.body.velocity.x = Boss.SPEED;
        }
    }, this);
};

Boss.prototype.update = function () {
    if (this.health > 0) {
        if (this.game.physics.arcade.distanceBetween(this, hero) < 220) {
            if (bossCanAttack === true) {
                bossCanAttack = false;
                if (hero.x < this.x) {
                    attackFinished = false;
                    bossAnimationAttackPLaying = true;
                    this.animations.play('attackLeft', false, false);
                    hero.damage(0.75, 'left');
                    PlayState._soundEffect('blade')
                } else {
                    attackFinished = false;
                    bossAnimationAttackPLaying = true;
                    this.animations.play('attackRight', false, false);
                    hero.damage(0.75, 'right');
                    PlayState._soundEffect('blade')
                }
                setTimeout(() => {
                    bossCanAttack = true;
                }, boss.attackSpeed)
            }
            this.body.velocity.x = 0;
        } else if (hero.x < 400 || hero.x > 1080) {
            if (boss.x > 890 && boss.x < 910) {
                this.animations.play('movinLeft');
            } else if (boss.x > 590 && boss.x < 610) {
                this.animations.play('movinRight');
            } else if (hero.x < 400) {
                this.animations.play('movinRight');
                this.game.physics.arcade.moveToXY(this, 900, 405, 50, 1000);
            } else {
                this.animations.play('movinLeft');
                this.game.physics.arcade.moveToXY(this, 600, 405, 50, 1000);
            }
        } else if (this.game.physics.arcade.distanceBetween(this, hero) < 500 && hero.x < this.x && this.body.velocity.x >= 0 && bossAnimationAttackPLaying === false) {
            // move enemy to left
            this.animations.play('movinLeft');
            this.body.velocity.x = -Boss.SPEED;
        }
        // if player to right of enemy AND enemy moving to left (or not moving)
        else if (this.game.physics.arcade.distanceBetween(this, hero) < 500 && hero.x > this.x && this.body.velocity.x <= 0 && bossAnimationAttackPLaying === false) {
            // move enemy to right
            this.animations.play('movinRight');
            this.body.velocity.x = Boss.SPEED; // turn right
        }
    } else {
        this.body.velocity.x = 0;
        if (hero.x < this.x) {
            this.animations.play('dieLeft', false, false);
        } else {
            this.animations.play('dieRight', false, false);
        }
        this.events.onAnimationComplete.add(function (event) {
            this.kill();
            if (win === false) {
                win = true;
                PlayState._fireWork();
                //PlayState._wingame();
            }
        }, this);
    }
};

function Minotaur(game, x, y, sprites) {
    this.sprites = sprites;
    Phaser.Sprite.call(this, game, x, y, sprites);
    this.anchor.set(0.5, 0.5);
    this.health = 3;
    this.animations.add('standingLeft', [0, 1, 2, 3], 4, true);
    this.animations.add('movinLeft', [4, 5, 6, 7, 8, 9, 10, 11, 12], 12, true);
    this.animations.add('movinRight', [13, 14, 15, 16, 17, 18, 19, 20, 21], 12, true);
    this.animations.add('attackRight', [22, 23, 24, 25, 26, 27, 28, 29], 5, true);
    this.animations.add('attackLeft', [30, 31, 32, 33, 34, 35, 36, 37], 5, true);
    this.animations.add('die', [38, 39, 40, 41, 42], 5, true);
    this.animations.play('standingLeft');
    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}

Minotaur.prototype = Object.create(Phaser.Sprite.prototype);
Minotaur.prototype.constructor = Minotaur;
Minotaur.prototype.damage = function (amount) {
    this.health -= amount;
};
Minotaur.prototype.update = function () {
    if (minotaur._exists) {
        if (this.health > 0) {
            if ((hero.position.x < 840 || hero.position.x > 1200) && (this.position.x > 1010 && this.position.x < 1030)) {
                this.animations.play('standingLeft');
                this.body.velocity.x = 0;
            } else {
                if (this.position.x > 840 && this.position.x < 1180 && hero.position.x > 840 && hero.position.x < 1200) {
                    if (this.game.physics.arcade.distanceBetween(this, hero) > 50 && hero.position.y < 300) {
                        // if player to left of enemy AND enemy moving to right (or not moving)
                        if (hero.x < this.x && this.body.velocity.x >= 0) {
                            // move enemy to left
                            this.animations.play('movinLeft');
                            this.body.velocity.x = -Minotaur.SPEED;
                        }
                        // if player to right of enemy AND enemy moving to left (or not moving)
                        else if (hero.x > this.x && this.body.velocity.x <= 0) {
                            // move enemy to right
                            this.animations.play('movinRight');
                            this.body.velocity.x = Minotaur.SPEED; // turn right
                        }
                        bossCloseOfHero = true
                    } else {
                        if (this.game.physics.arcade.distanceBetween(this, hero) < 50) {
                            this.body.velocity.x = 0;
                            if (hero.x < this.x && this.body.velocity.x >= 0) {
                                this.animations.play('attackLeft', 15, false, false);
                                if (minotaureHitHero === false) {
                                    minotaureHitHero = true;
                                    setTimeout(() => {
                                        minotaureHitHero = false;
                                    }, 1500);
                                    this.events.onAnimationComplete.add(function (event) {
                                        if (event.animations.currentAnim.name === 'attackLeft') {
                                            hero.damage(0.75, 'left');
                                            PlayState._soundEffect('blade')
                                        }
                                    }, this);
                                }
                            } else if (hero.x > this.x && this.body.velocity.x <= 0) {
                                this.animations.play('attackRight', 15, false, false);
                                if (minotaureHitHero === false) {
                                    minotaureHitHero = true;
                                    setTimeout(() => {
                                        minotaureHitHero = false;
                                    }, 1500);
                                    this.events.onAnimationComplete.add(function (event) {
                                        if (event.animations.currentAnim.name === 'attackRight') {
                                            hero.damage(0.75, 'right');
                                            PlayState._soundEffect('blade')
                                        }
                                    }, this);
                                }
                            }
                            if (dead) {
                                dead = false;
                            }
                        }
                        bossCloseOfHero = false;
                    }
                } else {
                    if (this.position.x <= 840) {
                        this.animations.play('movinRight');
                        this.body.velocity.x = Minotaur.SPEED; // turn right
                    } else if (this.position.x >= 1180) {
                        this.animations.play('movinLeft');
                        this.body.velocity.x = -Minotaur.SPEED;
                    } else {
                        if (hero.position.x < 1019) {
                            this.animations.play('movinRight');
                            this.game.physics.arcade.moveToXY(this, 1020, 270, 50, 1000);
                        } else {
                            this.animations.play('movinLeft');
                            this.game.physics.arcade.moveToXY(this, 1020, 270, 50, 1000);
                        }
                    }
                }
            }
        } else {
            this.body.velocity.x = 0;
            PlayState._soundEffect('minotaurDie')
            this.animations.play('die', false, false);
            this.events.onAnimationComplete.add(function () {
                minotaur.kill();
                PlayState._spawnKeys({
                    x: minotaur.body.x + 20,
                    y: minotaur.body.y - 20
                });
                minotaurKey = true;
            })
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
    if (this.body.touching.right || this.body.blocked.right || this.position.x >= 1670) {
        this.animations.play('left');
        this.body.velocity.x = -Slime.SPEED; // turn left
    } else if (this.body.touching.left || this.body.blocked.left || this.position.x <= 1470) {
        this.animations.play('right');
        this.body.velocity.x = Slime.SPEED; // turn right
    }
};

// ==============================================
// Fonction qui remet l'etat de base si la personne viens de sauter et atterie sur une platform
// ==============================================
function spriteVsPlatform(hero) {
    if (jumpin) {
        if (leftOrRight === 1) {
            //hero.animations.play('standRight');
        } else {
            //hero.animations.play('standLeft');
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
    if (!lavaDamage && hero.health > 0) {
        lavaDamage = true;
        setTimeout(() => {
            lavaDamage = false;
        }, 300);
        hero.animations.play('getingHitFireLeft');
        heroFrame = true;
        setTimeout(() => {
            heroFrame = false;
        }, 300);
        hero.damage(0.25, 'up');
        this.sfx.lava.play();
        if (dead) {
            this.sfx.die.play();
            dead = false;
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
    this.game.physics.arcade.collide(hero, this.platforms, spriteVsPlatform, null, this);
    this.game.physics.arcade.collide(hero, this.grass3Data);
    this.game.physics.arcade.collide(hero, this.passerelles, this._onHerovsPasserelle, null, this);
    this.game.physics.arcade.collide(hero, movingGrasseX, spriteVsPlatform, null, this);
    this.physics.arcade.collide(hero, this.platformsMovable);
    this.physics.arcade.overlap(hero, this.slims, this._onSpriteVsSLime, null, this);
    this.physics.arcade.overlap(hero, this.sharpers, this._onSpriteVsSharper, null, this);
    this.physics.arcade.collide(hero, movingGrasseXCastle);
    this.game.physics.arcade.collide(hero, this.portal);
    this.game.physics.arcade.collide(bullets, this.slims, this._onBulletVsMonster, null, this);
    this.game.physics.arcade.collide(bullets, this.boss, this._onBulletVsMonster, null, this);
    this.game.physics.arcade.collide(hero, this.trampos, this._onHerovsTrampos, null, this);
    // this.game.physics.arcade.collide(hero, plant, spriteMovinPlant, null, this);
    this.game.physics.arcade.collide(this.slims, this.enemyWalls);
    this.game.physics.arcade.collide(hero, laserTop);
    this.game.physics.arcade.collide(hero, laserTop2);
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
                laser.reset(hero.x + 20, hero.y + 10);

                // Give it a velocity of -500 so it starts shooting
                laser.body.velocity.x = +400;
                setTimeout(() => {
                    if (laser.position.x >= hero.position.x + 200) {
                        laser.kill()
                    }
                }, 600);
            } else {
                // If we have a laser, set it to the starting position
                laser.reset(hero.x - 20, hero.y + 10);
                // Give it a velocity of -500 so it starts shooting
                laser.body.velocity.x = -400;
                setTimeout(() => {
                    if (laser.position.x >= hero.position.x + 300) {
                        laser.kill()
                    }
                }, 800);
            }
        }
    }
}

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
};
// ======================
// Crée le/les slims passé en parametre
// ======================

PlayState._spawnSlime = function (nbr) {
    Slime.SPEED = 100;
    for (let i = 0; i < nbr; i++) {
        let slime = new Slime(this.game, getRandomArbitrary(1450, 1550), 580, 'slime');
        slime.body.setSize(slime.width, slime.height);
        this.game.add.existing(slime);
        slime.body.allowGravity = false;
        slime.body.immovable = true;
        this.slims.add(slime);
    }
};

PlayState._spawnCharacters = function (data) {
    // spawn hero
    switch (HEROCHOSEN) {
        case 'warrior':
            hero = new Hero(this.game, data.hero.x, data.hero.y, HEROCHOSEN, 150, 700, 5, 5, 60, 0.75);
            break;
        case 'assasin':
            hero = new Hero(this.game, data.hero.x, data.hero.y, HEROCHOSEN, 200, 400, 3, 3, 50, 0.5);
            break;
        case 'mage':
            hero = new Hero(this.game, data.hero.x, data.hero.y, HEROCHOSEN, 170, 500, 2, 2, 600, 0.5);
            break;
        default:
    }
    // set hero size in game
    hero.body.setSize(45, 46);
    // add hero in game
    this.game.add.existing(hero);
    if (this.level === 1) {
        boss = new Boss(this.game, data.boss.x, data.boss.y, 'boss');
        this.game.add.existing(boss);
        boss.body.allowGravity = false;
        boss.body.immovable = true;
        boss.body.bounce.x = 1;
        boss.body.setSize(300, 400);
        this.boss.add(boss);
    } else {
        // créer le minotaur
        minotaur = new Minotaur(this.game, data.minotaur.x, data.minotaur.y, 'minotaur');
        this.game.add.existing(minotaur);
        minotaur.body.allowGravity = false;
        minotaur.body.immovable = true;
        minotaur.body.bounce.x = 1;
        minotaur.body.setSize(30, 40);
        this.boss.add(minotaur);
        //  creer le slime
        slime = new Slime(this.game, 1530, 580, 'slime');
        slime.body.setSize(slime.width, slime.height);
        this.game.add.existing(slime);
        slime.body.allowGravity = false;
        slime.body.immovable = true;
        slime.scale.setTo(1.8, 1.8);
        this.slims.add(slime);
    }
};
// ==========================
// Crée les clefs
// ==========================
PlayState._spawnKeys = function (key) {
    if (minotaurKey === false) {
        let sprite = this.key.create(key.x, key.y, 'key');
        sprite.anchor.set(0.5, 0.5);
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.animations.add('movin', [0, 1, 2, 3, 4, 5, 6], 4, true);
        sprite.animations.play('movin');
        this.game.physics.arcade.collide(hero, key, this._onHeroVskey, null, this);
    }
};
PlayState._spawnTrampo = function (trampo) {
    let sprite = this.trampos.create(trampo.x, trampo.y, 'trampo');
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    sprite.animations.add('upDown', [1, 0], 6, false)
};

PlayState._spawnLaser = function () {
    laserLeft = this.laserAsset.create(1860, 45, 'laserRight');
    laserLeft.anchor.set(0.5, 0.5);
    this.game.physics.enable(laserLeft);
    laserLeft.body.allowGravity = false;
    laserLeft.body.immovable = true;
    laserLeft.body.setSize(0, 0);

    laserTop = this.laserAsset.create(1891, 25, 'laser');
    laserTop.anchor.set(0.5, 0.5);
    this.game.physics.enable(laserTop);
    laserTop.body.allowGravity = false;
    laserTop.body.immovable = true;
    laserTop.body.setSize(0, 0);

    laserTop2 = this.laserAsset.create(1921, 25, 'laser');
    laserTop2.anchor.set(0.5, 0.5);
    this.game.physics.enable(laserTop2);
    laserTop2.body.allowGravity = false;
    laserTop2.body.immovable = true;
    laserTop2.body.setSize(0, 0);

    laserRight = this.laserAsset.create(1950, 45, 'laserRight');
    laserRight.anchor.set(0.5, 0.5);
    this.game.physics.enable(laserRight);
    laserRight.body.allowGravity = false;
    laserRight.body.immovable = true;
    laserRight.body.setSize(0, 0);

    laserLeft.animations.add('fire', [1], 1, true);
    laserLeft.animations.add('stop', [0], 1, true);
    laserRight.animations.add('fire', [1], 1, true);
    laserRight.animations.add('stop', [0], 1, true);
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
    }, 10000);
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
        }, 100)
        setTimeout(() => {
            bulletDamage = false;
        }, 100)
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
        hero.body.velocity.y -= 700;
        this.sfx.jump.play();
        setTimeout(() => {
            heroJumpinOnTrampo = false;
        }, 350)
    }
};

PlayState._soundEffect = function (sound) {
    if (sound === 'blade') {
        this.sfx.blade.play();
    } else if (sound === 'splash') {
        this.sfx.splash.play();
    } else if (sound === 'minotaurDie') {
        this.sfx.minotaurDie.play();
    } else if (sound === 'gameover') {
        this.sfx.gameover.play();
    }
};

PlayState._onHerovsPasserelle = function (hero, passerelle) {
    setTimeout(() => {
        passerelle.body.allowGravity = true;
    }, 800);
};

PlayState._fireWork = function () {
    let fireWorksColors = ['fireWorkRed', 'fireWorkYellow', 'fireWorkPurple', 'fireWorkBlue'];
    for (let i = 0; i < 100; i++) {
        let currentFireWork = fireWorksColors[getRandomArbitrary(0, 3).toFixed(0)];
        let sprite = this.fireWorks.create(getRandomArbitrary(300, 1180), getRandomArbitrary(20, 350), `${currentFireWork}`);
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
        sprite.animations.add('fire', [0, 1, 2, 3, 4, 5, 6, 7], 16, true);
        sprite.animations.play('fire');
    }
    this.sfx.win.play();
    let win = this.game.add.sprite(520, 400, 'win');
    win.animations.add('win', [0, 1, 2, 3], 8, true);
    win.animations.play('win');
    this.sfx.win.onStop.addOnce(function () {
        PlayState._wingame();
    }, this);
};

PlayState._handleLaser = function () {
    if (laserCount !== 0) {
        laserCount--;
    } else {
        laserCount = 150;
        if (laser === 0) {
            laser = 1;
            laserLeft.animations.play('fire');
            laserRight.animations.play('stop');
        } else if (laser === 1) {
            laser = 0;
            laserRight.animations.play('fire');
            laserLeft.animations.play('stop');
        }
    }
    if (laser === 1) {
        if (hero.position.y < 50 && hero.position.x > 1830 && hero.position.x < 1895) {
            hero.damage(0.01, 'up');
        }
    } else if (laser === 0) {
        if (hero.position.y < 50 && hero.position.x > 1925 && hero.position.x < 1980) {
            hero.damage(0.01, 'up');
        }
    }
};
PlayState._wingame = function () {
    minotaurKey = false;
    var canvasTest = document.getElementsByTagName('canvas')[0];
    canvasTest.hidden = true;
    let containerGamewin = document.createElement("div")
    document.body.appendChild(containerGamewin)
    let buttonChoosePerso = document.createElement("button")

    buttonChoosePerso.className = "pixel";
    buttonChoosePerso.textContent = "Exit";
    buttonChoosePerso.style.fontSize = "25px";

    containerGamewin.appendChild(buttonChoosePerso);

    buttonChoosePerso.addEventListener("click", () => {
        document.location.reload(true);
    }, false);
};

function runGame(persoChoose) {
    HEROCHOSEN = persoChoose;
    var game = new Phaser.Game(config);
    game.state.add('play', PlayState);
    game.state.start('play', true, false, {
        level: 0
    });

}

