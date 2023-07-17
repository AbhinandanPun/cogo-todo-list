const taskInput = document.querySelector(".task-input")
const addButton = document.querySelector(".button")
const container = document.querySelector(".container")
let  addedTaskList = document.querySelector(".added-task")
let  doneTaskList = document.querySelector(".done-task")

let taskArray = [];
let taskIdForAPI = 0;

// runs onload of the body, i.e. on refresh
function refreshAction() {
    // check if localstorage is empty or does not exist
    if(localStorage.getItem("todos") && localStorage.getItem("todos").length !== 2) {
        taskArray = JSON.parse(localStorage.getItem("todos"));
        renderFromTaskArray();
    }
    else {
        fetch('https://jsonplaceholder.typicode.com/todos')
        .then((response) => {
            if(!response.ok) {
                throw new Error('Data not received');
            }
            return response.json();
        })
        .then(data => {        
            taskArray = data;
            localStorage.setItem("todos", JSON.stringify(data));
            renderFromTaskArray();
        })
        .catch(error => {
            console.log("Error", error.message);
        })
    }
}

/** 
 * UTILITY Functions
 * 
 *      initTaskInArray() : initialize the Task Map from localstorage
 *      updateLocalStorage() : to update the local storage
 *      removeAllTask() : to remove all the task for re-render
 *      renderFromTaskArray() : totally re-render the DOM from array
 *      renderTaskList() : create "task-item" element, append to "added-list" or "done-list" container
*/
    function renderFromTaskArray(){
        removeAllTask();
        // RENDER each of the task OBJECT in array
        taskArray.forEach(task => {
            taskIdForAPI = Math.max(taskIdForAPI, task.id); // get current maxID
            renderTaskList(task);
        });
    }

    function removeAllTask(){
        addedTaskList.innerHTML = "";
        doneTaskList.innerHTML = "";
    }

    function renderTaskList(task) {
        // check empty task OBJECT
        if(Object.keys(task).length !== 0) {
            // CREATE the "task-item" element
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item");
            taskItem.setAttribute("id", task.id);
            taskItem.innerHTML = `
                <div class="task-content">
                    <p>${task.title}</p>
                </div>
                <div class="task-button-container">
                    <button class="task-button" onclick="toggleTask(event)">${(task.completed ? "Undone" : "Done")}</button>
                    <button class="task-button" onclick="editTask(event)">Edit</button>
                    <button class="task-button" style="background-color:#9e2a2b" onclick="deleteTask(event)">Delete</button>
                </div>
            `;
            if(task.completed) {
                doneTaskList.appendChild(taskItem);
            }
            else {
                addedTaskList.appendChild(taskItem);
            }
        }
    }

    function addTaskInArray() {
        const taskInputText = taskInput.value;
        taskArray.push({
            "id": ++taskIdForAPI,
            "title": taskInputText,
            "completed": false
        });
    }

    function updateLocalStorage() {
        localStorage.setItem("todos", JSON.stringify(taskArray));
    }

/** 
 * EVENTLISTENERs
 * 
 * ToggleTask changes "UNDONE" to "DONE" and vice-versa
 * EditTask changes the text of the task
 * SaveItem save changes from EDIT TASK operation
 * DeleteTask deletes the task
 * 
 * The edit and add function handle empty string input
 * 
*/
    function toggleTask(event) {
        const taskItem = event.target.parentNode.parentNode;        
        const taskID = parseInt(taskItem.id);

        const task = taskArray.find(task => task.id === taskID);
        const completed = task.completed;
        task.completed = !task.completed;

        updateLocalStorage();

        // switching between DONE and UNDONE task without total DOM RE-RENDER
        if(completed == false) {
            addedTaskList.removeChild(taskItem);
            event.target.innerHTML = "Undone";
            doneTaskList.appendChild(event.target.parentNode.parentNode);
        }
        else {
            doneTaskList.removeChild(taskItem);
            event.target.innerHTML = "Done";
            addedTaskList.appendChild(event.target.parentNode.parentNode);
        }
    }

    function editTask(event) {
        taskItem = event.target.parentNode.parentNode;
        taskContent = taskItem.querySelector('.task-content');
        // to avoid multiple edit render
        if(taskContent.childElementCount < 2){
            todoText = taskContent.querySelector('p');
            taskContent.innerHTML = `
                <input type="text" value="${(todoText.textContent)}">
                <button class="task-button" style="background-color:#e09f3e;" onclick="saveItem(event)">Save</button>
            `;
        }
    }

    function saveItem(event) {
        taskItem = event.target.parentNode.parentNode;
        taskID = parseInt(taskItem.id);
        taskContent = taskItem.querySelector('.task-content');
        taskEditText = taskContent.querySelector('input').value;
        if(taskEditText!=="") {
            const task = taskArray.find(task => task.id === taskID);
            task.title = taskEditText;
    
            updateLocalStorage();
    
            const taskText = document.createElement("p");
            taskText.textContent = taskEditText;
            taskContent.innerHTML = "";
            taskContent.appendChild(taskText);
        }
    }

    function deleteTask(event) {
        const taskItem = event.target.parentNode.parentNode;
        const taskID = parseInt(taskItem.id);

        taskArray = taskArray.filter(task => task.id !== taskID);
        updateLocalStorage();

        if(taskItem.parentNode.classList[0]=="added-task") {
            addedTaskList.removeChild(taskItem);
        }
        else{
            doneTaskList.removeChild(taskItem);
        }
        //using total RE-RENDER of DOM
        //const taskItem = event.target.parentNode.parentNode;
        // taskMap.delete(parseInt(taskItem.id));
        // renderFromMap();
    }

// handles the click action on the "Add" button.
    addButton.addEventListener("click", function(){
        if(taskInput.value!=="") {
            addTaskInArray();
            updateLocalStorage();
            renderTaskList(taskArray[taskArray.length-1]);
            taskInput.value = ""; 
        }
    });

// handles the "ENTER" key stroke on the input form.
    taskInput.addEventListener("keydown", function(event) {
        if(event.key == "Enter" && taskInput.value!=="") {
            addTaskInArray();
            updateLocalStorage();
            renderTaskList(taskArray[taskArray.length-1]);
            taskInput.value = ""; 
        }
    });