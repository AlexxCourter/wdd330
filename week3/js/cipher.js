const cipher = new Map();
//set the maps for all 26 letters. 
cipher.set('A','Q');
cipher.set('Q','A');
cipher.set('S','W');
cipher.set('W','S');
cipher.set('D','E');
cipher.set('E','D');
cipher.set('F','R');
cipher.set('R','F');
cipher.set('G','T');
cipher.set('T','G');
cipher.set('H','Y');
cipher.set('Y','H');
cipher.set('J','U');
cipher.set('U','J');
cipher.set('K','I');
cipher.set('I','K');
cipher.set('L','O');
cipher.set('O','L');
cipher.set('P','Z');
cipher.set('Z','P');
cipher.set('X','C');
cipher.set('C','X');
cipher.set('V','B');
cipher.set('B','V');
cipher.set('N','M');
cipher.set('M','N');
cipher.set(" ", " ");

const exampleNote = "This part was straightforward. Simply use a function that gets the location of the example message in the document, translate the string into an Array, and then use a forEach loop to iterate over the characters of the message. The string is reconstructed and inserted in the textContent of the original message HTML element.";
const userMessageNote = "I probably should separate the example and user message encoding into separate functions. It was simple enough to check if a keyword had been passed to the function, or if it was default, so I left it as 1 function that codes the messages. When the user message is encoded, the function accesses the value of the textarea. An alert will warn the user to try again after entering a message if the textarea is left empty. The function checks to see if the characters entered are some simple punctuation or a space. If it is, these characters are not in the cipher, so they are inserted as is into the result string. Otherwise, the cipher Map is checked for the character, and it is converted accordingly the same way as the example message button does. For future versions of this, perhaps checking against a regexp would save space and allow to easily check for more characters, for example, numbers will cause errors (becomes undefined) when entered and need to be checked for.";
const themeNotes = "The javascript code for this could use some cleaning, but I was experimenting with querySelectors to manage DOM nodes. I was successfully able to target a large number of elements and change their styles accordingly."

//returns the value of the example message from the document.
//Return: String
function getExampleMessage() {
    return document.getElementById('ex-message').textContent;
}

//the message 'user' is passed when functionality other than default for example message is wanted.
function encode(message=""){
    //capture the message to be encoded and pass it in to this function
    if (message === "") {
        let exMessage = getExampleMessage();
        let destination = document.getElementById('ex-message');

        let toCipher = [...exMessage];
        // console.log(toCipher); //debug
        let result = "";
        toCipher.forEach(character => {
            if (character !== " "){
                result += cipher.get(character.toUpperCase());
            } else {
                result += character;
            }
        })
        // console.log(result); //debug
        destination.innerHTML = result;
        logNotes(exampleNote);
    } else {
        userMessage = document.getElementById('user-message').value;
        // console.log(userMessage); //debug

        if (userMessage === ""){
            alert('Please enter your secret message in the text box first.')
        } else {
            let destination = document.getElementById('message-display');

            let toCipher = [...userMessage];
            let result = "";
            toCipher.forEach(character => {
                if ([" ", ",", ".", ";", ":"].includes(character)){
                    result += character;
                } else {
                    result += cipher.get(character.toUpperCase());
                }

            })
            //apply the coded message to the display area, and replace the users entry with the encoded/decoded version
            destination.innerHTML = result;
            document.getElementById('user-message').value = result;
            logNotes(userMessageNote);
        }

    }

   
}

function logNotes(note) {
    console.log(note);
}

function cleanThemes(element) {
    element.classList.remove('bubbly-mode');
    element.classList.remove('night-mode');
    element.classList.remove('bubbly-mode--button');
    element.classList.remove('night-mode--button');
}

function nightMode() {
    logNotes(themeNotes);
    //get the elements that will change background and text color
    let nightElements = document.querySelectorAll("main > *");
    let nightButtons = document.querySelectorAll("button");

    nightElements.forEach(element => {
        cleanThemes(element);

        element.classList.toggle('night-mode');
    })

    nightButtons.forEach(element => {
        cleanThemes(element);

        element.classList.toggle('night-mode--button');
    })

    cleanThemes(document.body);

    document.body.classList.toggle('night-mode');
}

function bubblyMode() {
    logNotes(themeNotes);
    let bubblyElements = document.querySelectorAll("main > *");
    let bubblyButtons = document.querySelectorAll("button");

    //reset themes before setting
    bubblyElements.forEach(element => {
        cleanThemes(element);
        
        element.classList.toggle('bubbly-mode');
    })

    bubblyButtons.forEach(element => {
        cleanThemes(element);

        element.classList.toggle('bubbly-mode--button');
    })

    document.body.classList.toggle('bubbly-mode');
}

function normalThemeMode() {
    logNotes(themeNotes);
    let everyElement = document.querySelectorAll('*');

    everyElement.forEach(element => {
        cleanThemes(element);
    })
}