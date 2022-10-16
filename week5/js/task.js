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
]

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
    const item = document.createElement("li");
    //create the objects within the task that can be interacted with
    item.innerHTML = `
    <div class='checkbox'></div>
    <div class='taskText'>${taskString}</div>
    <div class='removeButton'>X</div>   
    `
}

function renderTaskList(taskList) {
    taskList.forEach(task => renderSingleTask(task.name))
}