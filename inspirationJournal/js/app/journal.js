/**
 * @file journal contains classes for model, view, and controller of journal writing functionality.
 * @author Alexander DK Courter
 * @version 1.0.0
 */

import Menu from '../components/menu.js';
import { writeToLS, readFromLS } from '../utilities/storageHelper.js';


const maxExcerptSize = 155;
//excerpt is created by cutting the entry to 155 characters and appending 3 dots.

/**
 * JournalModel handles the data manipulation and storage of journal entries.
 * 
 * @class JournalModel
 * @since 1.0.0
 * @requires module:storageHelper
 * @access private
 */
class JournalModel {
    _entryList = [];
    //ties the model to the LocalStorage key of journal
    journalKey = 'journal';

    /**
     * checks LocalStorage for saved list of journal entries. If exists, adds to Model.
     * @constructor
     */
    constructor(){
        //checks for localStorage backup of current list
        if(readFromLS(this.journalKey)){
            this.setEntries(readFromLS(this.journalKey));
        }
    }

    /**
     * Getter for the currently loaded journal entry list.
     * @returns {Array} the private list of saved journal entries
     */
    getEntries(){return this._entryList;}

    /**
     * Setter for the currently loaded journal entry list.
     * @param {Array} newList the list that will replace the _entryList property.
     */
    setEntries(newList){this._entryList = newList;}

    /**
     * adds a journal entry to the model and saves the updated model to LocalStorage.
     * 
     * @since 1.0.0
     * @see setEntries
     * @see writeToLS
     * 
     * @param {string} entryTitle the user input title of the journal entry
     * @param {string} entryBody the user input body text of the journal entry
     */
    addEntry(entryTitle, entryBody){
        let resultList = this.getEntries();
        //format date strings for the ID and the timestamp. The timestamp can be duplicated, but the ID should be unique and as granular as possible.
        const date = new Date();
        const dateString = date.toDateString();
        //if the entry is long enough to reach max excerpt size, slice the entry to excerpt size for the excerpt. Otherwise, includes full entry.
        const excerptString = entryBody.length > maxExcerptSize ? entryBody.slice(0, 155) + '...' : entryBody;

        let entry = {
            id : Date.now(),
            title: entryTitle,
            entry: entryBody,
            excerpt : excerptString,
            timestamp: dateString
        }

        resultList.push(entry);

        this.setEntries(resultList);
        //use the function from LS helpers to update the list in local storage
        writeToLS(this.journalKey, resultList);
    }

    /**
     * removes a journal entry from the model and saves the updated model to LocalStorage.
     * 
     * @since 1.0.0
     * @see setEntries
     * @see writeToLS
     * 
     * @param {(number | string)} id the id number of the entry to be removed.
     */
    removeEntry(id){
        //remove an entry from saved data and update the viewed list
        let workingList = this.getEntries();
        workingList = workingList.filter(entry => parseInt(entry.id) !== parseInt(id));

        this.setEntries(workingList);
        writeToLS(this.journalKey, workingList);
    }

    /**
     * updates a journal entry in the model and saves the updated model to LocalStorage.
     * 
     * @since 1.0.0
     * @see setEntries
     * @see writeToLS
     * 
     * @param {object} oldEntry The original entry before it was changed.
     * @param {object} newEntry The entry updated with the changed data.
     */
    updateEntry(oldEntry, newEntry){
        let workingList = this.getEntries();
        let index = workingList.indexOf(oldEntry);
        workingList[index] = newEntry;

        this.setEntries(workingList);
        writeToLS(this.journalKey, workingList);
    }

    /**
     * GetEntryById finds a journal entry in the list that has a specific ID.
     * @see getEntries
     * 
     * @param {(number | string)} id the id number of the entry to find.
     * @returns {object} the journal entry object related to the provided id number.
     */
    getEntryById(id){
        let workingList = this.getEntries();
        //search the entrylist for the desired item. returns the desired item.
        return workingList.find(item => item.id === id);
    }

    /**
     * gets the saved list of journal entries from LocalStorage
     * 
     * @since 1.0.0
     * @see readFromLS
     * @see setEntries
     */
    pullEntriesFromLS(){
        //call readFromLS function passing the key under which journals are stored.
        let cacheList = readFromLS(this.journalKey);
        //set the pulled list to entryList
        this.setEntries(cacheList);
    }
}

/**
 * The controller that handles the JournalModel and JournalView.
 * 
 * @class Journal
 * @since 1.0.0
 * @access public
 * @requires JournalModel
 * @requires JournalView
 */
export default class Journal {
    /**
     * sets up an instance of the model, regular view, and editor view for the journal.
     * @constructor
     * 
     * @see JournalModel.getEntries
     * 
     */
    constructor(){
        this.model = new JournalModel();
        //populate main view with journal entry list
        this.view = new JournalView(this.model.getEntries());
        //set up new entry button
        //tap an entry should let you view or it
        this.editor = new EditView();
        //edit entry view should have an option to delete.
    }

    /**
     * calls the methods necessary from the view to show the main journal entry page.
     * 
     * @see JournalView.setEntries
     * @see JournalView.show
     * @see EditView.setEntry
     * @see entryListeners
     */
    show(){
        //resets the view with the latest version of the entry list
        this.view.setEntries(this.model.getEntries());
        this.view.show();
        //resets the editor view to either open a new entry or accept an entry sent to it for editing.
        this.editor.setEntry(null);
        this.entryListeners();
    }

    /**
     * calls the edit view to display.
     * 
     * @see EditView.show
     */
    edit(){
        this.editor.show();
    }

    /**
     * gets user input to save as a journal entry to the model.
     * 
     * @see JournalModel.addEntry
     * 
     */
    saveNewEntry(){
        let title = document.getElementById('editorTitle').value;
        let body = document.getElementById('editorBody').value;

        this.model.addEntry(title, body);
    }

    /**
     * gets user input to update an existing journal entry in the model.
     * 
     * @see JournalModel.updateEntry
     * 
     */
    updateExistingEntry(){
        let id = document.querySelector('#edit-container').dataset.entry;
        let oldEntry = this.model.getEntryById(parseInt(id));

        let entryTitle = document.querySelector('#editorTitle').value;
        let entryBody = document.querySelector("#editorBody").value;
        let excerptString = entryBody.length > maxExcerptSize ? entryBody.slice(0, 155) + '...' : entryBody;
        let dateString = new Date().toDateString();
        
        let newEntry = {
            id : Date.now(),
            title: entryTitle,
            entry: entryBody,
            excerpt : excerptString,
            timestamp: dateString
        }

        this.model.updateEntry(oldEntry, newEntry);
    }

    /**
     * uses an existing entry object to open the editor view prepopulated with data.
     * 
     * @see EditView.setEntry
     * @see EditView.show
     * 
     * @param {object} entry the journal entry object to be opened in the editor.
     */
    openExistingEntry(entry){
        this.editor.setEntry(entry);
        this.editor.show();
    }

    /**
     * removes a journal entry opened in the editor from the model permanently.
     * 
     * @see JournalModel.removeEntry
     */
    deleteOpenedEntry(){
        let idNode = document.getElementById('edit-container');
        this.model.removeEntry(idNode.dataset.entry);
    }

    /**
     * sets listeners on the journal entry cards that open the entry on click/touchend.
     * 
     * @see JournalModel.getEntries
     * @see goToEditPage
     */
    entryListeners(){
        let workingList = this.model.getEntries();
        let entryNodes = document.querySelectorAll('.journal-entry');
        let nodeArr = [...entryNodes];

        nodeArr.forEach(node => {
            let entry = workingList.find(entry => entry.id == node.id);
            node.addEventListener('click' || 'touchend', (event) => {
                goToEditPage(event, entry);
            })
        })
    }
}

/**
 * handles the display of journal entries to the screen.
 * 
 * @class JournalView
 * @since 1.0.0
 * @access private
 * @requires module:Menu
 */
class JournalView {
    locationId = 'content-dock';
    //creates the journal view when journal option selected.

    /**
     * saves a list of journal entries that can be accessed to manipulate the view.
     * @constructor
     * 
     * @param {Array} entryList an array of journal entry objects to be displayed.
     */
    constructor(entryList){
        this.entries = entryList;
    }

    /**
     * sets the viewable list of journal entries to a new list.
     * 
     * Used for any repaint of the screen, especially when new entries are added,
     * or existing entries are deleted.
     * @param {Array} newlist an array of journal entry objects
     */
    setEntries(entryList){
        this.entries = entryList;
    }

    /**
     * removes items from the content dock so that it can be refreshed with updated elements.
     */
    clearContent(id){
        document.getElementById(id).innerHTML = "";
    }

    /**
     * calls all applicable render functions to refresh the journal view on screen.
     * @since 1.0.0
     * 
     * @see clearContent
     * @see renderJournalList
     * @see renderNewEntryButton
     * @see Menu.showMenu
     * @see Menu.attachBtnListeners
     * @see attachNewEntryListener
     * @see attachNewBtnListener
     */
    show(){
        let menu = new Menu('journal');

        //empty the container to reset
        this.clearContent(this.locationId);

        //render the list of journal entries and the new entry button.
        document.getElementById(this.locationId).innerHTML += renderJournalList(this.entries);
        document.getElementById(this.locationId).innerHTML += renderNewEntryButton();

        //show the menu and attach listeners to all buttons on page
        menu.showMenu();
        menu.attachBtnListeners();

        this.attachNewEntryListener();
    }

    /**
     * finds the new entry button and uses a function to set a listener to it
     * 
     * @see attachNewBtnListener
     */
    attachNewEntryListener(){
        let button = document.getElementById('newEntryBtn');
        attachNewBtnListener(button);
    }
}

/**
 * EditView handles rendering of an alternate journal view to create journal entries from user input.
 * 
 * @class EditView
 * @since 1.0.0
 * @access private
 * @requires module:Menu
 */
class EditView {
    locationId = 'content-dock';
    //creates the journal view when journal option selected.
    /**
     * @constructor
     * Sets up the view with an entry, or defaults empty when entry is null.
     * @param {object=null} entry the entry object to load into the editor. Defaults null for new entries.
     */
    constructor(entry=null){
        //the entry has to be set when editing an existing journal entry. If left null, a new journal entry is created.
        this.entry = entry;
    }

    /**
     * removes items from the content dock so that it can be refreshed with updated elements.
     * 
     * @param {string} id an id for the HTML element to clear. Typically used for clearing content dock.
     */
    clearContent(id){
        document.getElementById(id).innerHTML = "";
    }

    /**
     * Setter that changes the viewed entry in the editor.
     * @param {object} entry a journal entry object to set in the view.
     */
    setEntry(entry){
        this.entry = entry;
    }

    /**
     * calls necessary functions to display the editor on screen.
     * 
     * Sets up a menu specific to the editor, clears the content dock, then
     * renders the editor elements and menu to the screen.
     * 
     * @see clearContent
     * @see renderEditor
     * @see Menu.showMenu
     * @see Menu.attachBtnListeners
     */
    show(){
        let menu = new Menu(this.entry === null ? 'edit':'editExisting');

        this.clearContent(this.locationId);

        document.getElementById(this.locationId).innerHTML += renderEditor(this.entry);

        menu.showMenu();
        menu.attachBtnListeners();
    }
}

/**
 * Used to render the list of journal entries in the JournalView
 * @since 1.0.0
 * 
 * @param {Array} entryList an array of journal entry objects to render.
 * @returns {string} result which is a string representing HTML Elements containing entry data.
 */
function renderJournalList(entryList){
    let result = `<div id="entryList" class="entries-container">`;

    entryList.forEach(entry => {
        result += `
        <div id="${entry.id}" class="journal-entry">
        <p class="entry_title">${entry.title}</p><span class="entry_time">${entry.timestamp}</span>
        <div class="entry_excerpt">${entry.excerpt}</div>
        </div>
        `;
    })

    result += "</div>";

    return result;
}

/**
 * Used to render the journal entry editor on the screen.
 * @since 1.0.0
 * 
 * @param {object=null} entry the entry to be edited. defaults null for a blank editor screen.
 * @returns {string} result which is a string representing HTML Elements for the editor.
 */
function renderEditor(entry=null){
    let result = `
    <div id="edit-container" data-entry="${entry !== null ? entry.id : ""}">
    <input type="text" id="editorTitle" placeholder="Title" value="${entry !== null ? entry.title : ""}">
    <textarea id="editorBody" placeholder="Your thoughts and feelings go here...">${entry !== null ? entry.entry : ""}</textarea>
    </div>
    `;

    return result;
}

/**
 * renders a div element that will act as a button for new entries when clicked/touched
 * 
 * @returns {string} button which is a string representing an HTML element to be used for user input.
 */
function renderNewEntryButton(){
    let button = `
    <div id="newEntryBtn">NEW</div>
    `;
    return button;
}

/**
 * attaches an event listener to an element that triggers the app to change views.
 * 
 * @see goToEditPage
 * 
 * @param {HTMLElement} button the HTML element that will have the listener attached.
 */
function attachNewBtnListener(button){
    button.addEventListener('click', goToEditPage);
}

/**
 * Sends an event that triggers the main controller to change to the editor view.
 * 
 * The main controller signals the Journal controller to switch to the EditView. Defaults
 * to opening a blank editor, but if an entry object is provided, it will open the editor
 * prepopulated with data from the entry.
 * @since 1.0.0
 * 
 * @fires pageChange
 * 
 * @param {Event} event the event passed by the listener
 * @param {object=null} entry a journal entry object defaults to null to open a blank editor
 */
function goToEditPage(event, entry=null){
    let page = 'edit';
    event.target.dispatchEvent(new CustomEvent('pageChange', {bubbles: true, detail: {
        page: page,
        entry: entry
    }}));
}