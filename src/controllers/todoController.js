const db = require('../database');

/**
 * ToDoコントローラークラス
 * ToDo項目のCRUD操作を提供
 */
class TodoController {
    /**
     * 全てのToDoを取得
     * @returns {Array} ToDoリスト
     */
    getAll() {
        const stmt = db.prepare('SELECT * FROM todos ORDER BY priority ASC, due_date ASC');
        return stmt.all();
    }

    /**
     * IDでToDoを取得
     * @param {number} id - ToDoのID
     * @returns {Object|undefined} ToDo項目
     */
    getById(id) {
        const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
        return stmt.get(id);
    }

    /**
     * 新しいToDoを作成
     * @param {Object} todo - ToDo項目
     * @param {string} todo.title - タイトル
     * @param {string} todo.content - 内容
     * @param {string} todo.due_date - 期限
     * @param {number} todo.priority - 優先度
     * @returns {Object} 作成結果
     */
    create(todo) {
        const stmt = db.prepare(
            'INSERT INTO todos (title, content, due_date, priority) VALUES (?, ?, ?, ?)'
        );
        const result = stmt.run(todo.title, todo.content, todo.due_date, todo.priority);
        return { id: result.lastInsertRowid, ...todo };
    }

    /**
     * ToDoを更新
     * @param {number} id - ToDoのID
     * @param {Object} todo - 更新内容
     * @returns {Object} 更新結果
     */
    update(id, todo) {
        const stmt = db.prepare(
            'UPDATE todos SET title = ?, content = ?, due_date = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        );
        const result = stmt.run(todo.title, todo.content, todo.due_date, todo.priority, id);
        return { changes: result.changes };
    }

    /**
     * ToDoを削除
     * @param {number} id - ToDoのID
     * @returns {Object} 削除結果
     */
    delete(id) {
        const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
        const result = stmt.run(id);
        return { changes: result.changes };
    }
}

module.exports = new TodoController();
