$(document).ready(function () {
    /**
     * ===========================
     *     GAME INITIALIZATION
     * ===========================
     */
        // Getting the fps of browser to determine animation speed
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    context.fillStyle = "black";
    context.fillRect(0, canvas.height + 600, canvas.width, canvas.height);

    // Player creation, players must have a dimension, a color, a speed and a starting position
    var PLAYER_SIZE = 50;
    var PLAYER_SPEED = 10;

    var PLAYER1_STARTX = canvas.width - canvas.width * .8;
    var PLAYER1_STARTY = canvas.height - 200;
    var PLAYER2_STARTX = canvas.width - canvas.width * .25;
    var PLAYER2_STARTY = canvas.height - 200;

    var player1 = new Player(1, "red", PLAYER_SIZE, PLAYER_SPEED, PLAYER1_STARTX, PLAYER1_STARTY);
    var player2 = new Player(2, "blue", PLAYER_SIZE, PLAYER_SPEED, PLAYER2_STARTX, PLAYER2_STARTY);

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
        getKeyPresses();

        requestAnimationFrame(gameLoop)
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
     * Player constructor
     *
     * @param playerNumber
     * @param playerColor
     */
    constructor(playerNumber, playerColor, playerSize, playerSpeed, playerStartX, playerStartY) {
        this.playerNumber = playerNumber;
        this.playerColor = playerColor;
        this.playerSize = playerSize;
        this.playerSpeed = playerSpeed;
        this.playerX = playerStartX;
        this.playerY = playerStartY;
    }

    draw(context) {
        // TODO: Add check to see if still within dimensions of canvas
        if (this.playerNumber == 1) {
            context.fillStyle = this.playerColor;
            context.fillRect(this.playerX, this.playerY, this.playerSize, this.playerSize);
        }
        else {
            context.fillStyle = this.playerColor;
            context.fillRect(this.playerX, this.playerY, this.playerSize, this.playerSize);
        }
    }

    // TODO: Alter movement calculation based on framerate

    // TODO: Determine a way to not clear other player on overlap

    jump(context) {
        this.clear(context);
        if (this.playerY > 0){
            this.playerY -= this.playerSpeed;
        }
        this.draw(context);
    }

    goLeft(context) {
        this.clear(context);
        if (this.playerX > 0) {
            this.playerX -= this.playerSpeed;
        }
        this.draw(context);
    }

    goRight(context) {
        this.clear(context);
        if (this.playerX + this.playerSize < 1200) {
            this.playerX += this.playerSpeed;
        }
        this.draw(context);
    }

    goDown(context) {
        this.clear(context);
        if (this.playerY + this.playerSize < 650) {
            this.playerY += this.playerSpeed;
        }
        this.draw(context);
    }

    attack() {
        // attack will be called on attack key press
        // TODO: Possibly have different attacks depending on direction/movement?
    }

    clear(context) {
        context.clearRect(this.playerX, this.playerY, this.playerSize, this.playerSize);
    }
}