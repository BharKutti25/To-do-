// script.js
const taskInput = document.getElementById('task-input');
const taskTime = document.getElementById('task-time');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage
window.onload = function () {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        addTaskToList(task.text, task.date, task.completed);
    });
};

// Add task on button click
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value;
    const taskDateTime = taskTime.value;

    if (taskText === '' || taskDateTime === '') {
        return alert('Please enter both a task and a date/time');
    }

    addTaskToList(taskText, taskDateTime);
    saveTask(taskText, taskDateTime);

    taskInput.value = '';
    taskTime.value = '';
});

// Add task to the list
function addTaskToList(text, date, completed = false) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span><strong>Task:</strong> ${text} <br> <strong>Due:</strong> ${new Date(date).toLocaleString()}</span>
        <div>
            <button onclick="completeTask(this)">Complete</button>
            <button class="edit" onclick="editTask(this)">Edit</button>
            <button class="delete" onclick="deleteTask(this)">Delete</button>
        </div>
    `;
    if (completed) {
        li.classList.add('completed');
    }
    taskList.appendChild(li);
}

// Save task to localStorage
function saveTask(text, date, completed = false) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text, date, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Edit a task
function editTask(button) {
    const taskItem = button.parentElement.parentElement;
    const taskText = prompt('Edit your task:', taskItem.querySelector('span').textContent.split(' - ')[0]);
    const taskDate = prompt('Edit the date and time (YYYY-MM-DDTHH:MM):', new Date().toISOString().slice(0, 16));

    if (taskText && taskDate) {
        taskItem.querySelector('span').innerHTML = `<strong>Task:</strong> ${taskText} <br> <strong>Due:</strong> ${new Date(taskDate).toLocaleString()}`;
        updateLocalStorage();
    }
}

// Delete a task
function deleteTask(button) {
    const taskItem = button.parentElement.parentElement;
    taskItem.remove();
    updateLocalStorage();
}

// Complete a task
function completeTask(button) {
    const taskItem = button.parentElement.parentElement;
    taskItem.classList.toggle('completed');
    updateLocalStorage();
}

// Update localStorage after edit or delete
function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(taskItem => {
        const taskText = taskItem.querySelector('span').textContent.split('Due:')[0].replace('Task: ', '').trim();
        const taskDate = taskItem.querySelector('span').textContent.split('Due:')[1].trim();
        const isCompleted = taskItem.classList.contains('completed');
        tasks.push({ text: taskText, date: taskDate, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
