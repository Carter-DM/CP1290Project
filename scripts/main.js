$(document).ready(function () {

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    var player1 = new Player(1, "red");
    var player2 = new Player(2, "blue");
    player1.spawn(context, canvas);
    player2.spawn(context, canvas);

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
    constructor(playerNumber, playerColor) {
        this.playerNumber = playerNumber;
        this.playerColor = playerColor;
    }

    /**
     * Spawn function
     * <p>Draws the respective player at the default starting position
     *
     * @param context
     * @param canvas
     */
    spawn(context, canvas) {
        if (this.playerNumber == 1) {
            context.fillStyle = this.playerColor;
            context.fillRect(canvas.width - canvas.width * .8, canvas.height - 150, 50, 50);
        }
        else {
            context.fillStyle = this.playerColor;
            context.fillRect(canvas.width - canvas.width * .25, canvas.height - 150, 50, 50);
        }
    }

    jump() {
        // Jump will be called on up key press
    }

    goLeft() {
        // goLeft will be called on left key press
    }

    goRight() {
        // goRight will be called on right key press
    }

    goDown() {
        // goDown will be called on by downward key press
    }

    attack() {
        // attack will be called on attack key press
        // TODO: Possibly have different attacks depending on direction/movement?
    }
}