const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// ToDo一覧表示
router.get('/', (req, res) => {
    const dueDateOrder = req.query.sort === 'desc' ? 'desc' : 'asc';
    const todos = todoController.getAll(dueDateOrder);
    const error = req.query.error;
    res.render('index', { todos, error, dueDateOrder });
});

// 新規作成フォーム表示
router.get('/new', (req, res) => {
    const error = req.query.error;
    res.render('new', { error });
});

// 新規作成処理
router.post('/', (req, res) => {
    const { title, content, due_date, priority } = req.body;
    try {
        todoController.create({ title, content, due_date, priority: priority || '2' });
        res.redirect('/');
    } catch (err) {
        res.redirect('/new?error=' + encodeURIComponent(err.message));
    }
});

// 編集フォーム表示
router.get('/:id/edit', (req, res) => {
    const todo = todoController.getById(parseInt(req.params.id));
    if (!todo) {
        return res.status(404).render('error', { message: 'ToDoが見つかりません' });
    }
    const error = req.query.error;
    res.render('edit', { todo, error });
});

// 更新処理
router.post('/:id', (req, res) => {
    const { title, content, due_date, priority } = req.body;
    try {
        todoController.update(parseInt(req.params.id), { 
            title, 
            content, 
            due_date, 
            priority: priority || '2'
        });
        res.redirect('/');
    } catch (err) {
        res.redirect('/' + req.params.id + '/edit?error=' + encodeURIComponent(err.message));
    }
});

// 削除処理
router.post('/:id/delete', (req, res) => {
    todoController.delete(parseInt(req.params.id));
    res.redirect('/');
});

module.exports = router;
