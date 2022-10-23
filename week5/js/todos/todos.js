import { writeToLS, readFromLS } from './ls.js';
import {qs, onTouch, onTouchAll} from './utilities.js';

/*
 * todos.js
 * module that contains the Todos class. The Todos class handles the manipulation of todos on screen and saved to localstorage by using methods and outside helper functions.
 */

const taskContainer = document.getElementById('tasks');

//this todoList is kept outside the class to keep it private from other modules. Holds active onscreen data. Gets refreshed by localStorage when necessary or augmented to show a filtered view. When filtering, localStorage acts as a backup of original list composition.
let todoList = null;

export default class Todos {
    storageKey = "todoList";
    constructor(){
        this.parentElement = taskContainer;
        
        if (readFromLS(this.storageKey) !== null) {
            this.listTodos(this);
        }
        
        //bind addTodo to use in the onTouch listeners
        this.boundAdd = this.addTodo.bind(this);
        //bind filterHelper to use in the onTouchAll listeners
        this.boundFilter = this.filterHelper.bind(this);
        //use the bound addTodo method so that properties are in scope
        onTouch('.addTaskBtn', this.boundAdd);

        //listen for the rebuild event which is called when the list needs to be rendered and saved again due to change.
        qs('#tasks').addEventListener('remove', (e) => {
            this.removeTodo(e)
        })
        qs('#tasks').addEventListener('mark', (e) => {
            this.completeTodo(e);
        })

        qs('.filter-all').classList.add('selected'); //default

        onTouchAll('.filters', this.boundFilter);
    }


    completeTodo(event) {
        let taskList = getList();
        let id = event.detail.id;
        let key = this.storageKey;

        taskList.forEach(task => {
            if (task.id == id) {
                task.completed = true
                setList(taskList);
                writeToLS(key, JSON.stringify(taskList));
            }
        })

        this.listTodos(this);
    }

    removeTodo(event) {
        //needs to remove the selected item from the list.
        //identify task - use the ID to select it from the todoList, remove it, redraw list
        let taskList = getList();
        let id = event.detail.id;
        let key = this.storageKey;

        taskList.forEach(task => {
            if (task.id == id){
                taskList = taskList.filter(obj => obj !== task);
                setList(taskList);
                writeToLS(key, JSON.stringify(taskList));
            }
    })
        
        //redraw the list
        this.listTodos(this);

    }

    listTodos(self) {
        renderTaskList(getTodos(self.storageKey));
        setButtons();
    }

    /*
     * Add a method to the Todos class called addTodo. It should grab the input in the html where users enter the text of the task, then send that along with the key to a SaveTodo() function. Then update the display with the current list of tasks
        */
    addTodo() {
        const userInput = qs('#taskInput').value;
        const key = this.storageKey;
        //is timestamp in saveTodo?
        //send to saveTodo with storageKey
        saveTodo(userInput, key);
        //update display

        //need to bind listTodos to access here?
        renderTaskList(getTodos(key));
    }

    filterHelper(event) {
        let id = event.target.id;
        this.filterTodos(id);
    }
    /*
     *Filter the todo list by how many tasks have been completed, active (unmarked), or all.
    */
    filterTodos(filterType) {
        let key = this.storageKey;
        let taskList = [...JSON.parse(readFromLS(key))];

        qs(".selected").classList.remove('selected')

        if (filterType === 'complete') {
            qs('.filter-completed').classList.add('selected');
            if (readFromLS(key) !== null) {
                taskList.forEach(task => {
                    if (task.completed === false){
                        taskList = taskList.filter(obj => obj !== task);
                        setList(taskList);
                        this.listTodos(this);
                    }
                })
            }
        } else if (filterType === 'active') {
            qs('.filter-active').classList.add('selected');
            if (readFromLS(key) !== null) {
                taskList.forEach(task => {
                    if (task.completed === true){
                        taskList = taskList.filter(obj => obj !== task);
                        setList(taskList);
                        this.listTodos(this);
                    }
                })
            }
        } else if (filterType === 'all') {
            qs('.filter-all').classList.add('selected');
            //displays whole list
            if (readFromLS(key) !== null){
                taskList = [...JSON.parse(readFromLS(key))];
                setList(taskList);
                this.listTodos(this);
            }
        }
    }
}

//keep HTML functions private in the ToDos module and outside the exported class.
function renderSingleTask(task) {

    const item = document.createElement("li");
    //create the objects within the task that can be interacted with
    if (task.completed === true){
        item.innerHTML = `
        <div class='checkbox marked'>&#10004</div>
        <div class='taskText marked'>${task.content}</div>
        <div class='removeButton' id='${task.id}'>X</div>
        `
        return item;
    } else {
        item.innerHTML = `
        <div class='checkbox' id='${task.id}'></div>
        <div class='taskText'>${task.content}</div>
        <div class='removeButton' id='${task.id}'>X</div>   
        `
        return item;
    }
}

function renderTaskList(taskList) {
    //reset the container element contents
    taskContainer.innerHTML = "";
    //add each item from the list
    taskList.forEach(task => {taskContainer.appendChild(renderSingleTask(task))})
    //add listener to the remove buttons that trigger a remove statement.
    let completeCounter = 0
    taskList.forEach(task => {if (task.completed === true){completeCounter += 1;}})
    qs('.taskCount').innerHTML = `${taskList.length-completeCounter} tasks left`
    setButtons();
   
}

/* build a todo object, add it to the todoList, and save the new list to local storage.
@param {string} key The key under which the value is stored under in LS @param {string} task The text of the task to be saved.
*/
function saveTodo(task, key) { 
    //get the timestamp to save as id.
    const timeNow = Date.now();
    const timestamp = new Date(timeNow);

    let toDo = {
        id : timestamp,
        content : task,
        completed : false
    }
    //{ id : timestamp, content: string, completed: bool }
    //append to the todoList
    let tasks = getList();
    if (tasks === null){
        tasks = [];
        tasks.push(toDo);
    } else {
        tasks.push(toDo);
    }
    
    
    //use ls helper writeToLS to save the list
    writeToLS(key,JSON.stringify(tasks));
}

/* check the contents of todoList, a local variable containing a list of ToDos. If it is null then pull the list of todos from localstorage, update the local variable, and return it
@param {string} key The key under which the value is stored under in LS @return {array} The value as an array of objects
*/
function getTodos(key) {
    let taskList = getList();
    //check if todoList has items
    if (taskList === null) {
        if (readFromLS(key) === null) {
            return taskList;
        }
        taskList = [...JSON.parse(readFromLS(key))];
        setList(taskList);
        return taskList;
        }
        //get todoList from local storage using the key
        return taskList;
    }
    

function getList() {return todoList;}

function setList(newList) {todoList = newList;}

function setButtons() {
    const removeBtns = document.querySelectorAll('.removeButton');
    const rbtnArray = [...removeBtns];
    rbtnArray.forEach(btn => {
        //remove previous listeners
        btn.removeEventListener('touchend', removeTodo);
        btn.removeEventListener('click', removeTodo);
        //update with a new listener
        btn.addEventListener('touchend', removeTodo);
        btn.addEventListener('click', removeTodo);
    
    });

    const markButtons = document.querySelectorAll('.checkbox');
    const mbtnArray = [...markButtons];
    mbtnArray.forEach(btn => {
        btn.removeEventListener('touchend', markTodo);

        btn.addEventListener('touchend', markTodo);
        btn.removeEventListener('click', markTodo);
        btn.addEventListener('click', markTodo);
    })
}

function removeTodo(event) {
    let id = event.target.id;
    event.target.dispatchEvent(new CustomEvent('remove', {bubbles: true, detail: {id}}));

}

function markTodo(event) {
    let id = event.target.id;
    event.target.dispatchEvent(new CustomEvent('mark', {bubbles: true, detail: {id}}));
}

