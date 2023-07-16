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
 *      initTaskMap() : initialize the Task Map from localstorage
 *      updateLocalStorage() : to update the local storage
 *      removeAllTask() : to remove all the task for re-render
 *      renderFromTaskArray() : totally re-render the DOM from array
 *      renderTaskList() : create "task-item" element, append to "added-list" or "done-list" container
*/

    function renderFromTaskArray(){
        removeAllTask();
        // RENDER each of the task OBJECT in array
        taskArray.forEach(task => {
            taskIdForAPI = Math.max(taskIdForAPI, task.id);
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
            taskItem.setAttribute("id", task.id)
            taskItem.innerHTML = `
                <div class="task-content">
                    <p>${task.title}</p>
                </div>
                <div class="task-button-container">
                    <button class="task-button" onclick="toggleTask(event)">${(task.completed ? "Undone" : "Done")}</button>
                    <button class="task-button" onclick="editTask(event)">Edit</button>
                    <button class="task-button" onclick="deleteTask(event)">Delete</button>
                </div>
            `
            // const taskContent = document.createElement("div");
            // taskContent.classList.add("task-content");
            // const taskText = document.createElement("p");
            // const taskButtonContainer = document.createElement("div");
            // taskButtonContainer.classList.add("task-button-container");
            // const done = document.createElement("button");
            // done.classList.add("task-button");
            // done.textContent = "Done";
            // done.addEventListener("click", ToggleTask);
            // const edit = document.createElement("button");
            // edit.classList.add("task-button");
            // edit.textContent = "Edit";
            // edit.addEventListener("click", editTask);
            // const del = document.createElement("button");
            // del.classList.add("task-button");
            // del.textContent = "Delete";
            // del.addEventListener("click", deleteTask);

            // // append the "content" and "buttons" to "task-item"
            // taskText.textContent = task.title;
            // taskContent.appendChild(taskText);
            // taskButtonContainer.appendChild(done);
            // taskButtonContainer.appendChild(edit);
            // taskButtonContainer.appendChild(del);
            // taskItem.appendChild(taskContent);
            // taskItem.appendChild(taskButtonContainer);

            // append to "added-task" if task is incomplete
            // append to "done-task" if task is complete
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
 * DeleteTask deletes the task
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
            const editTextbox = document.createElement('input');
            editTextbox.type = 'text';
            editTextbox.value = todoText.textContent;
    
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.addEventListener("click", saveItem);
            taskContent.replaceChild(editTextbox, todoText);
            taskContent.appendChild(saveButton);
        }
    }

    function saveItem(event) {
        taskItem = event.target.parentNode.parentNode;
        taskID = parseInt(taskItem.id);
        taskContent = taskItem.querySelector('.task-content');
        taskEditText = taskContent.querySelector('input').value;
        const task = taskArray.find(task => task.id === taskID);
        task.title = taskEditText;

        updateLocalStorage();

        const taskText = document.createElement("p");
        taskText.textContent = taskEditText;
        taskContent.innerHTML = "";
        taskContent.appendChild(taskText);

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
        addTaskInArray();
        updateLocalStorage();
        renderTaskList(taskArray[taskArray.length-1]);
        taskInput.value = ""; 
    });

// handles the "ENTER" key stroke on the input form.
    taskInput.addEventListener("keydown", function(event) {
        if(event.key == "Enter") {
            addTaskInArray();
            updateLocalStorage();
            renderTaskList(taskArray[taskArray.length-1]);
            taskInput.value = ""; 
        }
    });