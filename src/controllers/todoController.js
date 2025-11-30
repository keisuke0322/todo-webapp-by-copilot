const db = require('../database');

/**
 * ToDoコントローラークラス
 * ToDo項目のCRUD操作を提供
 */
class TodoController {
    /**
     * 全てのToDoを取得
     * @param {string} dueDateOrder - 期限のソート順 ('asc' or 'desc')
     * @param {string|null} priorityFilter - 優先度フィルタ ('1', '2', '3', または null)
     * @returns {Array} ToDoリスト
     */
    getAll(dueDateOrder = 'asc', priorityFilter = null) {
        const order = dueDateOrder === 'desc' ? 'DESC' : 'ASC';
        let query = 'SELECT * FROM todos';
        const params = [];
        
        if (priorityFilter && ['1', '2', '3'].includes(priorityFilter)) {
            query += ' WHERE priority = ?';
            params.push(parseInt(priorityFilter));
        }
        
        query += ` ORDER BY due_date ${order}, priority ASC`;
        const stmt = db.prepare(query);
        return params.length > 0 ? stmt.all(...params) : stmt.all();
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
     * 入力値を検証
     * @param {Object} todo - ToDo項目
     * @returns {Object} 検証結果 { valid: boolean, errors: string[] }
     */
    validate(todo) {
        const errors = [];
        if (!todo.title || todo.title.trim() === '') {
            errors.push('タイトルは必須です');
        }
        const priority = parseInt(todo.priority);
        if (isNaN(priority) || priority < 1 || priority > 3) {
            errors.push('優先度は1-3の範囲で指定してください');
        }
        return { valid: errors.length === 0, errors };
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
        const validation = this.validate(todo);
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }
        const stmt = db.prepare(
            'INSERT INTO todos (title, content, due_date, priority) VALUES (?, ?, ?, ?)'
        );
        const result = stmt.run(todo.title.trim(), todo.content, todo.due_date, parseInt(todo.priority));
        return { id: result.lastInsertRowid, ...todo };
    }

    /**
     * ToDoを更新
     * @param {number} id - ToDoのID
     * @param {Object} todo - 更新内容
     * @returns {Object} 更新結果
     */
    update(id, todo) {
        const validation = this.validate(todo);
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }
        const stmt = db.prepare(
            'UPDATE todos SET title = ?, content = ?, due_date = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        );
        const result = stmt.run(todo.title.trim(), todo.content, todo.due_date, parseInt(todo.priority), id);
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
