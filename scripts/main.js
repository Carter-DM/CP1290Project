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

    // TODO: Have each spritesheet set as a respective this.animation_idle, this.animation_jump etc. for easy animation changes
    // Setting player1 to idle animation
    var player1_idle = new Image();
    player1_idle.onload = function () {
        player1.setCurrentAnimation(player1_idle);
    }
    player1_idle.src = "images/Player1_Idle_x2_Spritesheet.png";

    var spriteCoordinates =
        [[0, 0, 140, 170],      // Frame 0
        [140, 0, 140, 170],     // Frame 1
        [280, 0, 140, 170],     // Frame 2
        [0, 170, 140, 170],     // Frame 3
        [140, 170, 140, 170],   // Frame 4
        [280, 170, 140, 170]    // Frame 5
    ];

    // Loading weapon
    var WEAPON_RAPIER = new Image();

    WEAPON_RAPIER.onload = function () {
        player1.setWeapon(WEAPON_RAPIER);
        player2.setWeapon(WEAPON_RAPIER);
    };
    WEAPON_RAPIER.src = "images/TempSword.png";

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
        setInterval(function () {
            getKeyPresses();
            context.clearRect(0, 0, canvas.width, canvas.height);
            player2.update(context);
            player1.update(context);
            currentFrame++;
            if (currentFrame == 60) {
                currentFrame = 0;
            }
            if (currentFrame % 10 == 0) {
                player1.updateFrame(spriteCoordinates[Math.floor(currentFrame/10)]);
            }
        }, (1000 / 60));
    }

    function getKeyPresses() {
        if (keys[87]) {
            console.log("w - Player 1 up");
            player1.jump(context);
        }
        if (keys[65]) {
            console.log("a - Player 1 left");
            player1.goLeft(context);
        }
        if (keys[68]) {
            console.log("d - Player 1 right");
            player1.goRight(context);
        }
        if (keys[83]) {
            console.log("s - Player 1 down");
            player1.goDown(context);
        }
        if (keys[38]) {
            console.log("up arrow - Player 2 up");
            player2.jump(context);
        }
        if (keys[37]) {
            console.log("left arrow - Player 2 left");
            player2.goLeft(context);
        }
        if (keys[39]) {
            console.log("right arrow - Player 2 right");
            player2.goRight(context);
        }
        if (keys[40]) {
            console.log("down arrow - Player 2 down");
            player2.goDown(context);
        }

        // TODO: Attack keys
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
        this.playerNumber = playerNumber;
        this.playerColor = playerColor;
        this.playerSizeX = playerSizeX;
        this.playerSizeY = playerSizeY;
        this.vx = vx;
        this.vy = vy;
        this.playerX = playerStartX;
        this.playerY = playerStartY;
        this.animation;
        this.sprite_x;
        this.sprite_y;
        this.sprite_w;
        this.sprite_h;
        this.otherPlayer;
        this.weaponImage;
    }

    draw(context) {
        if (this.playerNumber == 1) {
            context.fillStyle = this.playerColor;
            context.drawImage(this.animation, this.sprite_x, this.sprite_y, this.sprite_w, this.sprite_h, this.playerX, this.playerY, this.playerSizeX, this.playerSizeY);
        }
        else {
            context.fillStyle = this.playerColor;
            context.fillRect(this.playerX, this.playerY, this.playerSizeX, this.playerSizeY);
        }
    }

    setCurrentAnimation(animation) {
        this.animation = animation;
    }

    updateFrame(coordinates){
        this.sprite_x = coordinates[0];
        this.sprite_y = coordinates[1];
        this.sprite_w = coordinates[2];
        this.sprite_h = coordinates[3];
    }

    drawWeapon(context) {
        context.drawImage(this.weaponImage, this.playerX + 60, this.playerY - 25);
    }

    setWeapon(weaponImage) {
        this.weaponImage = weaponImage;
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
            this.vy += 2.5;
        }
        this.playerX += this.vx;
        this.playerY += this.vy;
        this.vy *= 0.9;
        this.vx *= 0.8;
        this.draw(context);
        //this.drawWeapon(context);
    }

    otherPlayerCollision() {
        return true;
    }

    jump() {
        if ((this.playerY >= 0) && (this.isOnGround())) {
            this.vy = -40;
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

    goDown() {
        if (this.playerY + this.playerSizeY <= 650) {

        }
        else {
            // crouch
        }
    }

    attack() {
        // attack will be called on attack key press
        // TODO: Possibly have different attacks depending on direction/movement?
    }

    clear(context) {
        context.clearRect(this.playerX, this.playerY, this.playerSizeX, this.playerSizeY);
    }
}