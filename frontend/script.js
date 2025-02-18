document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const priorityFilter = document.getElementById('priority');

    taskForm.addEventListener('submit', addTask);

    function fetchTasks() {
        fetch('http://localhost:3000/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.innerHTML = `
                        <span>${task.name} - <b>${task.priority}</b></span>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    `;
                    taskList.appendChild(taskItem);
                });
            });
    }

    function addTask(e) {
        e.preventDefault();

        const newTask = {
            name: taskInput.value,
            priority: 'Medium'
        };

        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
        .then(response => response.json())
        .then(() => {
            taskInput.value = '';
            fetchTasks();
        });
    }

    function deleteTask(id) {
        fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(() => fetchTasks());
    }

    priorityFilter.addEventListener('change', () => {
        fetchTasks();
    });

    fetchTasks();
});
