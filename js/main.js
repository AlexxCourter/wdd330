// populate link list on portfolio

//get the list URI
let listContainer = document.getElementById('link-list');

//list of links to be populated
let linkList = [
    //week 1
    {
        label: "Week 1 notes",
        url: "week1/index.html"
    } //dont forget comma here after adding week 2
    //week 2
    //week 3
    //week 4
    //week 5
    //week 6
    //week 7
    //week 8
    //week 9
    //week 10
    //week 11
    //week 12
    //week 13
    //week 14
];

//define how the list items are added to the list
function createListItemsFromArray(list, listContainer) {
    list.forEach(item => {
        listContainer.innerHTML += "<li class='link-list_item'><a href='" + item.url + "'>" + item.label + "</a></li>"
    });
    
};

createListItemsFromArray(linkList, listContainer);