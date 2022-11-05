//prepended to every API call.
const baseURL = "https://swapi.dev/api/";
//specify to the web server that we are looking up starships.
const starshipURL = "starships/";
const peopleURL = "people/";

//DEBUG - shows the data in the console for the basic API Call
fetch(`${baseURL}${starshipURL}`)
.then((response) => response.json())
.then((data) => console.log(data));
//DEBUG

fetchData(`${baseURL + starshipURL}`);

/*
 * fetchData takes @param (String) fetchURL and performs a fetch to get
 * JSON data returned from the API at that URL.
 * then sets up page with result count, a rendered list of the data, and page navigation buttons.
*/
function fetchData(fetchURL){
    fetch(`${fetchURL}`)
    .then((response) => response.json())
    .then((data) => {
        //grab the id (url for next page) so we can set a listener on the button
        let nextBtnId = data.next;
        //grab url for previous page
        let prevBtnId = data.previous;
        document.getElementById('info').innerHTML = `
        <p>results: ${data.count}</p>
        <button id="${data.previous}">Previous</button>
        <button id="${data.next}">Next</button>

        ${renderDataList(data.results)}
        ` //end render

        setObjectListener(data.results);
        //if next is null, no button listener
        if (data.next){setNavBtnListener(nextBtnId);}
        //if previous is null, no button listener
        if (data.previous){setNavBtnListener(prevBtnId)}
        
    }
);

}

function renderDataList(objectList){
    let resultSet = "<ul>";
    objectList.forEach(result => {
        let item = `<li id='${result.name}'>`;
        item += `
        name: ${result.name}
        <br>model: ${result.model}
        <br>manufacturer: ${result.manufacturer}
        `
        item += '</li>'

        resultSet += item;
    })
    resultSet += "</ul>"
    return resultSet;
}

function setObjectListener(objectList) {
    objectList.forEach(result => {
        //add event listener to the li with the same id
        let element = document.getElementById(`${result.name}`);
        element.addEventListener('click', () => {
            fullView(result);
        })
    })
}

function setNavBtnListener(id) {
    let btn = document.getElementById(id);
    //remove listener first to prevent doubling
    btn.removeEventListener('click', () => {
        fetchData(btn.id);
    })
    //add the click listener to go to next/previous page
    btn.addEventListener('click', () => {
        fetchData(btn.id);
    })
}

function fullView(object) {
    alert(
        `name : ${object.name}
        \nmodel: ${object.model}
        \nmanufacturer : ${object.manufacturer}
        \nCargo capacity : ${object.cargo_capacity}
        \nPassengers : ${object.passengers}
        \nHyperdrive rating : ${object.hyperdrive_rating}
        \nMax speed : ${object.max_atmosphering_speed}
        \nStarship class : ${object.starship_class}
        `
    )
}