class RPG {
    constructor(game, spawnX, spawnY, direction) {
        this.game = game
        this.spawnX = spawnX
        this.spawnY = spawnY
        this.direction = direction
        this.animationspeed = .10
        this.deathanimationspeed = .15
        this.size = 2.10

        this.health = 2;

        this.fireRate = 1;
        this.elapsedTime = .5;
        this.bulletSpeed = 425;

        this.deathCounter = 0;
        this.deathMaxCounter = .7;
        this.removeFromWorldValue = 0;

        this.idleanimator = new Animator(ASSET_MANAGER.getAsset("./rpgsprite/rpgidle.png"), 
        0, 0, 44, 27, 1, this.animationspeed);
        this.idlereverseanimator = new Animator(ASSET_MANAGER.getAsset("./rpgsprite/rpgidlereverse.png"), 
        0, 0, 44, 27, 1, this.animationspeed);

        this.shootinganimator = new Animator(ASSET_MANAGER.getAsset("./rpgsprite/rpgshooting.png"), 
        0, 0, 44, 27, 5, this.animationspeed);
        this.shootingreverseanimator = new Animator(ASSET_MANAGER.getAsset("./rpgsprite/rpgshootingreverse.png"), 
        0, 0, 44, 27, 5, this.animationspeed);

        this.deathanimator = new Animator(ASSET_MANAGER.getAsset("./enemydeath/enemydeath.png"),
        0, 0, 44, 21, 5,  this.deathanimationspeed);
        this.deathanimatorreverse = new Animator(ASSET_MANAGER.getAsset("./enemydeath/enemydeathreverse.png"),
        0, 0, 44, 21, 5,  this.deathanimationspeed);
        this.updateBB();
    };

    updateBB() { 
        this.lastBB = this.BB;   
        if (this.direction == 1) {
            this.BB = new BoundingBox(this.spawnX + 25 - this.game.camera.x, this.spawnY + 4, 35, 54);
        } else {
            this.BB = new BoundingBox(this.spawnX + 35 - this.game.camera.x, this.spawnY + 6, 35, 54);
        }
    };

    update() {
        const TICK = this.game.clockTick
        this.elapsedTime += TICK
        // Player detection
        if ((this.spawnX - this.game.camera.x > 0 && this.spawnX - this.game.camera.x < 1280)) {
            if (this.elapsedTime >= this.fireRate && this.removeFromWorldValue != 1) {
                this.game.addEntityToFrontOfList(new Rocket(gameEngine, this.spawnX + 90, this.spawnY + 3, true, this.direction, .021, this.bulletSpeed));
                this.elapsedTime = 0;
            }
        }
        if (this.removeFromWorldValue != 1) {
            this.updateBB();
        }
    };

    remove() {
        if (this.health <= 0) {
            ASSET_MANAGER.playAsset("./sounds/enemies/Die.mp3")
            this.removeFromWorldValue = 1;
            this.BB = new BoundingBox(0, 0, 0, 0);
        } else {
            ASSET_MANAGER.playAsset("./sounds/enemies/Hurt.wav")
            this.health -= 1
        }
    };

    draw(ctx) {
        const TICK = this.game.clockTick
        // The enemy is shooting animation
        if (this.removeFromWorldValue == 0 && this.elapsedTime < .5) {
            if (this.direction == 1) {
                this.shootinganimator.drawFrame(this.game.clockTick, ctx, this.spawnX - this.game.camera.x, this.spawnY, this.size);
            } else {
                this.shootingreverseanimator.drawFrame(this.game.clockTick, ctx, this.spawnX - this.game.camera.x, this.spawnY, this.size);
            }
        // The enemy has died animation
        } else if (this.removeFromWorldValue == 1 && this.deathCounter <= this.deathMaxCounter) {
            if (this.direction == 1) {
                this.deathanimator.drawFrame(this.game.clockTick, ctx, this.spawnX - this.game.camera.x, this.spawnY + 12, this.size)             
            } else {
                this.deathanimatorreverse.drawFrame(this.game.clockTick, ctx, this.spawnX - this.game.camera.x, this.spawnY + 12, this.size)
            }
            this.deathCounter += TICK;
        // To reset the animation back to frame 1 and to sync shooting and animation
        } else if (this.removeFromWorldValue == 0) {
            this.shootinganimator = new Animator(ASSET_MANAGER.getAsset("./rpgsprite/rpgshooting.png"), 
            0, 0, 44, 27, 5, this.animationspeed);
            this.shootingreverseanimator = new Animator(ASSET_MANAGER.getAsset("./rpgsprite/rpgshootingreverse.png"), 
            0, 0, 44, 27, 5, this.animationspeed);
            if (this.direction == 1) {
                this.idleanimator.drawFrame(this.game.clockTick, ctx, this.spawnX - this.game.camera.x, this.spawnY, this.size)
            } else {
                this.idlereverseanimator.drawFrame(this.game.clockTick, ctx, this.spawnX - this.game.camera.x, this.spawnY, this.size)
            }
        }
        // To see the bounding box
        if (params.debug) {
            ctx.strokeStyle = 'white';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    }
}