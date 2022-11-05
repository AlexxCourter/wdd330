
class RollModel {
    constructor(){
        this.history = [];
    }
    //keeps a brief history of recent roll results
    //will display and save up to the most recent 10 rolls.
    addRoll


}

export default class Dice {
    constructor(sides=6) {
        this.sides = sides;

        this.setRollListener();
    }

    roll(){
        return Math.floor(this.sides * Math.random() + 1)
    }

    getSides(){
        return this.sides;
    }

    //the only realistic options are 2 (coin), 4, 6, 8, 10, 12, 20, 100 (percentage dice)
    setSides(number){
        this.sides = number;
    }

    setRollListener(){
        let btn = document.getElementById('roll');
        btn.addEventListener('click', () => {
            renderDice(this.roll());
        })
    }
}

function renderDice(roll){
    //initially renders just the result of rolling.
    let destination = document.getElementById('dice');
    destination.innerHTML = `<img src='./img/dice-${roll}.svg'>`;
}

