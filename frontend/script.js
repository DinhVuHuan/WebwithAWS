document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDescription = document.getElementById('task-content');
    const taskList = document.getElementById('task-list');
    const priorityFilter = document.getElementById('priority');

    if (!taskForm || !taskInput || !taskDescription || !taskList || !priorityFilter) {
        console.error("❌ Một số phần tử không được tìm thấy! Kiểm tra lại index.html.");
        return;
    }

    taskForm.addEventListener('submit', addTask);
    priorityFilter.addEventListener('change', fetchTasks);

    function fetchTasks() {
        const selectedPriority = priorityFilter.value;
        const url = selectedPriority === "All" ? "http://localhost:3000/tasks" : `http://localhost:3000/tasks?priority=${selectedPriority}`;

        fetch(url)
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.innerHTML = `
                        <div>
                            <strong>${task.name}</strong> - <b>${task.priority}</b>
                            <p>${task.description}</p>
                        </div>
                        <button class="delete-btn" data-id="${task.id}">Delete</button>
                    `;
                    taskList.appendChild(taskItem);
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        deleteTask(this.getAttribute('data-id'));
                    });
                });
            })
            .catch(error => console.error("❌ Lỗi khi lấy danh sách task:", error));
    }

    function addTask(e) {
        e.preventDefault();

        if (!taskInput.value.trim()) {
            alert("⚠️ Vui lòng nhập tên công việc!");
            return;
        }

        const newTask = {
            name: taskInput.value,
            description: taskDescription.value || '',
            priority: 'Medium'
        };

        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        })
            .then(response => {
                if (!response.ok) throw new Error("Lỗi khi thêm task!");
                return response.json();
            })
            .then(() => {
                taskInput.value = '';
                taskDescription.value = '';
                fetchTasks();
            })
            .catch(error => console.error("❌ Lỗi khi thêm task:", error));
    }

    function deleteTask(id) {
        fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) fetchTasks();
                else console.error("❌ Lỗi khi xóa task!");
            });
    }

    fetchTasks();
});
