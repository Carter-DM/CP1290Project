$(document).ready(function () {
    /**
     * ===========================
     *     GAME INITIALIZATION
     * ===========================
     */
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Player creation, players must have a dimension, a color, a speed and a starting position
    const PLAYER_SIZE_X = 140;
    const PLAYER_SIZE_Y = 170;
    const PLAYER_VELOCITY_X = 0;
    const PLAYER_VELOCITY_Y = 0;

    const PLAYER1_STARTX = canvas.width - canvas.width * .8;
    const PLAYER1_STARTY = canvas.height - (150 + PLAYER_SIZE_Y);
    const PLAYER2_STARTX = canvas.width - canvas.width * .25;
    const PLAYER2_STARTY = canvas.height - (150 + PLAYER_SIZE_Y);

    var player1 = new Player(1, "red", PLAYER_SIZE_X, PLAYER_SIZE_Y, PLAYER_VELOCITY_X, PLAYER_VELOCITY_Y, PLAYER1_STARTX, PLAYER1_STARTY);
    var player2 = new Player(2, "blue", PLAYER_SIZE_X, PLAYER_SIZE_Y, PLAYER_VELOCITY_X, PLAYER_VELOCITY_Y, PLAYER2_STARTX, PLAYER2_STARTY);

    player1.setOtherPlayer(player2);
    player2.setOtherPlayer(player1);

    // Loading in each spritesheet
    loadAnimations(player1, player2);

    var playerSpriteCoordinates =
        [[0, 0, 140, 170],      // Frame 0
            [140, 0, 140, 170],     // Frame 1
            [280, 0, 140, 170],     // Frame 2
            [0, 170, 140, 170],     // Frame 3
            [140, 170, 140, 170],   // Frame 4
            [280, 170, 140, 170]    // Frame 5
        ];

    var swordIdleCoordinates =
        [[0, 0, 60, 170],       // Frame 0
            [60, 0, 60, 170],       // Frame 1
            [120, 0, 60, 170],      // Frame 2
            [180, 0, 60, 170],      // Frame 3
            [0, 170, 60, 170],      // Frame 4
            [60, 170, 60, 170]      // Frame 5
        ];

    var swordAttackCoordinates =
        [[0, 0, 170, 170],       // Frame 0
            [170, 0, 170, 170],       // Frame 1    - Hitbox live
            [0, 170, 170, 170],      // Frame 2     - Hitbox live
            [170, 170, 170, 170],      // Frame 3   - Hitbox live
            [0, 340, 170, 170],      // Frame 4
            [170, 340, 170, 170]      // Frame 5
        ];

    // Dictionary that will be filled with key presses
    var keys = {};

    window.addEventListener('keydown', function (e) {
        // TODO: keyCode is deprecated, consider using alternative
        keys[e.keyCode] = true;
    });

    window.addEventListener('keyup', function (e) {
        // TODO: keyCode is deprecated, consider using alternative
        keys[e.keyCode] = false;
    });

    gameLoop();

    /**
     * ==============================
     *        MAIN GAME LOOP
     * ==============================
     */
    function gameLoop() {
        var currentFrame = 0;
        var player1CoolDown = 0;
        var player2CoolDown = 0;
        setInterval(function () {
            if (player1.playerX <= player2.playerX) {
                player1.setReverse(true);
                player2.setReverse(false);
            }
            else {
                player1.setReverse(false);
                player2.setReverse(true);
            }

            player1.setCurrentAnimation("idle");
            player2.setCurrentAnimation("idle");

            getKeyPresses(currentFrame);

            if (player1.attacking) {
                player1.setWeapon("sword_attack");
                player1.updateWeaponFrame(swordAttackCoordinates[Math.floor(player1CoolDown / 10)]);
                player1CoolDown++;
                if ((player1CoolDown > 9) && (player1CoolDown < 40)) {
                    // TODO: In these frames the sword hitbox is live, check for collisions
                }
                if (player1CoolDown == 60) {
                    player1.attacking = false;
                    player1CoolDown = 0;
                }
            }
            if (!player1.attacking) {
                player1.setWeapon("sword_idle");
            }
            if (player2.attacking) {
                player2.setWeapon("sword_attack");
                player2.updateWeaponFrame(swordAttackCoordinates[Math.floor(player2CoolDown / 10)]);
                player2CoolDown++;
                if ((player2CoolDown > 9) && (player2CoolDown < 40)) {
                    // TODO: In these frames the sword hitbox is live, check for collisions
                }
                if (player2CoolDown == 60) {
                    player2.attacking = false;
                    player2CoolDown = 0;
                }
            }
            if (!player2.attacking) {
                player2.setWeapon("sword_idle");
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            player2.update(context);
            player1.update(context);

            // I could put draw weapon in update but I want to have player2's sword overlap player1
            player2.drawWeapon(context);
            player1.drawWeapon(context);

            currentFrame++;

            if (currentFrame == 60) {
                currentFrame = 0;
            }
            if (currentFrame % 10 == 0) {
                player1.updateFrame(playerSpriteCoordinates[Math.floor(currentFrame / 10)]);
                player2.updateFrame(playerSpriteCoordinates[Math.floor(currentFrame / 10)]);
                if (!player1.attacking) {
                    player1.updateWeaponFrame(swordIdleCoordinates[Math.floor(currentFrame / 10)]);
                }
                if (!player2.attacking) {
                    player2.updateWeaponFrame(swordIdleCoordinates[Math.floor(currentFrame / 10)]);
                }
            }
        }, (1000 / 60));
    }

    function getKeyPresses(currentFrame) {
        if (keys[87]) {
            player1.jump(context);
        }
        if (keys[65]) {
            player1.goLeft(context);
            if (player1.reverseAnimation) {
                player1.setCurrentAnimation("backwards");
            }
            else {
                player1.setCurrentAnimation("forward");
            }
        }
        if (keys[68]) {
            player1.goRight(context);
            if (player1.reverseAnimation) {
                player1.setCurrentAnimation("forward");
            }
            else {
                player1.setCurrentAnimation("backwards");
            }
        }
        if (keys[69]) {
            console.log("e - Player 1 attack");
            player1.attack(context);
        }
        if (keys[38]) {
            player2.jump(context);
        }
        if (keys[37]) {
            player2.goLeft(context);
            if (player2.reverseAnimation) {
                player2.setCurrentAnimation("backwards");
            }
            else {
                player2.setCurrentAnimation("forward");
            }
        }
        if (keys[39]) {
            player2.goRight(context);
            if (player2.reverseAnimation) {
                player2.setCurrentAnimation("forward");
            }
            else {
                player2.setCurrentAnimation("backwards");
            }
        }
        if (keys[36]) {
            console.log("Home - Player 2 attack");
            player2.attack(context);
        }
    }

    function loadAnimations(player1, player2) {
        player1.loadAnimation("idle", "images/Player1/Player1_Idle.png");
        player1.loadAnimation("idle_rev", "images/Player1/Player1_Idle_Rev.png");
        player1.loadAnimation("forward", "images/Player1/Player1_Forward.png");
        player1.loadAnimation("forward_rev", "images/Player1/Player1_Forward_Rev.png");
        player1.loadAnimation("backwards", "images/Player1/Player1_Backwards.png");
        player1.loadAnimation("backwards_rev", "images/Player1/Player1_Backwards_Rev.png");
        player1.loadAnimation("sword_idle", "images/Player1/Player1_Sword_Idle.png");
        player1.loadAnimation("sword_idle_rev", "images/Player1/Player1_Sword_Idle_Rev.png");
        player1.loadAnimation("sword_attack", "images/Player1/Player1_Sword_Attack.png");
        player1.loadAnimation("sword_attack_rev", "images/Player1/Player1_Sword_Attack_Rev.png");


        player2.loadAnimation("idle", "images/Player2/Player2_Idle.png");
        player2.loadAnimation("idle_rev", "images/Player2/Player2_Idle_Rev.png");
        player2.loadAnimation("forward", "images/Player2/Player2_Forward.png");
        player2.loadAnimation("forward_rev", "images/Player2/Player2_Forward_Rev.png");
        player2.loadAnimation("backwards", "images/Player2/Player2_Backwards.png");
        player2.loadAnimation("backwards_rev", "images/Player2/Player2_Backwards_Rev.png");
        player2.loadAnimation("sword_idle", "images/Player2/Player2_Sword_Idle.png");
        player2.loadAnimation("sword_idle_rev", "images/Player2/Player2_Sword_Idle_Rev.png");
        player2.loadAnimation("sword_attack", "images/Player2/Player2_Sword_Attack.png");
        player2.loadAnimation("sword_attack_rev", "images/Player2/Player2_Sword_Attack_Rev.png");
    }

});

/**
 * ===================================
 *          Player Class
 * ===================================
 */
class Player {
    /**
     *
     * @param playerNumber
     * @param playerColor
     * @param playerSizeX
     * @param playerSizeY
     * @param vx
     * @param vy
     * @param playerStartX
     * @param playerStartY
     */
    constructor(playerNumber, playerColor, playerSizeX, playerSizeY, vx, vy, playerStartX, playerStartY) {
        this.playerSizeX = playerSizeX;
        this.playerSizeY = playerSizeY;
        this.vx = vx;
        this.vy = vy;
        this.playerX = playerStartX;
        this.playerY = playerStartY;
        this.animation;
        this.animationMap = new Map();
        this.reverseAnimation;
        this.sprite_x;
        this.sprite_y;
        this.sprite_w;
        this.sprite_h;
        this.otherPlayer;
        this.weaponImage;
        this.sprite_wx;
        this.sprite_wy;
        this.sprite_ww;
        this.sprite_wh;
        this.attacking = false;

    }

    draw(context) {
        context.drawImage(this.animation, this.sprite_x, this.sprite_y, this.sprite_w, this.sprite_h, this.playerX, this.playerY, this.playerSizeX, this.playerSizeY);
    }

    setCurrentAnimation(animation) {
        if (this.reverseAnimation) {
            this.animation = this.animationMap.get(animation + "_rev");
        }
        else {
            this.animation = this.animationMap.get(animation);
        }
    }

    setReverse(bool) {
        this.reverseAnimation = bool;
    }

    addAnimation(name, spritesheet) {
        this.animationMap.set(name, spritesheet);
    }

    loadAnimation(name, spritesheet) {
        var image = new Image();
        image.src = spritesheet;
        image.onload = this.addAnimation(name, image);
    }

    updateFrame(coordinates) {
        this.sprite_x = coordinates[0];
        this.sprite_y = coordinates[1];
        this.sprite_w = coordinates[2];
        this.sprite_h = coordinates[3];
    }

    updateWeaponFrame(coordinates) {
        this.sprite_wx = coordinates[0];
        this.sprite_wy = coordinates[1];
        this.sprite_ww = coordinates[2];
        this.sprite_wh = coordinates[3];
    }

    drawWeapon(context) {
        var x;
        var y;
        if (this.attacking) {
            x = this.playerX - (this.sprite_ww * .75);
            y = this.playerY + 10;
            if (this.reverseAnimation) {
                x = this.playerX + (this.sprite_ww * .57);
            }
        }
        else {
            x = this.playerX + this.playerSizeX - (this.sprite_ww / 2);
            y = this.playerY - 35;
            if (this.reverseAnimation) {
                x = this.playerX - (this.sprite_ww / 2);
            }
        }
        context.drawImage(this.weaponImage, this.sprite_wx, this.sprite_wy, this.sprite_ww, this.sprite_wh, x, y, this.sprite_ww, this.sprite_wh);
    }

    setWeapon(weaponAnimation) {
        if (this.reverseAnimation) {
            this.weaponImage = this.animationMap.get(weaponAnimation + "_rev");
        }
        else {
            this.weaponImage = this.animationMap.get(weaponAnimation);
        }
    }

    setOtherPlayer(otherPlayer) {
        this.otherPlayer = otherPlayer;
    }

    isOnGround() {
        if ((this.playerY + this.playerSizeY) >= (canvas.height - 150)) {
            return true;
        }
        return false;
    }

    update(context) {
        if (this.isOnGround()) {
            this.vy = 0;
            this.playerY = canvas.height - (150 + this.playerSizeY);
        }
        else {
            this.vy += 1.5;
        }
        this.playerX += this.vx;
        this.playerY += this.vy;
        this.vy *= 0.9;
        this.vx *= 0.8;
        this.draw(context);
    }


    otherPlayerCollision() {
        // TODO: Check if sword intersects with other player hitbox
    }

    otherPlayerWeaponCollision(){
        // TODO: Check if sword intersects with other player's sword

    }

    jump() {
        if ((this.playerY >= 0) && (this.isOnGround())) {
            this.vy = -50;
            this.playerY += this.vy;
        }
    }

    goLeft() {
        if (this.playerX >= 0) {
            this.vx -= 2.5;
        }
        else {
            this.vx = 0;
        }
    }

    goRight() {
        if (this.playerX + this.playerSizeX <= 1200) {
            this.vx += 2.5;
        }
        else {
            this.vx = 0;
        }
    }

    attack() {
        this.attacking = true;
    }
}
