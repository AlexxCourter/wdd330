const boom = new Audio('./sounds/boom.wav');
const clap = new Audio('./sounds/clap.wav');
const hihat = new Audio('./sounds/hihat.wav');
const kick = new Audio('./sounds/kick.wav');
const openhat = new Audio('./sounds/openhat.wav');
const ride = new Audio('./sounds/ride.wav');
const snare = new Audio('./sounds/snare.wav');
const tink = new Audio('./sounds/tink.wav');
const tom = new Audio('./sounds/tom.wav');

const drumArray = [boom,clap,hihat,kick,openhat,ride,snare,tink,tom];


const keyNodes = document.querySelectorAll('div.key');
const keyNodeArray = [...keyNodes];
//function for playing an audio
//keys
//need to add 
window.addEventListener('keypress', (event) => {
    const key = event.key;
    switch (key){
        case 'a':
            document.key
            clap.currentTime = 0;
            clap.play();
            break;
        case 's':
            hihat.currentTime = 0;
            hihat.play();
            break;
        case 'd':
            kick.currentTime = 0;
            kick.play();
            break;
        case 'f':
            openhat.currentTime = 0;
            openhat.play();
            break;
        case 'g':
            boom.currentTime = 0;
            boom.play();
            break;
        case 'h':
            ride.currentTime = 0;
            ride.play();
            break;
        case 'j':
            snare.currentTime = 0;
            snare.play();
            break;
        case 'k':
            tom.currentTime = 0;
            tom.play();
            break;
        case 'l':
            tink.currentTime = 0;
            tink.play();
            break;
    }
})

console.dir(boom);