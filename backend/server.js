const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Kết nối MySQL RDS
const db = mysql.createConnection({
    host: 'database-task-manager.c1oia4wm0b92.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'admin22!',
    database: 'database_task_manager'
});

db.connect(err => {
    if (err) {
        console.error('❌ Không thể kết nối MySQL:', err);
        return;
    }
    console.log('✅ Đã kết nối MySQL thành công!');
});

// Middleware
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

// Lấy danh sách task
app.get('/tasks', (req, res) => {
    const { priority } = req.query;
    let query = 'SELECT * FROM tasks';
    let params = [];

    if (priority && priority !== "All") {
        query += ' WHERE priority = ?';
        params.push(priority);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('❌ Lỗi khi lấy tasks:', err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
        res.json(results);
    });
});

// Thêm task mới
app.post('/tasks', (req, res) => {
    const { name, description, priority } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Task name is required!" });
    }

    const query = 'INSERT INTO tasks (name, description, priority) VALUES (?, ?, ?)';
    const values = [name, description || '', priority || ''];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('❌ Lỗi khi thêm task:', err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
        res.status(201).json({ id: result.insertId, name, description, priority });
    });
});

// Xóa task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
        if (err) {
            console.error('❌ Lỗi khi xóa task:', err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
        res.status(204).send();
    });
});

// Cập nhật task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { name, description, priority } = req.body;

    db.query('UPDATE tasks SET name = ?, description = ?, priority = ? WHERE id = ?',
        [name, description, priority, taskId], (err, result) => {
            if (err) {
                console.error('❌ Lỗi khi cập nhật task:', err);
                return res.status(500).json({ message: 'Lỗi server' });
            }
            res.json({ id: taskId, name, description, priority });
        });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on http://3.107.190.9:${port}`);
});
