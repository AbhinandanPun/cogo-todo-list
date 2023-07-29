FEATURES DONE - filters, subtask, sorting, backlogs, activity log, reminder, search, 

ONGOING - Date Autocomplete and Drag and drop


Backend details

General Functions

      // **************** On Refresh of the page
      function checkLocalStorageForData()
      
      // **************** Render the Activities
      function renderActivities(activityArray)
      
      // **************** Update the activites in LOCAL STORAGE
      function  updateActivityInLocalStorage()
      
      // **************** Update the tasks in LOCAL STORAGE
      function updateTasksInLocalStorage()
      
      // **************** render all non back logged tasks
      function renderTasksFromArray(taskArray)
      
      // **************** remove inner html
      function removeAllTaskFromDOM()
      
      // **************** render each of the task
      function renderSingleTask(task)
      
      // **************** render each of the subtask
      function renderSingleSubTask(taskID, subTaskDetails)


Functions related to MAIN TASK

      // ******** This button adds new TASK into dom, taskarray and Localstorage
      const addTaskButton = document.querySelector(".add-button");
      
      // ******** This button is universal, closes the subtask entryform, subtask editform and maintask editform
      function CancelEditTask(event)
      
      // ******** This button deletes the TASK
      function deleteTask(event)
      
      // ******** This button opens a prefilled edit form for a TASK
      function editTask(event)
      
      // ******** This button toggles teh completion status of the TASK
      function toggleTask(event)
      
      // ******** This button saves if any edits are done on a task
      function saveEditTask(event)


Functions related to SUB TASK

      // ******** This button opens up a new form to add SUB TASK
      function openAddSubTaskForm(event)
      
      // ******** This button submits and add the new SUB TASK in the ROOT TASK
      function AddsubTask(event)
      
      // ******** This button opens a new form to edit the SUB TASK
      function editSubTask(event)
      
      // ******** This button saves the edited SUB TASK
      function saveEditSubTask(event)
      
      // ******** This button deletes the SUB TASK
      function deleteSubTask(event)
      
      // ******** This button toggles the completion status of the SUB TASK
      function toggleSubTask(event)

Functions related to the SORT feature

      // ******** This section handles the sort by feature
      sortBy.addEventListener('mousedown', function()
      sortBy.addEventListener('mouseup', function()
      sortDueDateNearToFar(objA, objB)
      sortDueDateFarToNear(objA, objB)
      sortPriorityLowToHigh(objA, objB)
      sortPriorityHighToLow(objA, objB)


Functions and event listeners related to BACKLOG feature

      // ******** This section handles the backlog feature with the help of expired due date
      const backLog = document.getElementById('showBackLogBtn');


Functions and event listeners related to FILTER feature

      // *********************  This seciton handles the filter feature
      function closeModal() 
      function openModal()
      filterForm.addEventListener('submit', (event))
      handleCheckBoxesForFilter(className)

Functions and event listeners related to REMINDER feature

      // *********************  This section handles the reminder feature
      function taskReminder()
      function openReminderModal()
      function closeReminderModal()
      const everyMin = setInterval(taskReminder, 60000);


Functions and event listeners related to SEARCH feature

      // *********************  This section handles the search feature
      function searchTaskArray(searchText) 
