document.addEventListener('DOMContentLoaded', function() {
    const todoList = document.getElementById('todo-list');
    const inProgressList = document.getElementById('inprogress-list');
    const doneList = document.getElementById('done-list');
    
    // Function to fetch tasks
    function fetchTasks() {
        fetch('/tasks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        })
        .then(tasks => {
            // Process tasks and display them on the board
            displayTasksOnBoard(tasks);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
    }

    // Function to create task cards and display them on the board
    function displayTasksOnBoard(tasks) {
        tasks.forEach(task => {
            const taskCard = createTaskCard(task);
            const columnId = task.listId;
            const column = document.getElementById(columnId);
            if (column) {
                const taskList = column.querySelector('.task-list');
                if (taskList) {
                    taskList.appendChild(taskCard);
                }
            }
        });
    }

    window.addEventListener('DOMContentLoaded', fetchTasks);



    // Function to create a new task card
    function createTaskCard(taskData) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.draggable = true; // Make the card draggable
        card.setAttribute('data-task-id', taskData.id); // Set task ID as a data attribute
        updateTaskStatus(taskData); // Update task status based on its column
        card.innerHTML = `
            <div class="card-content">
                <div><strong>Description:</strong> ${taskData.description}</div>
                <div><strong>Notes:</strong> ${taskData.notes}</div>
                <div><strong>Status:</strong> ${taskData.status}</div>
                <div><strong>Hidden:</strong> <input type="checkbox" ${taskData.hidden ? 'checked' : ''}></div>
            </div>
        `;
        return card;
    }

    // Function to add a new task to the specified list
    function addTaskToList(list, taskData) {
        const card = createTaskCard(taskData);
        list.appendChild(card);
        makeTaskDraggable(card); // Make the newly added card draggable
    }

    // Function to make a task card draggable
    function makeTaskDraggable(card) {
        card.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
        });
    }

    // Function to update task status based on column
    function updateTaskStatus(taskData) {
        const columnId = taskData.listId;
        if (columnId === 'todo-list') {
            taskData.status = 'To Do';
        } else if (columnId === 'inprogress-list') {
            taskData.status = 'In Progress';
        } else if (columnId === 'done-list') {
            taskData.status = 'Done';
        }
    }

    // Function to update task hidden status
    function updateTaskHidden(taskId, isHidden) {
        const task = document.querySelector(`.card[data-task-id="${taskId}"]`);
        if (task) {
            task.style.display = isHidden ? 'none' : 'block';
        }
    }

    // Add event listener to add button
    document.getElementById('add-task-btn').addEventListener('click', function() {
        const taskData = {
            id: Date.now(), // Generate a unique ID for the task
            description: prompt('Enter task description:'),
            notes: prompt('Enter task notes:'),
            listId: 'todo-list', // Default list ID
            hidden: false // Default hidden value
        };
        if (taskData.description.trim() !== '') {
            addTaskToList(todoList, taskData);
        }
    });

    // Drag and drop event handlers for columns
    const columns = document.querySelectorAll('.column');

    columns.forEach(column => {
        column.addEventListener('dragover', function(event) {
            event.preventDefault();
        });

        column.addEventListener('drop', function(event) {
            event.preventDefault();
            const taskId = event.dataTransfer.getData('text/plain');
            const task = document.querySelector(`.card[data-task-id="${taskId}"]`);
            if (task) {
                const targetColumn = column.querySelector('.task-list');
                targetColumn.appendChild(task);
                const taskData = {
                    id: taskId,
                    listId: targetColumn.id // Update task's list ID
                };
                updateTaskStatus(taskData); // Update task status
                task.querySelector('.card-content div:nth-child(3)').textContent = `Status: ${taskData.status}`; // Update status in card
            }
        });
    });

    // Drag and drop event handlers for delete dropzone
    const deleteDropzone = document.getElementById('delete-dropzone');
    deleteDropzone.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    deleteDropzone.addEventListener('drop', function(event) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData('text/plain');
        const task = document.querySelector(`.card[data-task-id="${taskId}"]`);
        if (task) {
            task.remove();
        }
    });

    // Event listener for "Hidden" checkbox change
    document.addEventListener('change', function(event) {
        const checkbox = event.target;
        if (checkbox.type === 'checkbox' && checkbox.parentNode.querySelector('strong').textContent === 'Hidden:') {
            const taskId = checkbox.closest('.card').getAttribute('data-task-id');
            updateTaskHidden(taskId, checkbox.checked);
        }
    });

    // Event listener for "Unhide All Tasks" button
    document.getElementById('unhide-all-btn').addEventListener('click', function() {
        const hiddenTasks = document.querySelectorAll('.card[style="display: none;"]');
        hiddenTasks.forEach(task => {
            task.style.display = 'block';
        });
    });
});
