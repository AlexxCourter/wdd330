

const quotes = `
<div id="quote" class="card">
</div>`;

/*
* Class: HomeView
* MVC View logic for the homepage of the app
*/
export default class HomeView {
    locationID = 'content-dock';

    show() {
        //reset the content dock
        contentClear(this.locationID);
        //render the Home page banner
        renderBanner(this.locationID);
        //use quotes object to render quote card
        renderQuoteCardTest(this.locationID);
    }
}

function renderBanner(id) {
    console.log('rendering the banner from HomeView');
    const banner = `
    <div id="homeBanner" class="banner">
    <h2>Inspiration and Mindfulness</h2>
    <p>in three easy steps.</p>
    <span>Ponder</span><span>Journal</span><span>Act</span>
    </div>`;

    document.getElementById(id).innerHTML += banner;
}

function contentClear(id) {
    document.getElementById(id).innerHTML = "";
}

function renderQuoteCardTest(id) {
    console.log('rendering a test version of the quote card from HomeView. The real function for getting a quote will port in from the quotes.js module');

    const filler = "quote goes here"
    const card = `
    <div id="quoteCard" class="card">
    <p data-id="quoteId">${filler}</p>
    </div>`;

    document.getElementById(id).innerHTML += card;
}