const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

let tasks = [
    { id: 1, name: "Task 1", description: "Description 1", priority: "High" },
    { id: 2, name: "Task 2", description: "Description 2", priority: "Low" }
];

// GET all tasks with optional priority filter
app.get('/tasks', (req, res) => {
    const { priority } = req.query;

    if (priority && priority !== "All") {
        const filteredTasks = tasks.filter(task => task.priority === priority);
        return res.json(filteredTasks);
    }

    res.json(tasks);
});

// POST a new task
app.post('/tasks', (req, res) => {
    const { name, description, priority } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Task name is required!" });
    }

    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        name,
        description: description || '',
        priority: priority || 'Medium'
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.status(204).send();
});

// PUT (Update) a task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;

    res.json(task);
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
