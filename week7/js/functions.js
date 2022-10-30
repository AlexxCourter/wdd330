//practicing the use of an IIFE
(function(){
    let time = Date.now();
    let date = new Date(time);
    let hours = date.getHours();
    let message = 'day';
    switch(hours){
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
            message = 'morning';
            console.log(`the time is ${date.getHours()}:${date.getMinutes()} | morning greeting chosen (0-12pm)`)
            break;
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
            message = 'afternoon';
            console.log(`the time is ${date.getHours()}:${date.getMinutes()} | afternoon greeting chosen (12-5pm)`)
            break;
        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
        case 23:
            message = 'evening';
            console.log(`the time is ${date.getHours()}:${date.getMinutes()} | evening greeting chosen (5-11:59pm)`)
            break;
    }

    const greeting = `Good ${message}`;
    qs('.iife').innerHTML = greeting;
})()

//function reassigns itself to provide a different value after first call
function openTreasureChest() {
    let contents = 'You opened the treasure chest and found 300 gold!';
    console.log('the function reassigns itself after first call so that the treasure chest cannot be opened twice.');
    qs('.function-rewrite').innerHTML = contents;
    openTreasureChest = function(){
        qs('.function-rewrite').innerHTML = 'You have already opened this treasure chest. Its empty.'
    }
}

//practice closures
function counter(start){
    let i = start;
    return function() {
        return i++;
    }
}

const count = counter(1);

function countBtn() {
    qs('.closure-counter').innerHTML = count();
}

//helper function
function qs(selector){
    return document.querySelector(selector);
}