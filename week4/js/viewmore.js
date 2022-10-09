const shortPar = document.querySelector('.shortform');

const fullMessage = "These darkened thoughts plagued his mind day in and day out. The only reprieve that he had was that, occasionally, he saw and could appreciate the patience that others treated him with. The young man tried not to let what was going on inside him show on the outside, because he thought it was his fight. He thought “to involve my friends would be unfair to them.” But when others saw through the façade, and asked him if they could help, even when it was so simple as helping to set up chairs in the conference room or distributing the translation devices, it filled him with such relief. He felt like he wasn't alone carrying the weight he had of his own accord decided to carry. Those moments were healing to the young man."

//create a card that gets displayed. The blur background can be on CSS ::Before tag or something

function showCard(){
    //prevent multiple cards being created
    if(document.querySelector('div.card')){
        return;
    } else {
        const card = document.createElement("div");
        card.classList.add('card');

        const cardContent = document.createElement("p");
        cardContent.textContent = fullMessage;

        const removeButton = document.createElement('button');
        removeButton.setAttribute('onclick', 'removeCard()');
        removeButton.innerHTML = "close";

        //const overlay = document.createElement('div');
        //overlay.classList.add('overlay');

        card.appendChild(cardContent);
        card.appendChild(removeButton);

        document.body.appendChild(card);
        //document.body.appendChild(overlay);

         //overlay will be inserted in a future implementation. currently not working properly.
    }
}

//remove the card when the close button is clicked.
function removeCard(){
    let card = document.querySelector('div.card');
    //let overlay = document.querySelector('div.overlay');
    document.body.removeChild(card);
    //document.body.removeChild(overlay);

    //make sure to add back in overlay when it is implemented
}