const baseURL = "https://type.fit/api/quotes";

// fetch(baseURL, {method: "GET"})
// .then((response) => {
//     response.text();
// })
// .then((data) =>{
//     console.log(data);
// })

async function getapi(url)
{
  const response = await fetch(url);
  var data = await response.json();
  console.log(data);
  

const container = document.getElementById('container');
container.innerHTML = renderQuotes(data);
}

const quotes = getapi(baseURL);

function renderQuotes(objectList){
    let results = '<ul>'
    objectList.forEach(element => {
        results += `<li>"${element.text}" - ${element.author}</li>`
    });
    results += '</ul>';
    return results;
}