$(document).ready(function () {
    /**
     * ===========================
     *     GAME INITIALIZATION
     * ===========================
     */
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    context.fillStyle = "black";
    context.fillRect(0, canvas.height + 600, canvas.width, canvas.height);

    // Player creation, players must have a dimension, a color, a speed and a starting position
    const PLAYER_SIZE_X = 70;
    const PLAYER_SIZE_Y = 100;
    const PLAYER_SPEED = 10;
    const PLAYER_VELOCITY_X = 0;
    const PLAYER_VELOCITY_Y = 0;

    const PLAYER1_STARTX = canvas.width - canvas.width * .8;
    const PLAYER1_STARTY = canvas.height - (150 + PLAYER_SIZE_Y);
    const PLAYER2_STARTX = canvas.width - canvas.width * .25;
    const PLAYER2_STARTY = canvas.height - (150 + PLAYER_SIZE_Y);

    var player1 = new Player(1, "red", PLAYER_SIZE_X, PLAYER_SIZE_Y, PLAYER_SPEED, PLAYER_VELOCITY_X, PLAYER_VELOCITY_Y, PLAYER1_STARTX, PLAYER1_STARTY);
    var player2 = new Player(2, "blue", PLAYER_SIZE_X, PLAYER_SIZE_Y, PLAYER_SPEED, PLAYER_VELOCITY_X, PLAYER_VELOCITY_Y, PLAYER2_STARTX, PLAYER2_STARTY);

    player1.setOtherPlayer(player2);
    player2.setOtherPlayer(player1);

    // Initial spawning of Players
    player1.draw(context);
    player2.draw(context);

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
        setInterval(function(){
            getKeyPresses();
            context.clearRect(0, 0, canvas.width, canvas.height);
            player2.update(context);
            player1.update(context);
        }, (1000/60));
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
     * @param playerSpeed
     * @param vx
     * @param vy
     * @param playerStartX
     * @param playerStartY
     */
    constructor(playerNumber, playerColor, playerSizeX, playerSizeY, playerSpeed, vx, vy, playerStartX, playerStartY) {
        this.playerNumber = playerNumber;
        this.playerColor = playerColor;
        this.playerSizeX = playerSizeX;
        this.playerSizeY = playerSizeY;
        this.playerSpeed = playerSpeed;
        this.vx = vx;
        this.vy = vy;
        this.playerX = playerStartX;
        this.playerY = playerStartY;
        this.otherPlayer;
    }

    draw(context) {
        if (this.playerNumber == 1) {
            context.fillStyle = this.playerColor;
            context.fillRect(this.playerX, this.playerY, this.playerSizeX, this.playerSizeY);
        }
        else {
            context.fillStyle = this.playerColor;
            context.fillRect(this.playerX, this.playerY, this.playerSizeX, this.playerSizeY);
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

    update(context){
        if (this.isOnGround()){
            this.vy = 0;
            this.playerY = canvas.height - (150 + this.playerSizeY);
        }
        else{
            this.vy += 2.5;
        }
        this.playerX += this.vx;
        this.playerY += this.vy;
        this.vy *= 0.9;
        this.vx *= 0.8;
        this.draw(context);
    }

    otherPlayerCollision() {
        return true;
    }

    jump() {
        if ((this.playerY >= 0) && (this.isOnGround())){
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
        else{
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