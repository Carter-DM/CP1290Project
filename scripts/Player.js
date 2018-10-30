export default class Player {
    constructor (playerNumber){
        this.playerNumber = playerNumber;
    }

    spawn(){
        // Draw player to default position on screen depending on player number
    }

    jump(){
        // Jump will be called on up key press
    }

    goLeft(){
        // goLeft will be called on left key press
    }

    goRight(){
        // goRight will be called on right key press
    }

    attack(){
        // attack will be called on attack key press
        // TODO: Possibly have different attacks depending on direction/movement?
    }
}