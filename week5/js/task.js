//code to be refactored next week with modules and localStorage functionality
//for testing and building the ui
const testList = [
    {
        id: "2022",
        content: "task 1",
        completed: false
    },
    {
        id: "2022",
        content: "task 2",
        completed: false
    },
    {
        id: "2022",
        content: "task 3",
        completed: false
    }
];

const taskContainer = document.getElementById('tasks');

function createTask() {
    //stub
}

function markTask() {
    //stub
}

function deleteTask() {
    //stub
}

function renderSingleTask(taskString="") {
    console.log(`creating task "${taskString}" in (renderSingleTask)`)

    const item = document.createElement("li");
    //create the objects within the task that can be interacted with
    item.innerHTML = `
    <div class='checkbox'></div>
    <div class='taskText'>${taskString}</div>
    <div class='removeButton'>X</div>   
    `

    return item;
}

function renderTaskList(taskList) {
    console.log('using testList data to populate the ToDos list | (RenderTaskList)'); //debug

    taskList.forEach(task => {taskContainer.appendChild(renderSingleTask(task.content))})

    console.log('finished iterating. There should be 3 tasks from the testList'); //debug
    console.log('Currently working functionality: generating tasks from a list of saved objects. Need to add eventlisteners for the checkboxes and remove buttons. Need to add listener for the addTask button. Need to add function for saving task objects to localStorage'); //debug
}

//for testing.
renderTaskList(testList);