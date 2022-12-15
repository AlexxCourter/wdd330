/**
 * @file moodtracker contains classes for model, view, and controller of mood tracking functionality.
 * @author Alexander DK Courter
 * @version 1.0.0
 */

import Menu from '../components/menu.js';
import { writeToLS, readFromLS } from '../utilities/storageHelper.js';

//entries are numbers 1-3 representing the 3 mood report options. 1= down, 2= neutral, 3= good.

/**
 * TrackerModel handles data manipulation and storage for the Mood Tracker functionality.
 * 
 * @class TrackerModel
 * @since 1.0.0
 * @access private
 * @requires module:storageHelper
 * 
 */
class TrackerModel {
    _entryList = [];
    trackerKey = "moodTracker";

    /**
     * Checks LocalStorage for a list of mood tracker entries. If exists, pulls list into current model.
     * @constructor
     */
    constructor(){
        //checks for localStorage backup of current list
        if(readFromLS(this.trackerKey)){
            this.pullEntriesFromLS();
        }
    }

    /**
     * Getter that gets the list of entries currently laoded in the model.
     * @returns {Array} the currently loaded list of mood entries from the model.
     */
    getEntries(){return this._entryList;}

    /**
     * Setter that sets a new list of entries in place of the _entryList already loaded.
     * @param {Array} newList the new list of mood tracker entries to save to the model.
     */
    setEntries(newList){this._entryList = newList;}

    /**
     * Gets a mood tracker entry from the model by using its unique timestamp.
     * 
     * Only one entry can exist per day, So the app simply searches the date timestamp
     * associated with an entry to find it.
     * 
     * @see getEntries
     * 
     * @param {string} timestamp a date string related to a specific entry.
     * @returns {object} the mood tracker entry associated to the provided timestamp.
     */
    getEntryByTimestamp(timestamp){
        let workingList = this.getEntries();
        //search the entrylist for the desired item. returns the desired item.
        return workingList.find(item => item.timestamp === timestamp);
    }

    /**
     * creates a mood tracker entry object to save to the model.
     * 
     * @see writeToLS
     * 
     * @param {(number | string)} moodNumber the number that corresponds to the users mood rating.
     */
    addEntry(moodNumber){
        //create the data object using moodNumber and timestamp from a date object
        let date = new Date();
        let today = date.toDateString();
        let newList = this.getEntries();

        let newEntry = {
            entry: moodNumber,
            timestamp: today
        }

        newList.unshift(newEntry);

        writeToLS(this.trackerKey, newList);

    }

    /**
     * removes an entry from the model and updates LocalStorage to reflect this change.
     * @see getEntries
     * @see setEntries
     * @see writeToLS
     * 
     */
    removeEntry(){
        let workingList = this.getEntries();
        let date = new Date();
        let today = date.toDateString();

        workingList = workingList.filter(entry => entry.timestamp !== today);

        this.setEntries(workingList);
        writeToLS(this.trackerKey, workingList);

    }

     /**
     * gets the saved list of mood tracker entries from LocalStorage
     * 
     * @see readFromLS
     * @see setEntries
     */
    pullEntriesFromLS(){
        //call getFromLS function passing the key under which tracker data are stored.
        let result = readFromLS(this.trackerKey);
        //set the pulled list to entryList
        this.setEntries(result);
    }
}

/**
 * Tracker is the controller which handles the model and view related to Mood tracking functionality.
 * 
 * @class Tracker
 * @since 1.0.0
 * @access public
 */
export default class Tracker {
    /**
     * sets up the model and view instances.
     * 
     * Model comes first so that the entrylist will be populated and ready
     * to pass to the view.
     * 
     * @see TrackerModel.getEntries
     * 
     * @constructor
     */
    constructor(){
        this.model = new TrackerModel();
        //populate main view with journal entry list
        this.view = new TrackerView(this.model.getEntries());        
    }

    /**
     * calls functions to set up and display the view with necessary event listeners.
     * 
     * @see TrackerView.show
     * @see attachBtnListeners
     */
    show(){
        this.view.show();
        this.attachBtnListeners();
    }

    /**
     * refreshes the viewable history of tracker input.
     * 
     * @see TrackerView.reload
     * 
     * @param {Array} newList the new list of entries to display
     */
    reloadView(newList){
        this.view.reload(newList);
    }

    /**
     * Tells the model to add a new entry with the user's selected mood.
     * 
     * @see TrackerModel.addEntry
     * 
     * @param {(number | string)} chosenMood a number representing the mood reported by the user.
     */
    saveNewEntry(chosenMood){
        this.model.addEntry(chosenMood);
    }

    /**
     * tells the model to delete today's entry if reported.
     * 
     * @see TrackerModel.removeEntry
     */
    deleteTodayEntry(){
        this.model.removeEntry()
    }

    /**
     * sets event listeners for when the user reports their mood or wants to change their answer.
     * 
     * @see deleteTodayEntry
     * @see reloadView
     * @see TrackerModel.getEntries
     * @see show
     * @see saveNewEntry
     * 
     */
    attachBtnListeners(){
        if (document.querySelector('#trackChange')){
            let btn = document.querySelector('#trackChange');
            btn.addEventListener('click', ()=>{
                 this.deleteTodayEntry();
                 this.reloadView(this.model.getEntries());
                 
                 this.show();
            })
        }

        let btnNodes = document.querySelectorAll('.mood-btn');
        let btnArr = [...btnNodes];

        btnArr.forEach(btn => {
            btn.addEventListener('click', () => {
                this.saveNewEntry(btn.dataset.mood);

                this.show();
            })
        })
    }

}

/**
 * TrackerView handles functions for rendering HTML elements related to the mood tracker.
 * 
 * @class TrackerView
 * @since 1.0.0
 * @access private
 * @requires module:Menu
 */
class TrackerView {
    locationId = 'content-dock';
    /**
     * sets up the view to display a list of mood tracker entries.
     * 
     * @constructor
     * @param {Array} entryList the list of entries to display.
     */
    constructor(entryList){
        this.entries = entryList;
    }

    /**
     * resets the view's loaded list of mood tracker entries.
     * 
     * @param {Array} newList an array of mood tracker objects to use to reset the view
     */
    reload(newList){
        this.entries = newList;
    }

    /**
     * clears the content dock so that it can be refilled with new content.
     * 
     */
    clearContent(){
        document.getElementById(this.locationId).innerHTML = "";
    }

    /**
     * finds an entry that has been loaded into the view by timestamp.
     * 
     * @param {string} timestamp a date string used to search for an entry loaded in the view.
     * @returns {object} the mood tracker object associated with the chosen timestamp.
     */
    getEntryByTimestamp(timestamp){
        let workingList = this.entries;
        //search the entrylist for the desired item. returns the desired item.
        return workingList.find(item => item.timestamp === timestamp);
    }

    /**
     * calls necessary functions to render the view to the screen.
     * 
     * @see clearContent
     * @see getEntryByTimestamp
     * @see renderTrackerInput
     * @see renderTrackerHistory
     * @see Menu.showMenu
     * @see Menu.attachBtnListeners
     */
    show(){
        let menu = new Menu('track');

        this.clearContent(this.locationId);

        let date = new Date();
        let today = date.toDateString();
        let trackCheck = this.getEntryByTimestamp(today) ? true : false;

        document.getElementById(this.locationId).innerHTML += renderTrackerInput(trackCheck);
        document.getElementById(this.locationId).innerHTML += renderTrackerHistory(this.entries);

        menu.showMenu();
        menu.attachBtnListeners();
    }

}

/*
------------------------
HTML RENDERING FUNCTIONS
------------------------
*/

/**
 * returns HTML elements as a string for the history section of the view.
 * 
 * @param {Array} entryList a list of mood tracker objects
 * @returns {string} result which is a representation of HTML elements for mood tracker history.
 */
function renderTrackerHistory(entryList){
    let legend = ["down", "neutral", "good"];
    let result = `<div id="entryList" class="history-container">
    <p id="historyTitle">Mood History</p>
    <div class="tracker-history"><span>Rating</span><span>Mood</span><span>Date</span></div>
    `;

    entryList.forEach(entry => {
        result += `
        <div id="entry-${entry.timestamp}" class="tracker-history">
        <p class="track_rating">${entry.entry}</p><span class="track_desc">${legend[entry.entry -1]}</span><span class="track_time">${entry.timestamp}</span>
        </div>
        `
    })

    result += "</div>"

    return result;

}

/**
 * FUTURE IMPLEMENTATION
 * This function is not yet implemented.
 * @param {Array} weekHistory a list of the 7 mood tracker objects that will be displayed
 */
function renderTrackerGraph(weekHistory){
    //7 day history list is put in to output a graph over the last 7 days
}

/**
 * returns HTML elements for the user input area as a string to be rendered to the view.
 * 
 * @param {Boolean=false} completed when false, shows the mood tracker. When true, shows that a selection has been made today.
 * @returns {string} result which is a representation of HTML elements
 */
function renderTrackerInput(completed=false){
    //renders the buttons for tracking mood. If there is already an answer recorded for the day, shows a different screen with small link to change answer.
    if(completed === false){
        let result = `
        <div id="inputContainer" class="card">
        <span>How do you feel today?</span>
        <img class="mood-btn" data-mood="1" id="down" src="inspirationJournal/img/icons/down.svg">
        <img class="mood-btn" data-mood="2" id="neutral" src="inspirationJournal/img/icons/neutral.svg">
        <img class="mood-btn" data-mood="3" id="good" src="inspirationJournal/img/icons/good.svg">
        </div>
        `;

        return result;
    }

    //default functionality when completed = true
    let result = `
        <div id="inputContainer" class="card">
        <span>Thank you for reporting your mood today.</span>
        <div id="trackChange" class="btn-round">Change today's answer</div>
        </div>
        `;

        return result;

}