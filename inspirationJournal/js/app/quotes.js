/**
 * @file quotes contains classes for model of quote functionality and quote API interaction.
 * @author Alexander DK Courter
 * @version 1.0.0
 */

import {writeToLS, readFromLS} from '../utilities/storageHelper.js';

const zenKey = "c0691e419c31c1487248e2a185b2207110394c42";

const resetDelay = 86400000; //one day worth of milliseconds

/**
 * QuoteModel handles API interaction to cache quotes and methods for accessing the quotes.
 * 
 * @class QuoteModel
 * @since 1.0.0
 * @access public
 * 
 * @requires module:storageHelper
 */
export default class QuoteModel {
    /**
     * loads quotes into the model from LS if available, or from zenquotes.io API.
     * 
     * @constructor
     * 
     * @see readFromLS
     * @see writeToLS
     * @see loadQuotesFromAPI
     * @see defaultMessage
     * 
     * @param {Array=null} quoteList An array of quote objects
     */
    constructor(quoteList=null){
        this.quoteList = quoteList;
        this.key = zenKey;
        this.LSkey = 'quoteKey';

        if(!readFromLS('quoteReset')){
            writeToLS('quoteReset', Date.now());
        } else if (readFromLS('quoteReset')){
            let date = readFromLS('quoteReset');
            if(date + resetDelay <= Date.now()){
                writeToLS('quoteReset', Date.now());
                this.loadQuotesFromAPI();
            }
        }

        if(this.quoteList === null){
            //need to add a way to check LS for a key/value pair while it is still the same day.
            if(readFromLS(this.LSkey)){
                this.setQuotes(readFromLS(this.LSkey));
            } else {
                //sets default quote which is like an instructional first-open message
                this.defaultMessage();
                this.loadQuotesFromAPI();
            }
        }
    }
    /**
     * Gives the app a default message to display on first use.
     * 
     * when the quotes are pulled from the API for the first time, there will be nothing to load 
     * into the quote box. This default message will fill the empty space until the quotes 
     * are cached and therefore able to be loaded into the view.
     * 
     * @returns {object} a default startup message for the first time the app is loaded.
     */
    defaultMessage(){
        return {q: "Welcome to the Inspiration Journal! You can use this app to write down thoughts in the journal, track how you're feeling in the 'track' tab, or set some goals in the 'goals' tab. Quotes will show up right here from now on to keep you inspired.", a: "Inspiration Journal Team"}
    }

    /**
     * returns a random indexed quote from the list, or null if no list exists.
     * 
     * @see setQuotes
     * @see readFromLS
     * 
     * @returns {(object | null)} a random quote or null if there is an error.
     */
    getOneQuote(){
        //fix the list if empty.
        if(this.quoteList === null){
            if(readFromLS(this.LSkey)){
                this.setQuotes(readFromLS(this.LSkey));
            }
        }

        try{
            let index = Math.floor((Math.random()*49) + 1);

            return this.quoteList[index -1];

        } catch {
            return null;
        }
        //returns a random quote from the quote list
        
    }

    /**
     * getter for the cached quote list.
     * @returns {Array} the list of quote objects.
     */
    getQuotes(){
        return this.quoteList;
    }

    /**
     * setter for the cached quote list.
     * @param {Array} quoteList the new list to replace the current quote list.
     */
    setQuotes(quoteList){
        this.quoteList = quoteList;
    }

    /**
     * calls outside function to start a new call to cache quotes to LocalStorage.
     * @see cacheQuotes
     */
    loadQuotesFromAPI(){
        cacheQuotes(this.key);
    }

}

/**
 * calls the async function that gets API data using an API key.
 * @param {string} key API key used to access the API
 */
function cacheQuotes(key){
    //caches 50 quotes from the API to the quoteModel. This is saved in LS, and resets the next day.
    const api_url =`https://zenquotes.io/api/quotes/${key}`;
    getapi(api_url);
}

/**
 * async function get fetches API data and saves it to LocalStorage as a cache of quotes.
 * 
 * @see writeToLS
 * 
 * @param {string} url the API endpoint to be fetched.
 */
async function getapi(url)
    {
      const response = await fetch(url);
      let data = await response.json();
      writeToLS('quoteKey', data);
    }

//future implementation
async function resetQuote(delayLength){
    //reloads a new quote 
}