let  unDoneTaskList = document.querySelector(".undone-task") // where incomplete task are
let  doneTaskList = document.querySelector(".done-task") // where complete task are

let priorityMap = new Map(); // priority ENUM
priorityMap.set("high",3);
priorityMap.set("medium",2);
priorityMap.set("low",1);

let taskArray = []; 
let activityArray = []; // all the activities
let taskID = -1;

let edit = true; // to allow only one edit operation anywhere in the list

// **************** On Refresh of the page
function checkLocalStorageForData() {
    if(localStorage.getItem("todos") && localStorage.getItem("todos").length !== 2) { // localstorage when all task deleted ==> []
        taskArray = JSON.parse(localStorage.getItem("todos"));
        renderTasksFromArray(taskArray);
    }
    if(localStorage.getItem("activity") && localStorage.getItem("activity").length !== 2) {
        activityArray = JSON.parse(localStorage.getItem("activity"));
        renderActivities(activityArray);
    }
}

// **************** Render the Activities
function renderActivities(activityArray) {
    const activityBoard = document.querySelector(".activity-board");
    let i = 1;
    activityArray.forEach(activity => {
        const activityEntry = document.createElement("div");
        activityEntry.innerHTML = `<p>${(i)} ------ ${(activity)}</p>`;
        activityBoard.appendChild(activityEntry);
        i++;
    });
}

// **************** Update the activites in LOCAL STORAGE
function  updateActivityInLocalStorage() {
    localStorage.setItem("activity", JSON.stringify(activityArray));
}

// **************** Update the tasks in LOCAL STORAGE
function updateTasksInLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(taskArray));
}

// **************** render all non back logged tasks
function renderTasksFromArray(taskArray){
    removeAllTaskFromDOM(); // remove inner html
    taskArray.forEach(task => {
        taskID = Math.max(taskID, task.id);
        let taskDueDate = new Date(task.dueDate);
        let currentDate = new Date();
        if(currentDate<=taskDueDate) renderSingleTask(task);
    });
}

// **************** remove inner html
function removeAllTaskFromDOM(){
    unDoneTaskList.innerHTML = "";
    doneTaskList.innerHTML = "";
}

// **************** render each of the task
function renderSingleTask(task) {
    if(Object.keys(task).length !== 0) { // should be non empty
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
                        <div class="task-details-info task-details-reminder">Reminder: ${(task.reminder)}</div>
                    </div>
                    <div class="task-actions">
                        <button class="action-button edit-button" onclick="editTask(event)">Edit</button>
                        <button class="action-button"  onclick="toggleTask(event)">${(task.completed ? "Undone" : "Done")}</button>
                        <button class="action-button delete-button"  onclick="deleteTask(event)">Delete</button>
                    </div>
                    <button class="add-subtask-button" onclick="openAddSubTaskForm(event)">Add Sub Task</button>
                    <div class="undone-sub-task-list"></div>
                    <div class="done-sub-task-list"></div>
                `;
        // place wrt completion status
        if(task.completed)  doneTaskList.appendChild(taskItem);
        else    unDoneTaskList.appendChild(taskItem);

        if(Object.keys(task.subtask).length!==0){ // for subtask
            task.subtask.forEach(st => {
                renderSingleSubTask(task.id, st);
            });
        }
    }
}

// **************** render each of the subtask
function renderSingleSubTask(taskID, subTaskDetails) {
    taskItem = document.getElementById(taskID);
    const subtask = document.createElement("div");
    subtask.classList.add("sub-task-item");
    subtask.setAttribute("id", subTaskDetails.subTaskID);

    subtask.innerHTML = `
                <div class="task-details">
                    <div class="task-details-title">${(subTaskDetails.subTaskTitle)}</div>
                    <div class="task-details-info task-details-priority">Priority: ${(subTaskDetails.subTaskPriority)}</div>
                </div>
                <div class="task-actions">
                    <button onclick="editSubTask(event)">Edit</button>
                    <button onclick="toggleSubTask(event)">${(subTaskDetails.completed ? "Undone" : "Done")}</button>
                    <button onclick="deleteSubTask(event)">Delete</button>
                </div>
            `;

    const undonesubtasktasklist = taskItem.querySelector(".undone-sub-task-list");
    const donesubtasktasklist = taskItem.querySelector(".done-sub-task-list");
    if(subTaskDetails.completed)    donesubtasktasklist.appendChild(subtask);
    else    undonesubtasktasklist.appendChild(subtask);
}


// ******** This button adds new TASK into dom, taskarray and Localstorage
const addTaskButton = document.querySelector(".add-button");
addTaskButton.addEventListener("click", function(event) {
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
    const reminder = document.querySelector(".reminder").value;
    let dueDate = document.querySelector(".due-date").value;
    if(dueDate=="") dueDate = "2023-12-31" // hardcoded till end of 2023, if duedate not given

    if(textAreaValue.value!=="") {
        taskArray.push({
            "id": ++taskID,
            "title": textAreaValue.value,
            "completed": false,
            "tags": selectedCheckboxes,
            "category": category,
            "priority": priority,
            "dueDate": dueDate,
            "reminder": reminder,
            "subtask": [],
        });

        const currentDate = (new Date()).toString(); // message for activity
        activityArray.push("New Task Added on " + currentDate + " <br> " +
                            "with title: " + textAreaValue.value + " <br> " +
                            "with due date: " + dueDate + " <br> " + 
                            "and priority: " + priority + " <br> ");
        updateActivityInLocalStorage();

        updateTasksInLocalStorage();
        renderTasksFromArray(taskArray)
        textAreaValue.value = "";
    }
});

// ******** This button deletes the TASK
function deleteTask(event) {
    const taskItem = event.target.parentNode.parentNode;   // to get the id of the TASK  
    const taskID = parseInt(taskItem.id);

    const currentDate = (new Date()).toString(); // message for the activity
    task = taskArray.find(task => task.id === taskID);
    activityArray.push("Main Task with title " + task.title + " deleted on " + currentDate + " <br> ");
    updateActivityInLocalStorage();

    taskArray = taskArray.filter(task => task.id !== taskID);
    updateTasksInLocalStorage();
    if(taskItem.parentNode.classList[0]=="undone-task") unDoneTaskList.removeChild(taskItem);
    else    doneTaskList.removeChild(taskItem);
}

// ******** This button toggles teh completion status of the TASK
function toggleTask(event) {
    const taskItem = event.target.parentNode.parentNode;  // to get the id of the TASK      
    const taskID = parseInt(taskItem.id);

    const task = taskArray.find(task => task.id === taskID);
    const completed = task.completed;
    task.completed = !task.completed;
    updateTasksInLocalStorage();

    let status = "";
    if(completed == false) {
        status = " completed";
        unDoneTaskList.removeChild(taskItem);
        event.target.innerHTML = "Undone";
        doneTaskList.appendChild(event.target.parentNode.parentNode);
    }
    else {
        status = " toggled from complete to incomplete";
        doneTaskList.removeChild(taskItem);
        event.target.innerHTML = "Done";
        unDoneTaskList.appendChild(event.target.parentNode.parentNode);
    }

    const currentDate = (new Date()).toString(); // message for the activity
    activityArray.push("Main Task with title " + task.title + status + " on " + currentDate + " <br> ");
    updateActivityInLocalStorage();
}

// ******** This button opens a prefilled edit form for a TASK
function editTask(event) {
    taskItem = event.target.parentNode.parentNode;
    taskContent = taskItem.querySelector('.task-details');
    if(edit){
        edit = !edit;
        todoText = taskContent.querySelector('.task-details-title');
        todoTags = taskContent.querySelector('.task-details-tags').textContent.slice(6);
        todoCategory = taskContent.querySelector('.task-details-category').textContent.slice(10);
        todoDueDate = taskContent.querySelector('.task-details-date').textContent.slice(10);
        todoPriority = taskContent.querySelector('.task-details-priority').textContent.slice(10);
        todoReminder = taskContent.querySelector('.task-details-reminder').textContent.slice(10);
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
                <div>Reminder:
                    <select class="edit-reminder">
                    <option value="daily" ${(todoReminder==="daily")? "selected" : "" }>once a day</option>
                    <option value="hourly" ${(todoReminder==="hourly")? "selected" : "" }>once an hour</option>
                    <option value="byminute" ${(todoReminder==="byminute")? "selected" : "" }>once every min</option>
                    </select>
                </div>
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
            <input type="date" class="edit-due-date" value="${(todoDueDate)}">
            <div style="display:flex; justify-content:center; ">
                <button class="task-button" style="background-color:#e09f3e; margin-left:10px; margin-right:10px;" onclick="saveEditTask(event)">Save</button>
                <button class="task-button" style="background-color:#e09f3e; margin-left:10px; margin-right:10px;" onclick="CancelEditTask(event)">Cancel</button>
            </div>
        `;
    
        const currentDate = (new Date()).toString(); // message for the activity
        activityArray.push("Main Task Edit Form Activated on : " + currentDate + " <br> " +
                                        "with title: " + todoText.textContent + " <br> " +
                                        "with due date: " + todoDueDate + " <br> " + 
                                        "and priority: " + todoPriority + " <br> ");
        updateActivityInLocalStorage();
    }
}

// ******** This button is universal, closes the subtask entryform, subtask editform and maintask editform
function CancelEditTask(event) {
    renderTasksFromArray(taskArray);

    const currentDate = (new Date()).toString(); // message for activity
    activityArray.push("Task Edit or Sub task Addition Cancelled on " + currentDate + " <br> ");
    updateActivityInLocalStorage();

    edit = !edit;
}

// ******** This button saves if any edits are done on a task
function saveEditTask(event) {
    taskItem = event.target.parentNode.parentNode.parentNode; // to get the task id
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
    const reminder = document.querySelector(".edit-reminder").value;
    const dueDate = document.querySelector(".edit-due-date").value;

    if(textAreaValue!=="") {
        const task = taskArray.find(task => task.id === taskID);
        task.title = textAreaValue;
        task.tags = selectedCheckboxes;
        task.priority = priority;
        task.category = category;
        task.dueDate = dueDate;
        task.reminder = reminder;
        updateTasksInLocalStorage();
        renderTasksFromArray(taskArray);

        const currentDate = (new Date()).toString();
        activityArray.push("Main Task Edited on " + currentDate + " <br> " +
                            "title changed now " + textAreaValue + " <br> " +
                            "due date change now " + dueDate + " <br> " + 
                            "priority change now " + priority + " <br> ");
        updateActivityInLocalStorage();
    }
    edit = !edit;
}

// ******** This button opens up a new form to add SUB TASK
function openAddSubTaskForm(event) {
    if(edit) {
        const taskItem = event.target.parentNode; // to get the ROOT TASK ID
        const taskID = parseInt(taskItem.id);
        const task = taskArray.find(task => task.id === taskID);
        const subTaskEntryForm = document.createElement("div");
        subTaskEntryForm.innerHTML = `
                                    <input class="edit-task-title" type="text">
                                    <div style="display:flex; flex-direction:row; justify-content:space-between;">
                                        <div>Priority:
                                            <select class="edit-priority">
                                                <option value="high" >high</option>
                                                <option value="medium" >medium</option>
                                                <option value="low">low</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style="display:flex; justify-content:center; ">
                                        <button class="task-button" style="background-color:#e09f3e; margin-left:10px; margin-right:10px;" onclick="AddsubTask(event)">Save</button>
                                        <button class="task-button" style="background-color:#e09f3e; margin-left:10px; margin-right:10px;" onclick="CancelEditTask(event)">Cancel</button>
                                    </div>`;
        taskItem.appendChild(subTaskEntryForm);

        const currentDate = (new Date()).toString(); // for activity
        activityArray.push("Sub Task was tried to be added under " + task.title + " on " + currentDate + " <br> ");
        updateActivityInLocalStorage();
        edit = !edit;
    }
}

// ******** This button submits and add the new SUB TASK in the ROOT TASK
function AddsubTask(event) {
    taskItem = event.target.parentNode.parentNode.parentNode; // to get the ROOT TASK ID, I can make it nested i know
    taskID = parseInt(taskItem.id);
    const textAreaValue = document.querySelector(".edit-task-title").value;
    const priority = document.querySelector(".edit-priority").value;

    if(textAreaValue!=="") {
        const task = taskArray.find(task => task.id === taskID);
        let subTaskID = task.subtask.length; // new ID for the new SUB TASK
        subtaskDetails = {
            "subTaskID": subTaskID,
            "subTaskTitle": textAreaValue,
            "subTaskPriority": priority,
            "completed": false
        }
        task.subtask[subTaskID]  = subtaskDetails;
        updateTasksInLocalStorage();
        renderTasksFromArray(taskArray);

        const currentDate = (new Date()).toString(); // for activity
        activityArray.push("Sub Task with title " + textAreaValue + "was added under " + task.title + " on " + currentDate + " <br> ");
        updateActivityInLocalStorage();
    }

    edit = !edit;
}

// ******** This button opens a new form to edit the SUB TASK
function editSubTask(event) {
    taskItem = event.target.parentNode.parentNode;
    taskContent = taskItem.querySelector('.task-details');
    if(edit){
        edit = !edit;
        todoText = taskContent.querySelector('.task-details-title');
        todoPriority = taskContent.querySelector('.task-details-priority').textContent.slice(10);

        taskContent.innerHTML = `
            <input class="edit-task-title" type="text" value="${(todoText.textContent)}">
            <div style="display:flex; flex-direction:row; justify-content:space-between;">
                <div>Priority:
                    <select class="edit-priority">
                    <option value="high"  ${(todoPriority==="high")? "selected" : "" }>high</option>
                    <option value="medium"  ${(todoPriority==="medium")? "selected" : "" } >medium</option>
                    <option value="low"  ${(todoPriority==="low")? "selected" : "" } >low</option>
                    </select>
                </div>
            </div>
            <div style="display:flex; justify-content:center; ">
                <button class="task-button" style="background-color:#e09f3e; margin-left:10px; margin-right:10px;" onclick="saveEditSubTask(event)">Save</button>
                <button class="task-button" style="background-color:#e09f3e; margin-left:10px; margin-right:10px;" onclick="CancelEditTask(event)">Cancel</button>
            </div>
        `;

        const currentDate = (new Date()).toString(); // for acitivity
        activityArray.push("Sub Task with title " + todoText.textContent + " under was open to edit on " + currentDate + " <br> ");
        updateActivityInLocalStorage();
    }
}

// ******** This button saves the edited SUB TASK
function saveEditSubTask(event) {
    taskItem = event.target.parentNode.parentNode.parentNode.parentNode.parentNode; // to get the ROOT TASK ID
    taskID = parseInt(taskItem.id);
    const textAreaValue = document.querySelector(".edit-task-title").value;
    const priority = document.querySelector(".edit-priority").value;
    
    if(textAreaValue!=="") {
        const task = taskArray.find(task => task.id === taskID);
        const subTaskItem = event.target.parentNode.parentNode.parentNode;
        const subTaskID = parseInt(subTaskItem.id);
        let subtask = task.subtask.find(task => task.subTaskID === subTaskID);
        subtask.subTaskTitle = textAreaValue;
        subtask.subTaskPriority = priority;
        updateTasksInLocalStorage();
        renderTasksFromArray(taskArray);
        
        const currentDate = (new Date()).toString(); // for activity
        activityArray.push("Sub Task under " + task.title + " was edited on " + currentDate + " <br> " +
                            "changed to " + subtask.subTaskTitle);
        updateActivityInLocalStorage();
    }
    edit = !edit;
}

// ******** This button deletes the SUB TASK
function deleteSubTask(event) {
    const taskItem = event.target.parentNode.parentNode.parentNode.parentNode;  // to get the ROOT TASK ID    
    const taskID = parseInt(taskItem.id);
    let task = taskArray.find(task => task.id === taskID);

    const subTaskItem = event.target.parentNode.parentNode;  // to get the SUB TASK ID 
    const subTaskID = parseInt(subTaskItem.id);
    let subtask = task.subtask.find(task => task.subTaskID === subTaskID);

    const currentDate = (new Date()).toString(); // for activity
    activityArray.push("Sub Task with title " + subtask.subTaskTitle + " under " + task.title + " was deleted on " + currentDate + " <br> ");
    updateActivityInLocalStorage();

    task.subtask = task.subtask.filter(task => task.subTaskID !== subTaskID);
    updateTasksInLocalStorage();
    subTaskItem.remove();
}

// ******** This button toggles the completion status of the SUB TASK
function toggleSubTask(event) {
    const taskItem = event.target.parentNode.parentNode.parentNode.parentNode;   // to get the ROOT TASK ID          
    const taskID = parseInt(taskItem.id);
    let task = taskArray.find(task => task.id === taskID);

    const subTaskItem = event.target.parentNode.parentNode; // to get the SUB TASK ID 
    const subTaskID = parseInt(subTaskItem.id);
    let subtask = task.subtask.find(task => task.subTaskID === subTaskID);

    const completed = subtask.completed;
    subtask.completed = !subtask.completed;
    const undonesubtasktasklist = taskItem.querySelector(".undone-sub-task-list");
    const donesubtasktasklist = taskItem.querySelector(".done-sub-task-list");
    updateTasksInLocalStorage();

    let status = "";
    if(completed == false) {
        status = " completed";
        undonesubtasktasklist.removeChild(subTaskItem);
        event.target.innerHTML = "Undone";
        donesubtasktasklist.appendChild(subTaskItem);
    }
    else {
        status = " toggled from complete to incomplete";
        donesubtasktasklist.removeChild(subTaskItem);
        event.target.innerHTML = "Done";
        undonesubtasktasklist.appendChild(subTaskItem);
    }
    const currentDate = (new Date()).toString(); // for activity
    activityArray.push("Sub Task with title " + subtask.subTaskTitle + " under " + task.title + status + " on " + currentDate + " <br> ");
    updateActivityInLocalStorage();
}

// ******** This seciton handles the sort by feature
// functionality to acitvate only when specific option is clicked
// not when the select element is clicked, which happens with "click" event
const sortBy = document.querySelector(".sort-by");
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
            break;
        case "DueDateFar":
                tempArray.sort(sortDueDateNearToFar);
            break;
        case "PriorityLow":
                tempArray.sort(sortPriorityHighToLow);
            break;
        case "PriorityHigh":
                tempArray.sort(sortPriorityLowToHigh);
            break;
        default:
            console.log("will never get here")
        }
        renderTasksFromArray(tempArray);
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


// ******** This seciton handles the backlog feature with help of expired due date
const backLog = document.getElementById('showBackLogBtn');
backLog.addEventListener('click', function(event) {
    removeAllTaskFromDOM();
    taskArray.forEach(task => {
        taskID = Math.max(taskID, task.id);
        let taskDueDate = new Date(task.dueDate);
        let currentDate = new Date();
        if(currentDate>taskDueDate) renderSingleTask(task);
    });
});


// *********************  This seciton handles the filter feature
const modal = document.getElementById('filter-modal');
const openModalBtn = document.getElementById('openFilterModalBtn');
const closeBtn = modal.querySelector('.close');
openModalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

function openModal() {
    modal.style.display = 'block';
}
function closeModal() {
    modal.style.display = 'none';
}
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

const filterForm = document.getElementById('filter-form');
filterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedTags = handleCheckBoxesForFilter(".checkbox-input-tags");
    const selectedPriorities = handleCheckBoxesForFilter(".checkbox-input-priority");
    const selectedCategories = handleCheckBoxesForFilter(".checkbox-input-category");
    const fromDate = document.querySelector(".from-date").value
    const toDate = document.querySelector(".to-date").value;

    let tempArray = taskArray.filter((task) => {
        // if any one is false dont select the task to be displayed
        // it is done for combining the filters
        let a = b = c = d = true; 
        taskTags = task.tags;
        taskCategory = task.category;
        taskPriority = task.priority;
        taskDate = new Date(task.dueDate);
        
        if((toDate!="" && fromDate!="" && (taskDate<new Date(fromDate) || taskDate>new Date(toDate)))
            || (toDate!="" && taskDate>new Date(toDate))
            || (fromDate!="" && taskDate<new Date(fromDate))){
                a = false;
        }
        countTags = 0;
        selectedTags.forEach(element => {
            if(taskTags.includes(element)) {
                countTags++;
            }
        });
        if(countTags!==selectedTags.length) b=false;
        if(selectedCategories.length && !selectedCategories.includes(taskCategory)) c = false;
        if(selectedPriorities.length && !selectedPriorities.includes(taskPriority)) d = false;
            
        return (a && b && c && d); 
    });
    renderTasksFromArray(tempArray);  // temporarily render
    closeModal();
});
function handleCheckBoxesForFilter(className) {
    let checkboxes = document.querySelectorAll(className);
    let selected = [];
    checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
        selected.push(checkbox.value);
        }
    });
    return selected;
}


// *********************  This section handles the reminder feature

const reminderModal = document.getElementById('reminder-modal');
function openReminderModal() {
    reminderModal.style.display = 'block';
}  
function closeReminderModal() {
    reminderModal.style.display = 'none';
}
window.addEventListener('click', (event) => {
    if (event.target === reminderModal) {
        closeReminderModal();
    }
});

const reminderTask = document.querySelector('.task-to-reminded');
function taskReminder() {    
    openReminderModal();
    reminderTask.innerHTML = `
                            <span class="close"></span>
                            <h2> REMINDER EVERY 1 MINUTE </h2>
                            <h5> do not want to disturb every sec</h5>
                            <h5 style="color:red">click anywhere other than modal to close</h5>`;
    taskArray.forEach(task => {
        if(task.reminder==="byminute"){
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
                            <div class="task-details-info task-details-reminder">Reminder: ${(task.reminder)}</div>
                        </div>` ;
            reminderTask.appendChild(taskItem);
        }
    });
}
const everyMin = setInterval(taskReminder, 600000);



const searchTextInput = document.getElementById('search-text');
function handleInputEvent(event) {
    const typedText = event.target.value;
    let tempTaskArray = searchTaskArray(typedText);
    console.log(tempTaskArray)
    renderTasksFromArray(tempTaskArray);
  }
  
  // Add the event listener to the text input
searchTextInput.addEventListener('input', handleInputEvent);

function searchTaskArray(searchText) {
    searchText = searchText.toLowerCase();
    console.log(searchText)
    let tempArray = taskArray.filter((task) => {
        console.log(task.title.toLowerCase())
        if(task.title.toLowerCase().includes(searchText)) return true;
        
        let subtask = task.subtask;
        let matchingSubTask = subtask.filter((subTask) => {
            let mainString = subTask.subTaskTitle.toLowerCase();
            if(mainString.includes(searchText))
                return true;
        });
        if(matchingSubTask.length) return true;

        let countTags = 0;
        task.tags.forEach(element => {
            let mainString = element.toLowerCase();
            if(mainString.includes(searchText)) countTags++;
        });
        if(countTags) return true;
    });
    return tempArray;
}

const resetSearchButton = document.querySelector(".search-button");
resetSearchButton.addEventListener("click", function(event) {
    renderTasksFromArray(taskArray);
});