document.addEventListener('DOMContentLoaded', function() {
    const todoList = document.getElementById('todo-list');
    const inProgressList = document.getElementById('inprogress-list');
    const doneList = document.getElementById('done-list');

    // Function to fetch tasks
    function fetchTasks() {
        fetch('http://localhost:5000/tasks')
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

    // Function to display tasks on the board
    function displayTasksOnBoard(tasks) {
        tasks.forEach(task => {
            const taskCard = createTaskCard(task);
            // Append task card to appropriate column based on task status
            const columnId = task.Status.toLowerCase().replace(' ', ''); // Assumes column IDs match task statuses
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

    function createTaskCard(task) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.draggable = true;
        card.setAttribute('data-task-id', task._id); // Assign task ID to data-task-id attribute
    
        // Create card content
        const taskId = document.createElement('div');
        taskId.innerHTML = `<strong>ID:</strong> ${task._id}`;
    
        const description = document.createElement('div');
        description.classList.add('description');
        description.innerHTML = `${task.Description}`;
    
        const notes = document.createElement('div');
        notes.innerHTML = `<strong>Notes:</strong> ${task.Notes}`;
    
        const status = document.createElement('div');
        status.innerHTML = `<strong>Status:</strong> ${task.Status}`;
    
        const hidden = document.createElement('div');
        hidden.innerHTML = `<strong>Hidden:</strong> ${task.Hidden}`;
    
        // Buttons with arrows
        const leftArrowButton = document.createElement('button');
        leftArrowButton.textContent = '←';
        leftArrowButton.classList.add('arrow-button');
        leftArrowButton.addEventListener('click', function() {
            moveTask(task._id, 'left');
        });
    
        const rightArrowButton = document.createElement('button');
        rightArrowButton.textContent = '→';
        rightArrowButton.classList.add('arrow-button');
        rightArrowButton.addEventListener('click', function() {
            moveTask(task._id, 'right');
        });
    
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            deleteTask(task._id);
        });
    
        // Append content and buttons to card
        card.appendChild(description);
        card.appendChild(notes);
        card.appendChild(deleteButton);
        card.appendChild(leftArrowButton);
        card.appendChild(rightArrowButton);
        
    
        return card;
    }
    

    function moveTask(taskId, direction) {
        fetch(`http://localhost:5000/tasks/${taskId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch task data');
            }
            return response.json();
        })
        .then(taskData => {
            const currentStatus = taskData.Status;
            let newStatus;
    
            // Determine the new status based on the direction
            if (direction === 'left') {
                newStatus = getPreviousStatus(currentStatus);
            } else if (direction === 'right') {
                newStatus = getNextStatus(currentStatus);
            }
    
            // Update the task status in the database
            changeStatus(taskId, newStatus); // Call the changeStatus function
    
        })
        .catch(error => {
            console.error('Error fetching task data:', error);
        });
    }
    
    // Helper function to get the previous status
    function getPreviousStatus(currentStatus) {
        switch (currentStatus) {
            case 'To Do':
                return 'To Do'; // No change if already in the first column
            case 'In Progress':
                return 'To Do';
            case 'Done':
                return 'In Progress';
            default:
                return currentStatus;
        }
    }
    
    // Helper function to get the next status
    function getNextStatus(currentStatus) {
        switch (currentStatus) {
            case 'To Do':
                return 'In Progress';
            case 'In Progress':
                return 'Done';
            case 'Done':
                return 'Done'; // No change if already in the last column
            default:
                return currentStatus;
        }
    }
    

    // Function to add a new task to the specified list and database
    function addTaskToList(list, taskData) {
        const card = createTaskCard(taskData);
        list.appendChild(card);
        makeTaskDraggable(card); // Make the newly added card draggable

        // Add task to the database
        fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add task to database');
            }
            return response.json();
        })
        .then(data => {
            console.log('Task added to database:', data);
            location.reload();
        })
        .catch(error => {
            console.error('Error adding task to database:', error);
        });
    }

    // Add event listener to add button
    document.getElementById('add-task-btn').addEventListener('click', function() {
        const taskData = {
            Description: prompt('Enter task description:'),
            Notes: prompt('Enter task notes:'),
            Status: 'To Do', // Default status
            Hidden: false // Default hidden value
        };
        if (taskData.Description.trim() !== '') {
            addTaskToList(todoList, taskData);
        }
    });

    // Function to delete a task from the database and board
    function deleteTask(taskId) {
        fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task from database');
            }
            // Remove the task card from the board
            const taskCard = document.querySelector(`.card[data-task-id="${taskId}"]`);
            if (taskCard) {
                taskCard.remove();
            }
            return response.json();
        })
        .then(data => {
            console.log('Task deleted from database:', data);
        })
        .catch(error => {
            console.error('Error deleting task from database:', error);
        });
    }

// Function to change the status of a task in the database
function changeStatus(taskId, newStatus) {
    // Fetch the current task data
    fetch(`http://localhost:5000/tasks/${taskId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch task data');
        }
        return response.json();
    })
    .then(taskData => {
        // Modify the task data with the new status
        const updatedTaskData = {
            ...taskData,
            Status: newStatus
        };

        // Update the task status in the database
        fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTaskData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task status in database');
            }
            return response.json();
        })
        .then(data => {
            console.log('Task status updated in database:', data);
            // Move the card to the new column without modifying its content
            const card = document.querySelector(`.card[data-task-id="${taskId}"]`);
            if (card) {
                const newColumnId = newStatus.toLowerCase().replace(' ', '');
                const newColumn = document.getElementById(newColumnId);
                if (newColumn) {
                    const taskList = newColumn.querySelector('.task-list');
                    if (taskList) {
                        taskList.appendChild(card);
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error updating task status in database:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching task data:', error);
    });
}


    // Function to make a task card draggable
    function makeTaskDraggable(card) {
        card.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
        });
    }

    // Function to process recognized speech and create a task
function processSpeech(speechText) {
    try {
        // Convert the recognized speech to lowercase for case-insensitive matching
        const lowerCaseText = speechText.toLowerCase();

        // Define keywords to identify description and notes
        const descriptionKeyword = 'description';
        const notesKeyword = 'notes';

        // Find the index of keywords in the recognized text
        const descriptionIndex = lowerCaseText.indexOf(descriptionKeyword);
        const notesIndex = lowerCaseText.indexOf(notesKeyword);

        // Check if both keywords are found
        if (descriptionIndex !== -1) {
            // Extract description
            const description = speechText.substring(descriptionIndex + descriptionKeyword.length, notesIndex !== -1 ? notesIndex : speechText.length).trim();
            
            // Extract notes if available
            const notes = notesIndex !== -1 ? speechText.substring(notesIndex + notesKeyword.length).trim() : '';

            // Create task data object
            const taskData = {
                Description: description,
                Notes: notes,
                Status: 'To Do', // Default status
                Hidden: false // Default hidden value
            };

            // Add the new task to the task list (You can use your existing function to add task)
            addTaskToList(todoList, taskData);

            console.log('Task created successfully:', taskData);
        } else {
            // Handle case when one or both keywords are not found
            throw new Error('Keywords not found in the recognized text');
        }
    } catch (error) {
        console.error('Error processing speech:', error);
    }
}
// Select the microphone button
const microphoneButton = document.getElementById('voice-input-btn');

// Initialize SpeechRecognition object
const recognition = new webkitSpeechRecognition(); // For Chrome

// Set properties for recognition
recognition.continuous = true; // Keep listening until stopped
recognition.lang = 'en-US'; // Set language

// Flag to track recognition state
let isRecognizing = false;

// Event listener for clicking the microphone button to start or stop recognition
microphoneButton.addEventListener('click', () => {
    if (!isRecognizing) {
        // Start speech recognition
        recognition.start();
        isRecognizing = true;
        microphoneButton.textContent = '🎤 Listening...';
    } else {
        // Stop speech recognition
        recognition.stop();
        isRecognizing = false;
        microphoneButton.textContent = '🎤 ';
    }
});

// Event listener for when speech is recognized
recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1][0].transcript; // Get recognized text
    // Do something with the recognized text, like update a text field
    console.log('Speech recognized:', result);
    processSpeech(result);
};

// Event listener for when recognition is ended
recognition.onend = () => {
    console.log('Speech recognition ended');
    // Update button text when recognition ends
    microphoneButton.textContent = '🎤 ';
};

// Event listener for errors in recognition
recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
};

});







/*
// Inside the processSpeech function
async function processSpeech(speechText) {
    try {
        const apiKey = '30bce8595a51e466b528803918050e8e675e9d70'; 
        const apiUrl = 'https://api.nlpcloud.io/summarization/bert2';

        const requestBody = {
            text: speechText, // Use the recognized speech text
            num_sentences: 3 // Number of sentences in the summary
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `API-Key ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        };

        const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
        
        // Using CORS Anywhere proxy
        const response = await fetch(corsProxyUrl + apiUrl, requestOptions);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Access the summary from the response data
        const summary = data.summary;

        // Create a new task with the summary as description and notes
        const taskData = {
            Description: summary,
            Notes: '', // You can leave notes empty or add additional information here
            Status: 'To Do', // Default status
            Hidden: false // Default hidden value
        };

        // Add the new task to the task list (You can use your existing function to add task)
        addTaskToList(todoList, taskData);

        console.log('Task created successfully:', taskData);
    } catch (error) {
        console.error('Error processing speech:', error);
    }
}
*/

