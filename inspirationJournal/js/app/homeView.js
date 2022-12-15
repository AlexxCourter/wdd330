import Menu from "../components/menu.js";
import QuoteModel from "./quotes.js";

/**
 * HomeView handles the first screen that users see: the home page.
 * 
 * uses a menu and QuoteModel to manage navigation and the quote card
 * respectively.
 * 
 * @class HomeView
 * @since 1.0.0
 * @access public
 * @requires module:Menu
 * @requires module:QuoteModel
 * 
 */
export default class HomeView {
    locationID = 'content-dock';
    menu = new Menu();
    quotes = new QuoteModel();

    /**
     * calls all required methods to render the home page.
     * 
     * clears the content dock, then renders the banner, quote card, and menu.
     * 
     * @see contentClear
     * @see renderBanner
     * @see QuoteModel.getOneQuote
     * @see renderQuoteCard
     * @see Menu.showMenu
     * @see Menu.attachBtnListeners
     */
    show() {
        //reset the content dock
        contentClear(this.locationID);
        //render the Home page banner
        renderBanner(this.locationID);
        //use quotes object to render quote card
        if(this.quotes.getOneQuote() !== null){
            renderQuoteCard(this.locationID, this.quotes.getOneQuote());
        } else {
            renderQuoteCard(this.locationID, this.quotes.defaultMessage());
        }
        //set the menu bar
        this.menu.showMenu();
        this.menu.attachBtnListeners();
    }
}

/**
 * renders the home page banner.
 * @since 1.0.0
 * 
 * @param {(number | string)} id the id of the HTML element where the banner will be rendered.
 */
function renderBanner(id) {
    const banner = `
    <div id="homeBanner" class="banner">
    <h2>Inspiration and Mindfulness</h2>
    <p>in three easy steps.</p>
    <span>Ponder</span><span>Journal</span><span>Act</span>
    </div>`;

    document.getElementById(id).innerHTML += banner;
}

/**
 * removes the innerHTML contained within an element so that it can be replaced.
 * 
 * @param {(number | string)} id the id of the HTML element to be emptied.
 */
function contentClear(id) {
    document.getElementById(id).innerHTML = "";
}

/**
 * creates a quote card filled by data from the QuoteModel.
 * 
 * @param {(number | string)} id the id of the HTML element where the quote card will be placed.
 * @param {object} filler a quote object that will fill the content areas of the quote card
 */
function renderQuoteCard(id, filler) {

    const card = `
    <div id="quoteCard" class="card">
    <p data-id="quoteId">${filler.q}</p>
    <span id="quoteAuthor">${filler.a}</span>
    </div>`;

    document.getElementById(id).innerHTML += card;
}