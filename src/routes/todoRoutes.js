const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// ToDo一覧表示
router.get('/', (req, res) => {
    const todos = todoController.getAll();
    res.render('index', { todos });
});

// 新規作成フォーム表示
router.get('/new', (req, res) => {
    res.render('new');
});

// 新規作成処理
router.post('/', (req, res) => {
    const { title, content, due_date, priority } = req.body;
    todoController.create({ title, content, due_date, priority: parseInt(priority) || 2 });
    res.redirect('/');
});

// 編集フォーム表示
router.get('/:id/edit', (req, res) => {
    const todo = todoController.getById(parseInt(req.params.id));
    if (!todo) {
        return res.redirect('/');
    }
    res.render('edit', { todo });
});

// 更新処理
router.post('/:id', (req, res) => {
    const { title, content, due_date, priority } = req.body;
    todoController.update(parseInt(req.params.id), { 
        title, 
        content, 
        due_date, 
        priority: parseInt(priority) || 2 
    });
    res.redirect('/');
});

// 削除処理
router.post('/:id/delete', (req, res) => {
    todoController.delete(parseInt(req.params.id));
    res.redirect('/');
});

module.exports = router;
