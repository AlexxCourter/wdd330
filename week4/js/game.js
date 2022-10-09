const wholeBoard = document.querySelector('div.game_wrapper');

const boardSpaces = document.querySelectorAll('div.game_board');

//player markers
const playerOne = "X";
const playerTwo = "O";

let turnPlayer = 1;

console.log(boardSpaces);

boardSpaces.forEach((space) => {
    space.addEventListener('touchend', () => {
        
        if(space.textContent != "X" && space.textContent != "O" ){
            if (turnPlayer === 1){
                space.textContent = playerOne;
                checkWinner();
                turnPlayer = 2;
            } else if (turnPlayer === 2){
                space.innerHTML = playerTwo;
                checkWinner();
                turnPlayer = 1;
            }
            
        } else if (space.textContent == "X" || space.textContent == "O"){
            alert("That space is already chosen. Please choose an empty space.");

        }
    })
});

function checkWinner(){
    const column1 = document.querySelectorAll('.column1');
    const column2 = document.querySelectorAll('.column2');
    const column3 = document.querySelectorAll('.column3');

    const row1 = document.querySelectorAll('.row1');
    const row2 = document.querySelectorAll('.row2');
    const row3 = document.querySelectorAll('.row3');

    const diagonal1 = [column1[0], column2[1], column3[2]];
    const diagonal2 = [column1[2], column2[1], column3[0]];

    let iterable = [column1, column2, column3, row1, row2, row3, diagonal1, diagonal2];

    iterable.forEach(list => {
        let winCondition = checkMarkers(list);
        if (winCondition.winner === 'x'){
            endGame('X');
        } else if (winCondition.winner === 'o'){
            endGame('O');
        }
    })

}

function checkMarkers (nodeList) {
    let x = 0;
    let o = 0;

    nodeList.forEach(element => {
        if (element.textContent == "X"){
            x += 1;
        } else if (element.textContent == "O"){
            o += 1;
        }
    })
    if (x === 3){
        return {'winner' : "x"};
    } else if (o === 3){
        return {'winner' : "o"};
    } else {
        return {'winner' : 'none'}
    }

}

function endGame(winner){
    document.querySelector('.game_info').innerHTML = `The winner is ${winner}!`
}

//resets the game
function clearBoard(){
    boardSpaces.forEach((space) => {
        space.textContent = "";
    })
    document.querySelector('.game_info').innerHTML = "";
    turnPlayer = 1;
}

