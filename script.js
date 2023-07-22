const addButton = document.querySelector(".add-button");
const sortBy = document.querySelector(".sort-by");
let  unDoneTaskList = document.querySelector(".undone-task")
let  doneTaskList = document.querySelector(".done-task")
let priorityMap = new Map();
priorityMap.set("high",3);
priorityMap.set("medium",2);
priorityMap.set("low",1);
let taskArray = [];
let taskID = -1;

function refreshAction() {
    if(localStorage.getItem("todos") && localStorage.getItem("todos").length !== 2) {
        taskArray = JSON.parse(localStorage.getItem("todos"));
        renderFromTaskArray(taskArray);
    }
}

function renderFromTaskArray(taskArray){
    removeAllTask();
    taskArray.forEach(task => {
        taskID = Math.max(taskID, task.id);
        renderTaskList(task);
    });
}

function removeAllTask(){
    unDoneTaskList.innerHTML = "";
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
                    <div class="task-details">
                        <div class="task-details-title">${(task.title)}</div>
                        <div class="task-details-info task-details-tags">Tags: ${(task.tags)}</div>
                        <div class="task-details-info task-details-category">Category: ${(task.category)}</div>
                        <div class="task-details-info task-details-date">Due Date: ${(task.dueDate)}</div>
                        <div class="task-details-info task-details-priority">Priority: ${(task.priority)}</div>
                    </div>
                    <div class="task-actions">
                        <button class="action-button edit-button" onclick="editTask(event)">Edit</button>
                        <button class="action-button"  onclick="toggleTask(event)">${(task.completed ? "Undone" : "Done")}</button>
                        <button class="action-button delete-button"  onclick="deleteTask(event)">Delete</button>
                    </div>
                `;
        if(task.completed) {
            doneTaskList.appendChild(taskItem);
        }
        else {
            unDoneTaskList.appendChild(taskItem);
        }
    }
}

function updateLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(taskArray));
}

function deleteTask(event) {
    const taskItem = event.target.parentNode.parentNode;
    const taskID = parseInt(taskItem.id);
    taskArray = taskArray.filter(task => task.id !== taskID);
    updateLocalStorage();
    if(taskItem.parentNode.classList[0]=="undone-task") {
        unDoneTaskList.removeChild(taskItem);
    }
    else{
        doneTaskList.removeChild(taskItem);
    }
}

function toggleTask(event) {
    const taskItem = event.target.parentNode.parentNode;        
    const taskID = parseInt(taskItem.id);

    const task = taskArray.find(task => task.id === taskID);
    const completed = task.completed;
    task.completed = !task.completed;
    updateLocalStorage();

    // // switching between DONE and UNDONE task without total DOM RE-RENDER
    if(completed == false) {
        unDoneTaskList.removeChild(taskItem);
        event.target.innerHTML = "Undone";
        doneTaskList.appendChild(event.target.parentNode.parentNode);
    }
    else {
        doneTaskList.removeChild(taskItem);
        event.target.innerHTML = "Done";
        unDoneTaskList.appendChild(event.target.parentNode.parentNode);
    }
}

function editTask(event) {
    taskItem = event.target.parentNode.parentNode;
    taskContent = taskItem.querySelector('.task-details');
    if(taskContent.childElementCount === 5){
        todoText = taskContent.querySelector('.task-details-title');
        todoTags = taskContent.querySelector('.task-details-tags').textContent.slice(6);
        todoCategory = taskContent.querySelector('.task-details-category').textContent.slice(10);
        todoDueDate = taskContent.querySelector('.task-details-date').textContent.slice(10);
        todoPriority = taskContent.querySelector('.task-details-priority').textContent.slice(10);
        taskContent.innerHTML = `
            <input class="edit-task-title" type="text" value="${(todoText.textContent)}">
            <div style="display:flex; flex-direction:row; justify-content:space-between;">
                <div>Category:
                    <select class="edit-category">
                    <option value="Personal" ${(todoCategory==="Personal")? "selected" : "" }>Personal</option>
                    <option value="Work" ${(todoCategory=="Work")? "selected" : ""}>Work</option>
                    <option value="Shopping" ${(todoCategory=="Shopping")? "selected" : ""}>Shopping</option>
                    <option value="Health" ${(todoCategory=="Health")? "selected" : ""}>Health</option>
                    <option value="Home" ${(todoCategory=="Home")? "selected" : ""}>Home</option>
                    </select>
                </div>
                <div>Priority:
                    <select class="edit-priority">
                    <option value="high"  ${(todoPriority==="high")? "selected" : "" }>high</option>
                    <option value="medium"  ${(todoPriority==="medium")? "selected" : "" } >medium</option>
                    <option value="low"  ${(todoPriority==="low")? "selected" : "" } >low</option>
                    </select>
                </div>
                <input type="date" class="edit-due-date" value="${(todoDueDate)}">
            </div>
            <div>
                <div>Tags:</div>
                <div class="checkbox-container">
                <label><input type="checkbox" class="edit-checkbox-input" value="Home improvement"  ${(todoTags.includes("Home improvement"))? "checked" : ""}>Home improvement</label>
                <label><input type="checkbox" class="edit-checkbox-input" value="Errands"  ${(todoTags.includes("Errands"))? "checked" : ""}>Errands</label>
                <label><input type="checkbox" class="edit-checkbox-input" value="Fitness"  ${(todoTags.includes("Fitness"))? "checked" : ""}>Fitness</label>
                <label><input type="checkbox" class="edit-checkbox-input" value="Travel"  ${(todoTags.includes("Travel"))? "checked" : ""}>Travel</label>
                <label><input type="checkbox" class="edit-checkbox-input" value="Meeting"  ${(todoTags.includes("Meeting"))? "checked" : ""}>Meeting</label>
                </div>
            </div>
            <div style="display:flex; justify-content:center; ">
                <button class="task-button" style="background-color:#e09f3e; margin-left:10px; margin-right:10px;" onclick="saveItem(event)">Save</button>
                <button class="task-button" style="background-color:#e09f3e; margin-left:10px; margin-right:10px;" onclick="CancelEditItem(event)">Cancel</button>
            </div>
        `;
    }
}

function CancelEditItem(event) {
    taskItem = event.target.parentNode.parentNode;
    const task = taskArray.find(task => task.id === taskID);
            taskItem.innerHTML = `
                        <div class="task-details-title">${(task.title)}</div>
                        <div class="task-details-info task-details-tags">Tags: ${(task.tags)}</div>
                        <div class="task-details-info task-details-category">Category: ${(task.category)}</div>
                        <div class="task-details-info task-details-date">Due Date: ${(task.dueDate)}</div>
                        <div class="task-details-info task-details-priority">Priority: ${(task.priority)}</div>
                `;
}
    function saveItem(event) {
        taskItem = event.target.parentNode.parentNode.parentNode;
        taskID = parseInt(taskItem.id);
        const textAreaValue = document.querySelector(".edit-task-title").value;
        const checkboxes = document.querySelectorAll(".edit-checkbox-input");
        const selectedCheckboxes = [];
        checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            selectedCheckboxes.push(checkbox.value);
            }
        });
        const category = document.querySelector(".edit-category").value;
        const priority = document.querySelector(".edit-priority").value;
        const dueDate = document.querySelector(".edit-due-date").value;
        
        console.log(taskItem)
        if(textAreaValue!=="") {
            const task = taskArray.find(task => task.id === taskID);
            task.title = textAreaValue;
            task.tags = selectedCheckboxes;
            task.priority = priority;
            task.category = category;
            task.dueDate = dueDate;
            updateLocalStorage();
            taskItem.innerHTML = `
                    <div class="task-details">
                        <div class="task-details-title">${(task.title)}</div>
                        <div class="task-details-info task-details-tags">Tags: ${(task.tags)}</div>
                        <div class="task-details-info task-details-category">Category: ${(task.category)}</div>
                        <div class="task-details-info task-details-date">Due Date: ${(task.dueDate)}</div>
                        <div class="task-details-info task-details-priority">Priority: ${(task.priority)}</div>
                    </div>
                    <div class="task-actions">
                        <button class="action-button edit-button" onclick="editTask(event)">Edit</button>
                        <button class="action-button"  onclick="toggleTask(event)">${(task.completed ? "Undone" : "Done")}</button>
                        <button class="action-button delete-button"  onclick="deleteTask(event)">Delete</button>
                    </div>
                `;
        }
    }

addButton.addEventListener("click", function(event) {
    event.preventDefault(); 
    const textAreaValue = document.querySelector(".task-title");
    const checkboxes = document.querySelectorAll(".checkbox-input");
    const selectedCheckboxes = [];
    checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
        selectedCheckboxes.push(checkbox.value);
        }
    });
    const category = document.querySelector(".category").value;
    const priority = document.querySelector(".priority").value;
    const dueDate = document.querySelector(".due-date").value;
    if(textAreaValue.value!=="") {
        taskArray.push({
            "id": ++taskID,
            "title": textAreaValue.value,
            "completed": false,
            "tags": selectedCheckboxes,
            "category": category,
            "priority": priority,
            "dueDate": dueDate
        });
        updateLocalStorage();
        renderTaskList(taskArray[taskArray.length-1]);
        textAreaValue.value = ""; 
    }
});

// functionality to select options if specific option is clicked
// not when the select element is clicked, which happens with "click" event
let sortClicked = false;
sortBy.addEventListener('mousedown', function() {
    sortClicked = true;
});
sortBy.addEventListener('mouseup', function() {
  if (!sortClicked) {
    const selectedValue = sortBy.value;
    let tempArray = taskArray;
    switch (selectedValue) {
        // I have used opposite functions like sortDueDateFarToNear() to sort DueDate Near To Far
        // It is done because the flex-direction is column-reverse for UnDoneTaskList and DoneTaskList
        // It is column-reverse to display the recently added task on top of the container
        case "DueDateNear":
            tempArray.sort(sortDueDateFarToNear);
            renderFromTaskArray(tempArray);
          break;
        case "DueDateFar":
            tempArray.sort(sortDueDateNearToFar);
            renderFromTaskArray(tempArray);
          break;
        case "PriorityLow":
            tempArray.sort(sortPriorityHighToLow);
            renderFromTaskArray(tempArray);
          break;
        case "PriorityHigh":
            tempArray.sort(sortPriorityLowToHigh);
            renderFromTaskArray(tempArray);
          break;
        default:
            console.log("will never get here")
      }
  }
  sortClicked = true;
});
sortBy.addEventListener('click', function() {
    sortClicked = false;
});
function sortDueDateNearToFar(objA, objB){
    const date1 = new Date(objA.dueDate);
    const date2 = new Date(objB.dueDate);
    return date1 - date2;
}
function sortDueDateFarToNear(objA, objB){
    const date1 = new Date(objA.dueDate);
    const date2 = new Date(objB.dueDate);
    return date2 - date1;
}
function sortPriorityLowToHigh(objA, objB){
    const priority1 = priorityMap.get(objA.priority);
    const priority2 = priorityMap.get(objB.priority);
    return priority1 - priority2;
}
function sortPriorityHighToLow(objA, objB){
    const priority1 = priorityMap.get(objA.priority);
    const priority2 = priorityMap.get(objB.priority);
    return priority2 - priority1;
}

// let fliterClicked = false;
// sortBy.addEventListener('mousedown', function() {
//     fliterClicked = true;
// });
// sortBy.addEventListener('mouseup', function() {
//   if (!fliterClicked) {
//     const selectedValue = sortBy.value;
//     console.log('Option clicked:', selectedValue);
//   }
//   fliterClicked = true;
// });
// sortBy.addEventListener('click', function() {
//     fliterClicked = false;
// });
