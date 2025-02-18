const express = require('express');
const app = express();
const port = 3000;

let tasks = [
    { id: 1, name: "Task 1", priority: "High" },
    { id: 2, name: "Task 2", priority: "Low" }
];

app.use(express.json());

// GET all tasks
app.get('/tasks', (req, res) => {
    const priorityFilter = req.query.priority;
    if (priorityFilter && priorityFilter !== 'All') {
        return res.json(tasks.filter(task => task.priority === priorityFilter));
    }
    res.json(tasks);
});

// POST a new task
app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        name: req.body.name,
        priority: req.body.priority || 'Medium'
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
    res.status(204).send();
});

// PUT to update a task (optional for this example)
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));
    if (task) {
        task.name = req.body.name || task.name;
        task.priority = req.body.priority || task.priority;
        res.json(task);
    } else {
        res.status(404).send();
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
