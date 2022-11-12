const baseURL = "https://zenquotes.io/api/quotes";

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
}

getapi(baseURL);