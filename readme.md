Backend details

Only on Refresh or Onload, whole DOM gets rendered. <br />
Task like add, delete, toggle and edit-save do not rerender whole DOM, ONLY THE specific task-item.  <br />

UTILITY Functions on refresh or onload <br />

    * renderFromTaskArray() : totally re-render the DOM from array for refresh action 
    * removeAllTask() : to remove all the task for re-render for refresh action 
    
UTILITY Functions  <br />

    * initTaskInArray() : initialize the Task Array from localstorage  
    * renderTaskList() : create "task-item" element from the Task Array, append to "added-list" or "done-list" container  
    * updateLocalStorage() : to update the local storage  


EVENTLISTENERs <br />

    * ToggleTask() changes "UNDONE" to "DONE" and vice-versa 
    * EditTask() changes the text of the task
    * SaveItem() save changes from EDIT TASK operation 
    * DeleteTask() deletes the task 

The edit and add function handle empty string input <br />
The toggle task toggles "completed" between true and false, (done/ undone) <br />
