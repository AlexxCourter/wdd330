/**
 * @file menu module contains a class for generating the navigation menu.
 * @author Alexander DK Courter
 * @version 1.0.0
 */


/**
 * Menu module defines how the menu bar will be rendered on screen.
 * 
 * @class Menu
 * @since 1.0.0
 * @access public
 * @module Menu
 */
export default class Menu {
    /**
     * sets up the menu with an id that tells what kind of buttons the menu has based on page.
     * @constructor
     * @param {string} activeId a string representing the type of menu to render.
     */
    constructor(activeId='home'){
        this.activeId = activeId;
        this.location = 'content-dock';
    }

    /**
     * setter that updates the active page id of the menu.
     * @param {string} id string representing a page type.
     */
    setActiveId(id){
        this.activeId = id;
    }

    /**
     * getter for the active id string saved to the menu.
     * @returns {string} activeId currently saved to the Menu.
     */
    getActiveId(){
        return this.activeId;
    }

    /**
     * renders the menu in the content dock.
     * 
     * @see renderMenuBar
     */
    showMenu(){
        let content = document.getElementById(this.location);
        content.innerHTML += renderMenuBar(this.getActiveId());
    }

    /**
     * attaches event listeners to the menu buttons.
     * 
     * Checks first to see if the buttons are part of the journal editor custom menu.
     * if not, sets listeners for regular menu buttons.
     * 
     * @see setButton
     */
    attachBtnListeners(){
        let editNodes = document.querySelectorAll('.edit-btn');
        if (editNodes.length > 0){
            let btnArr = [...editNodes];

            btnArr.forEach(btn => {setButton(btn);})
        } else {

            let btnNodes = document.querySelectorAll('.menu-btn');
            let btnArr = [...btnNodes];

            btnArr.forEach(btn => {
                setButton(btn);
            })
        }
    }

}

/*---------------------------

  HTML RENDERING FUNCTIONS

---------------------------*/

/**
 * renders the buttons and menu bar to be displayed.
 * 
 * @see renderMenuButtons
 * 
 * @param {string} activeId a string representing the view related to this menu.
 * @returns {string} a string representing the HTML elements of a Menu bar
 */
function renderMenuBar(activeId){
    const buttons = renderMenuButtons(activeId);

    const bar = `
    <div id="menu-bar">
    ${buttons}
    </div>
    `
    return bar;
}

/**
 * Uses the active id to decide what type of menu buttons to render, then returns them.
 * @param {string} activeId a string representing the view related to this menu.
 * @returns {string} a string representing the HTML elements for the menu buttons.
 */
function renderMenuButtons(activeId){

    //the button matching actionId is marked with an extra class
    let buttons = "";

    if(activeId === 'edit'){
        let buttonSet = [{id: 'journal', name: 'back'},{id: 'save', name: 'save'}];

        buttonSet.forEach(btn => {
            let button = `
            <div id="${btn.name}-btn" data-page="${btn.id}" class="edit-btn btn-round">${btn.name}</div>
            `;
            
            buttons += button;
        })

        return buttons;
    }

    if(activeId === 'editExisting'){
        let buttonSet = [{id: 'delete', name: 'delete'},{id: 'journal', name: 'back'},{id: 'update', name: 'update'}];

        buttonSet.forEach(btn => {
            let button = `
            <div id="${btn.name}-btn" data-page="${btn.id}" class="edit-btn btn-round">${btn.name}</div>
            `;
            
            buttons += button;
        })

        return buttons;
    }

    const buttonSet = [
        {id: 'home', img: '/inspirationJournal/img/icons/home.svg', activeImg: '/inspirationJournal/img/icons/active/home-active.svg'},
        {id: 'journal', img: '/inspirationJournal/img/icons/journal.svg', activeImg: '/inspirationJournal/img/icons/active/journal-active.svg'},
        {id: 'track', img: '/inspirationJournal/img/icons/tracker.svg', activeImg: '/inspirationJournal/img/icons/active/tracker-active.svg'},
        {id: 'goals', img: '/inspirationJournal/img/icons/goal.svg', activeImg: '/inspirationJournal/img/icons/active/goal-active.svg'}
    ];

    buttonSet.forEach(btn => {
        
        let button = `
        <div id="${btn.id}" data-page="${btn.id}" class="menu-btn ${btn.id === activeId ? "btn-active" : "btn-inactive"}">
        <img data-page="${btn.id}" src="${btn.id === activeId ? btn.activeImg : btn.img}"/>
        <span data-page="${btn.id}">${btn.id}</span>
        </div>
        `
        buttons += button;
    })

    return buttons;
}

/**
 * accepts an element to set a click/touchend listener on to change the page.
 * @see goToPage
 * 
 * @param {HTMLElement} btn the element that the event listener will be set on
 */
function setButton(btn){
    btn.addEventListener('click' || 'touchend', goToPage);
}

/**
 * triggers an event which tells the main controller to change the view.
 * 
 * @param {Event} event the event passed from the listener.
 */
function goToPage(event){
    let page = event.target.dataset.page;
    event.target.dispatchEvent(new CustomEvent('pageChange', {bubbles: true, detail: {page}}));
}