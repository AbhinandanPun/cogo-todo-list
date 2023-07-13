const taskInput = document.querySelector(".task-input")
const addButton = document.querySelector(".button")
const taskList = document.querySelector(".added-task")
const doneTaskList = document.querySelector(".done-task")


  function addTask() {
    const taskInputText = taskInput.value;
    if(taskInputText) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");
        const taskText = document.createElement("p");
        const taskButtonContainer = document.createElement("div");
        taskButtonContainer.classList.add("task-button-container");
        const done = document.createElement("button");
        done.classList.add("task-button");
        done.textContent = "Done";
        done.addEventListener("click", doneToggleTask);
        const edit = document.createElement("button");
        edit.classList.add("task-button");
        edit.textContent = "Edit";
        edit.addEventListener("click", editTask);
        const del = document.createElement("button");
        del.classList.add("task-button");
        del.textContent = "Delete";
        del.addEventListener("click", deleteTask);

        taskText.textContent = taskInputText;
        taskContent.appendChild(taskText);

        taskButtonContainer.appendChild(done);
        taskButtonContainer.appendChild(edit);
        taskButtonContainer.appendChild(del);

        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskButtonContainer);

        taskList.appendChild(taskItem);
        taskInput.value = "";
    }
  }
  function doneToggleTask(event) {
    deleteTask(event);
    if(event.target.innerHTML == "Done") {
        event.target.innerHTML = "Undone";
        doneTaskList.appendChild(event.target.parentNode.parentNode);
    }
    else {
        event.target.innerHTML = "Done";
        taskList.appendChild(event.target.parentNode.parentNode);
    }
  }
  function editTask() {
    
  }
  function deleteTask(event) {
    const taskItem = event.target.parentNode.parentNode;
    const container = event.target.parentNode.parentNode.parentNode.classList[0]
    if(container=="added-task") {
        taskList.removeChild(taskItem);
    }
    else{
        doneTaskList.removeChild(taskItem);
    }
  }
addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function(event) {
    if(event.key == "Enter") {
        addTask();
    }
});