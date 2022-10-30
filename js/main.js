// populate link list on portfolio

//get the list URI
let listContainer = document.getElementById('link-list');

//list of links to be populated
let linkList = [
    //week 1
    {
        label: "Week 1 notes",
        url: "week1/index.html"
    }, //dont forget comma here after adding week 2
    //week 2
    {
        label: "Week 2 notes",
        url: "week2/index.html"
    },
    //week 3
    {
        label: "Week 3 notes",
        url: "week3/index.html"
    },
    //week 4
    {
        label: "Week 4 notes",
        url: "week4/index.html"
    },
    //week 5
    {
        label: "Week 5 notes",
        url: "week5/index.html"
    },
    //week 6
    {
        label: "Week 6 notes",
        url: "week6/index.html"
    },
    //week 7
    {
        label: "Week 7 notes",
        url: "week7/index.html"
    }
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