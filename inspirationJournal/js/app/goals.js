/**
 * @file Goals contains classes for model, view, and controller of goal setting functionality.
 * @author Alexander DK Courter
 * @version 1.0.0
 */

import Menu from '../components/menu.js';
import { writeToLS, readFromLS } from '../utilities/storageHelper.js';

/**
 * GoalModel is the LocalStorage data handler for goal setting functions.
 * 
 * GoalModel is created and handled by the Goal class controller at start of program
 * and contains functions for managing an array of goal objects that are saved to
 * browser local storage.
 * 
 * @since 1.0.0
 * @requires module:storageHelper
 * @access private
 */
class GoalModel {
    _entryList = [];
    goalKey = 'goals';

    /**
     * Getter for the currently loaded goal entry list.
     * @returns {Array} the private list of saved goals
     */
    getEntries(){return this._entryList;}
    /**
     * Setter for the currently loaded goal entry list.
     * @param {Array} newList the list that will replace the _entryList property.
     */
    setEntries(newList){this._entryList = newList;}
    /**
     * GetEntryById finds a goal in the list that has a specific ID.
     * @see getEntries
     * 
     * @param {(string|number)} id a Number or String used with the Array.prototype.find function to get a specific goal object.
     * @returns {object} an anonymous goal object from _entryList that has the ID number entered.
     */
    getEntryById(id){
        let workingList = this.getEntries();
        //search the entrylist for the desired item. returns the desired item.
        return workingList.find(item => parseInt(item.id) === parseInt(id));
        
    }

    //methods for accessing and storing LS copies of the entry list

    /**
     * Gets goal list from LocalStorage and sets it as the current list.
     * @see setEntries
     */
    pullEntriesFromLS(){
        //call getFromLS function passing the key under which journals are stored.
        let result = readFromLS(this.goalKey);
        //set the pulled list to entryList
        this.setEntries(result);
    }

    /**
     * adds a new goal to the goal list, then updates the list in LocalStorage.
     * @see writeToLS
     * @see getEntries
     * 
     * @param {String} goalTitle the name of the goal to be saved.
     */
    addEntry(goalTitle){
        //create the entry
        let today = new Date();

        let goal = {
            id: Date.now(),
            text: goalTitle,
            subtasks: [],
            timestamp: today.toDateString()
        };

        let workingList = this.getEntries();
        //save the entry to the current list
        workingList.push(goal);
        //save the new list to LS
        writeToLS(this.goalKey, workingList);
    }

    /**
     * removes a goal permanently from both the app and LocalStorage lists.
     * @see getEntries
     * 
     * @param {(string|number)} id a Number or String representing the ID of the goal to delete.
     */
    removeEntry(id){
        let workingList = this.getEntries();
        workingList = workingList.filter(entry => parseInt(entry.id) !== parseInt(id));

        this.setEntries(workingList);
        writeToLS(this.goalKey, workingList);
    }

    /**
     * finds and changes the data contained in an existing goal object.
     * @see getEntries
     * 
     * @param {object} oldGoal the original goal to be updated.
     * @param {object} newGoal the new goal that will replace the old one.
     */
    updateEntry(oldGoal, newGoal){
        let workingList = this.getEntries();
        let index = workingList.indexOf(oldGoal);
        workingList[index] = newGoal;

        this.setEntries(workingList);
        writeToLS(this.goalKey, workingList);
    }

    /**
     * Updates a subtask contained in an existing goal object.
     * @see updateEntry
     * 
     * @param {object} goal the goal that contains the subtask to be updated.
     * @param {object} task the subtask to be updated
     * @param {Boolean} markValue Boolean value that denotes if the task is complete.
     */
    updateSubtask(goal, task, markValue){
        //recreate the task, mark it true.
        let updateTask = task;
        updateTask.complete = markValue;
        //create a copy of the goal to save the updated task to.
        let updatedGoal = goal;
        //find index of the task to update, then change the value of that subtask in the list to the updated one.
        let index = updatedGoal.subtasks.indexOf(task);
        updatedGoal.subtasks[index] = updateTask;
        //update the data model
        this.updateEntry(goal, updatedGoal);
    }

    /**
     * finds a subtask within a given goal by a provided ID number.
     * @param {object} goal the goal object that contains the subtask.
     * @param {(string|number)} id Number or String representing the ID of the subtask to find.
     * @returns {object} the task related to the provided ID number.
     */
    getSubtaskById(goal, id){
        return goal.subtasks.find(task => parseInt(task.id) === id);
    }

    /**
     * permanently removes a subtask from a given goal.
     * @see updateEntry
     * 
     * @param {object} goal the goal object that contains the subtask marked for removal.
     * @param {(string|number)} taskId Number or String representing the ID number of the task to remove.
     */
    removeSubtask(goal, taskId){
        let updatedGoal = goal;
        updatedGoal.subtasks = updatedGoal.subtasks.filter(tasks => parseInt(tasks.id) !== parseInt(taskId));

        this.updateEntry(goal, updatedGoal);
    }

}

/**
 * Goal is the controller of the GoalModel and GoalView classes.
 * 
 * Goal is created and handled by the main.js controller at start of program
 * and contains functions for managing the use of the goal data model and view through
 * their respective classes.
 * 
 * @class Goal
 * 
 * @since 1.0.0
 * @requires ../utilities/storageHelper.js
 * @access public
 */
export default class Goal {
    /**
     * Creates an instance of a GoalModel and GoalView to handle data and output.
     * @constructor
     */
    constructor(){
        this.model = new GoalModel();
        if(readFromLS(this.model.goalKey)){this.model.pullEntriesFromLS();}
        
        //populate view with goal entry list
        this.view = new GoalView(this.model.getEntries());
        //need to bind this to the close button callback to access the model and other functions.
        this.boundCloseBtn = this.closeBtnCallback.bind(this);
    }

    /**
     * tells the GoalView to render HTML Elements and then sets related event listeners.
     * 
     * @see attachNewGoalListener
     * @see attachDeleteListeners
     * @see openSubtaskListeners
     */
    show(){
        this.view.setEntries(this.model.getEntries());
        this.view.show();
        this.attachNewGoalListener();
        this.attachDeleteListeners();
        this.openSubtaskListeners();
    }

    /**
     * Checks user input and sends valid new goals to be added to the model.
     * @see show
     */
    addNewGoal(){
        let goal = document.getElementById('newGoal').value;

        if(goal !== "" && goal !== null){
            this.model.addEntry(goal);
            this.show();
        } else {
            console.log('Please enter a realistic goal before submitting.');
        }
    }

    /**
     * tells the GoalModel instance to remove the specified goal, then reloads the view.
     * @see show
     * 
     * @param {(string|number)} id Number or String representing the ID number of the goal to remove.
     */
    removeGoal(id){
        //use the model to delete the goal then reload the view with updated info
        this.model.removeEntry(id);
        this.show();
    }

    /**
     * Listens for click/touch on button for a goal, the event opens the subtask list
     * 
     * 
     * gets the DOM location of buttons that open the subtask dropdown of each goal,
     * then creates an event listener that opens the subtask section when clicked/touched.
     */
    openSubtaskListeners(){
        let nodes = document.querySelectorAll('.goal_expand');
        let nodeArr = [...nodes];

        nodeArr.forEach(node => {
            node.removeEventListener('click', this.boundCloseBtn);
            node.addEventListener('click', this.boundCloseBtn);
        })
    }

    /**
     * Callback bound to Goal instance that opens/closes the subtask panel of a goal.
     * 
     * @see GoalView~closeSubtasks
     * 
     * @param {Event} event the triggered event passed from the event listener.
     */
    closeBtnCallback(event){
        let id = event.target.dataset.id;
                if(event.target.classList.contains('opened')){
                    event.target.classList.remove('opened');
                    let goal = that.model.getEntryById(id);
                    this.view.closeSubtasks(goal);
                } else {
                    event.target.classList.add('opened');
                }
                
                if(event.target.classList.contains('opened')){
                    let goal = this.model.getEntryById(id);
                    this.view.putSubtasks(goal);
                    this.attachSubtaskButtonSuite(goal);
                    this.replaceOpenListener(goal);
                }
    }

    /**
     * Resets a listener on the open/close button of a goal's subtask panel.
     * 
     * @see GoalModel.getEntryById
     * @see GoalView.closeSubtasks
     * @see GoalView.putSubtasks
     * @see attachSubtaskButtonSuite
     * 
     * @param {object} goal the goal related to the button where the listener will be replaced.
     */
    replaceOpenListener(goal){
        let node = document.querySelector(`.goal_expand[data-id="${goal.id}"]`);
        node.addEventListener('click' || 'touchend', (event)=>{
            let id = event.target.dataset.id;
            if(event.target.classList.contains('opened')){
                event.target.classList.remove('opened');
                let goal = this.model.getEntryById(id);
                this.view.closeSubtasks(goal);

            } else {
                event.target.classList.add('opened');
            }
            
            if(event.target.classList.contains('opened')){
                let goal = this.model.getEntryById(id);
                this.view.putSubtasks(goal);
                this.attachSubtaskButtonSuite(goal);
                this.replaceOpenListener(goal);
            }
        });
    }

    /**
     * This helper function resets button listeners related to the subtasks of a specific goal.
     * @see attachDeleteListeners
     * @see attachSubtaskBtnListener
     * @see setCheckboxListeners
     * @see attachSubtaskDeleteListeners
     * 
     * @param {object} goal the goal related to any of the buttons that need their listeners reset.
     */
    attachSubtaskButtonSuite(goal){
        //easily reattach all the buttons on repaint.
        this.attachDeleteListeners();
        if(document.querySelector(`#newSubtask[data-goal="${goal.id}"]`)){
            this.attachSubtaskBtnListener(goal);
            this.setCheckboxListeners(goal);
            this.attachSubtaskDeleteListeners();
        }
        
    }

    /**
     * sets an event listener for the ADD button that adds a new goal to the list.
     * 
     * @see addNewGoal
     */
    attachNewGoalListener(){
        document.querySelector('.newGoal-btn').addEventListener('click' || 'touchend', () => {
            this.addNewGoal();
        }) 
    }

    /**
     * sets a listener on all the delete goal buttons
     * 
     * @see removeGoal
     */
    attachDeleteListeners(){
        let nodes = document.querySelectorAll('.goal_delete');
        let nodeArr = [...nodes];

        nodeArr.forEach(node => {
            node.addEventListener('click' || 'touchend', (event) => {
                let id = event.target.dataset.id;
                this.removeGoal(id);
            })
        })
    }

    /**
     * sets a listener for deleting subtasks.
     * 
     * gets the ID numbers of the goal and subtask from HTML Element dataset properties,
     * then uses these to permanently remove the subtask from the goal in the model,
     * and update the view accordingly.
     * 
     * @since 1.0.0
     * 
     * @see GoalModel.removeSubtask
     * @see GoalModel.getEntryById
     * @see updateRenderedSubtasks
     * @see attachSubtaskButtonSuite
     */
    attachSubtaskDeleteListeners(){
        let nodes = document.querySelectorAll('.removeButton');
        let nodeArr = [...nodes];

        nodeArr.forEach(node => {
            node.addEventListener('click' || 'touchend', () => {
                let goalID = node.parentElement.dataset.goal;
                console.log(goalID);
                let goal = this.model.getEntryById(goalID);
                let taskID = node.dataset.subtask;
                this.model.removeSubtask(goal, taskID);
                let newGoal = this.model.getEntryById(goalID);
                console.log(newGoal);
                updateRenderedSubtasks(newGoal);
                this.attachSubtaskButtonSuite(newGoal);
            });
        })
    }


    /**
     * sets a listener for a button that adds a new subtask under a specific goal.
     * @since 1.0.0
     * 
     * @see updateRenderedSubtasks
     * @see GoalModel.updateEntry
     * @see attachSubtaskButtonSuite
     * 
     * @param {object} goal the goal object where the subtask panel is opened.
     */
    attachSubtaskBtnListener(goal){
        
        let button = document.querySelector(`button[data-goal="${goal.id}"]`);

        button.addEventListener('click' || 'touchend', ()=>{
            let input = document.querySelector(`input[data-goal="${goal.id}"]`);
            let task = {id: Date.now(), task: input.value, complete: false};

            let updatedGoal = goal;
            updatedGoal.subtasks.push(task);
            this.model.updateEntry(goal, updatedGoal);
            updateRenderedSubtasks(updatedGoal);
            this.attachSubtaskButtonSuite(updatedGoal);
        })
    }

    /**
     * Sets button listeners for subtask checkboxes that mark the task complete.
     * 
     * This function takes a goal object and iterates over its subtasks to attach click/touchend
     * event listeners to each subtask's checkbox element. a class is added to the checkbox to
     * change it from marked to unmarked and vice versa. The goal is also updated in the model
     * to reflect marking that goal as complete or incomplete.
     * 
     * @since 1.0.0
     * 
     * @see GoalModel.updateSubtask
     * @see attachSubtaskButtonSuite
     * @see GoalModel.getEntryById
     * @see updateRenderedSubtasks
     * 
     * @param {object} goal the goal object where the subtask panel is opened.
     */
    setCheckboxListeners(goal){
        goal.subtasks.forEach(task => {
            let location = document.querySelector(`.checkbox[data-subtask="${task.id}"]`);

            location.addEventListener('click' || 'touchend', ()=>{
                location.classList.toggle('marked');
                if(task.complete === false){
                    this.model.updateSubtask(goal,task,true);
                    let updatedGoal = this.model.getEntryById(goal.id);
                    updateRenderedSubtasks(updatedGoal);
                    this.attachSubtaskButtonSuite(updatedGoal);
                } else if(task.complete === true){
                    this.model.updateSubtask(goal,task,false);
                    let updatedGoal = this.model.getEntryById(goal.id);
                    updateRenderedSubtasks(updatedGoal);
                    this.attachSubtaskButtonSuite(updatedGoal);
                }
            });
        });
    }

}

/**
 * GoalView handles rendering HTML elements with output related to user goals.
 * 
 * GoalView is controlled by the Goal class and contains methods for rendering the goal list
 * on the page, opening and closing the subtask panels of each goal, and resetting the view when necessary.
 * 
 * @class GoalView
 * 
 * @since 1.0.0
 * 
 * @access private
 * @requires module:Menu
 */
class GoalView {
    locationId = 'content-dock';
    /**
     * sets the goal entries to be viewed.
     * @constructor
     * @param {Array} entryList an Array of goal objects
     */
    constructor(entryList){
        this.entries = entryList;
    }

    /**
     * sets the viewable list of goals to a new list.
     * 
     * Used for any repaint of the screen, especially when new goals are added,
     * or existing goals are deleted.
     * @param {Array} newlist an array of goal objects
     */
    setEntries(newlist){
        this.entries = newlist;
    }

    /**
     * removes items from the content dock so that it can be refreshed with updated elements.
     */
    clearContent(){
        document.getElementById(this.locationId).innerHTML = "";
    }

    /**
     * calls all applicable render functions to refresh the goal view on screen.
     * @since 1.0.0
     * 
     * @see clearContent
     * @see renderGoalList
     * @see renderGoalInput
     * @see Menu.showMenu
     * @see Menu.attachBtnListeners
     */
    show(){
        let menu = new Menu('goals');

        this.clearContent(this.locationId);

        document.getElementById(this.locationId).innerHTML += renderGoalList(this.entries);
        document.getElementById(this.locationId).innerHTML += renderGoalInput();

        menu.showMenu();
        menu.attachBtnListeners();
    }

    /**
     * adds a panel containing all of the goal's subtasks below the goal title.
     * @since 1.0.0
     * @see renderSubtasks
     * 
     * @param {object} goal the goal where the subtask panel will be rendered.
     */
    putSubtasks(goal){
        let location = document.querySelector(`div[data-goal="${goal.id}"]`);
        location.innerHTML += renderSubtasks(goal);
    }

    /**
     * Removes the subtask panel from a specific goal.
     * @since 1.0.0
     * 
     * @param {object} goal the goal object where the subtask panel will be removed.
     */
    closeSubtasks(goal){
        let location = document.querySelector(`.subtask-container[data-goal="${goal.id}"]`);
        location.remove();
    }
}

/**
 * accepts a list of goal objects to be rendered as HTML elements.
 * 
 * This creates a container for goals and adds elements for each goal necessary
 * to view them or take user input (e.g., checkboxes and delete buttons). All of
 * these are returned as a string to be added to the innerHTML of the content dock.
 * @since 1.0.0
 * 
 * @param {Array} goalList an array of goal objects.
 * @returns {string} result which is a string representation of an HTML element.
 */
function renderGoalList(goalList){
    let result = "<div class='goals-container'>"

    if(goalList === []){result += '<p>add a goal below to start planning.</p>';} else {
        goalList.forEach(goal => {
            result += `
            <div class="goal" data-goal="${goal.id}">
            <span class="goal_expand" data-id="${goal.id}">&#8250;</span>
            <span class="goal_text">${goal.text}</span>
            <span class="goal_delete" data-id="${goal.id}">x</span>
            </div>
            `;
        })
    }

    result += "</div>";

    return result;
}

/**
 * Creates an input and button for submitting new goals to be saved.
 * @since 1.0.0
 * 
 * @returns {string} result which is a string representing the new goal input elements.
 */
function renderGoalInput(){
    let result = `
    <div class='goal-input'>
    <input id="newGoal" name="newGoal" placeholder="New goal...">
    <button class="newGoal-btn">+</button>
    </div>
    `;

    return result;
}

/**
 * renders the subtask panel under a specific goal.
 * 
 * items rendered by this include a container for the subtask panel, an input
 * to add new subtasks to that specific goal, and a list of all current
 * subtasks with their checkboxes and remove buttons. Dataset properties tell the
 * controller which goal or subtask on the view are related to the data from the model.
 * @since 1.0.0
 * 
 * @param {object} goal the goal where the subtask panel will be rendered.
 * @returns {string} result which is a string representation of HTML elements
 */
function renderSubtasks(goal){
    let result = `
    <div class="subtask-container" data-goal="${goal.id}">
    <input id="addSubtask" data-goal="${goal.id}" placeholder="add subtask...">
    <button id="newSubtask" data-goal="${goal.id}">ADD</button>
    `
    goal.subtasks.forEach(task => {
        result += `
        <div class="subtask" data-goal="${goal.id}">
        <span data-subtask="${task.id}" class="checkbox${task.complete === true ? " marked":""}">${task.complete === true ? "&#10004;": ""}</span>
        <span class="taskText">${task.task}</span>
        <span class="removeButton" data-subtask="${task.id}">x</span>
        </div>
        `
    })
    
    result += `</div>`

    return result;
}


/**
 * updates the subtask panel of a specific goal when subtask related data changes.
 * 
 * used when necessary to re-render just the subtask list on update. 
 * called for CRUD functions related to subtasks. so that only the
 * subtask panel has to be repainted.
 * 
 * @since 1.0.0
 * 
 * @param {object} goal the goal where subtasks should be repainted.
 */
function updateRenderedSubtasks(goal){
    let result = `
    <input id="addSubtask" data-goal="${goal.id}" placeholder="add subtask...">
    <button id="newSubtask" data-goal="${goal.id}">ADD</button>
    `;
    goal.subtasks.forEach(task => {
        result += `
        <div class="subtask" data-goal="${goal.id}">
        <span data-subtask="${task.id}" class="checkbox${task.complete === true ? " marked":""}">${task.complete === true ? "&#10004;": ""}</span>
        <span class="taskText">${task.task}</span>
        <span data-subtask="${task.id}" class="removeButton">x</span>
        </div>
        `
    })
    
    let location = document.querySelector(`.subtask-container[data-goal="${goal.id}"]`);
    location.innerHTML = result;
}