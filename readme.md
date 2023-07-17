Backend details

Only on Refresh or Onload, whole DOM gets rendered. <br />
Task like add, delete, toggle and edit-save do not rerender whole DOM, ONLY THE specific task-item.  <br />

UTILITY Functions  <br />
    * initTaskInArray() : initialize the Task Map from localstorage  <br />
    * updateLocalStorage() : to update the local storage  <br />
    * removeAllTask() : to remove all the task for re-render  <br />
    * renderFromTaskArray() : totally re-render the DOM from array  <br />
    * renderTaskList() : create "task-item" element, append to "added-list" or "done-list" container  <br />


EVENTLISTENERs <br />
    * ToggleTask() changes "UNDONE" to "DONE" and vice-versa <br />
    * EditTask() changes the text of the task <br />
    * SaveItem() save changes from EDIT TASK operation <br />
    * DeleteTask() deletes the task <br />

The edit and add function handle empty string input <br />
The toggle task toggles "completed" between true and false, (done/ undone) <br />
