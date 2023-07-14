const taskInput = document.querySelector(".task-input")
const addButton = document.querySelector(".button")
const container = document.querySelector(".container")
let  addedTaskList = document.querySelector(".added-task")
let  doneTaskList = document.querySelector(".done-task")

const taskMap = new Map();
let taskIdForAPI = 10000;
let newIdForInput = 10500;

    fetch('https://jsonplaceholder.typicode.com/todos')
    .then((response) => {
        if(!response.ok) {
            throw new Error('Data not received');
        }
        return response.json();
    })
    .then(json => {
        for(i=0; i<10; i++) {
            taskMap.set(taskIdForAPI,
                {
                "id": taskIdForAPI,
                "title": json[i].title,
                "completed": json[i].completed
                }
            );
            taskIdForAPI += 1;
        }
        renderFromMap();
    })
    .catch(error => {
        console.log("Error", error.message);
    })


//  FUNCTION RenderFromMap
//  remove the child, added new empty ones and render the tasks
    function renderFromMap(){
        removeAllTask();
        // RENDER each of the task OBJECT in map

        console.log(taskMap);
        taskMap.forEach(task => {
            renderTaskList(task);
        });
    }

// FUNCTION RemoveAllTask
// to remove all the task for re-render
    function removeAllTask(){
        // remove the child "added-task", "done-task" from "container"
        container.removeChild(addedTaskList);
        container.removeChild(doneTaskList);
                
        // add the empty removed child in the DOM
        added = document.createElement("div");
        added.classList.add("added-task");
        done = document.createElement("div");
        done.classList.add("done-task");
        container.appendChild(added);
        container.appendChild(done);
        
        // reinitialize the querySelector
        addedTaskList = document.querySelector(".added-task")
        doneTaskList = document.querySelector(".done-task")
    }

// FUNCTION RenderTaskList
// create "task-item" element, append to "added" or "done" container
  function renderTaskList(task) {
    // check empty task OBJECT
    if(Object.keys(task).length !== 0) {

        // CREATE the "task-item" element
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        taskItem.setAttribute("id", task.id)
        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");
        const taskText = document.createElement("p");
        const taskButtonContainer = document.createElement("div");
        taskButtonContainer.classList.add("task-button-container");
        const done = document.createElement("button");
        done.classList.add("task-button");
        done.textContent = "Done";
        done.addEventListener("click", ToggleTask);
        const edit = document.createElement("button");
        edit.classList.add("task-button");
        edit.textContent = "Edit";
        edit.addEventListener("click", editTask);
        const del = document.createElement("button");
        del.classList.add("task-button");
        del.textContent = "Delete";
        del.addEventListener("click", deleteTask);

        // append the "content" and "buttons" to "task-item"
        taskText.textContent = task.title;
        taskContent.appendChild(taskText);

        taskButtonContainer.appendChild(done);
        taskButtonContainer.appendChild(edit);
        taskButtonContainer.appendChild(del);

        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskButtonContainer);

        // append to "added-task" if task is incomplete
        // append to "done-task" if task is complete
        if(task.completed) {
            done.textContent = "Undone";
            doneTaskList.appendChild(taskItem);
        }
        else {
            addedTaskList.appendChild(taskItem);
        }
    }
  }


//   FUNCTION ToggleTaskCompletion
//   Updates the map, re-render the specific task-element
  function ToggleTask(event) {
    const taskItem = event.target.parentNode.parentNode;
    taskObj = taskMap.get(parseInt(taskItem.id));

    // DOM manipulation
    // switching between DONE and UNDONE task without RE-RENDER
    if(taskObj.completed == false) {
        addedTaskList.removeChild(taskItem);
        event.target.innerHTML = "Undone";
        doneTaskList.appendChild(event.target.parentNode.parentNode);
    }
    else {
        doneTaskList.removeChild(taskItem);
        event.target.innerHTML = "Done";
        addedTaskList.appendChild(event.target.parentNode.parentNode);
    }

    // MAP manipulation
    // switching the "completed" to true and false;
    taskMap.set(taskObj.id,{
        "id": taskObj.id,
        "title": taskObj.title,
        "completed": !taskObj.completed
    });
  }



  function editTask() {
  }


  
// FUNCTION deleteTask
// deletes the element from MAP and RE-RENDERS the dom
  function deleteTask(event) {
    const taskItem = event.target.parentNode.parentNode;
    taskMap.delete(parseInt(taskItem.id));
    renderFromMap();
    // code to avoid RE-RENDER
    // const container = event.target.parentNode.parentNode.parentNode.classList[0];
    // if(container=="added-task") {
    //     taskList.removeChild(taskItem);
    // }
    // else{
    //     doneTaskList.removeChild(taskItem);
    // }
  }

// FUNCTION addTaskInMap()
// adds new task from input form to taskMap
function addTaskinMap() {
    const taskInputText = taskInput.value;
    taskMap.set(newIdForInput,{
        "id": newIdForInput,
        "title": taskInputText,
        "completed": false
    });
    newIdForInput += 1;
    renderFromMap();
    taskInput.value = "";
}

// EVENT LISTENER
// handles the click action on the "Add" button.
addButton.addEventListener("click", function(){
    addTaskinMap();
});


// EVENT LISTENER
// handles the "ENTER" key stroke on the input form.
taskInput.addEventListener("keydown", function(event) {
    if(event.key == "Enter") {
        addTaskinMap();
    }
});