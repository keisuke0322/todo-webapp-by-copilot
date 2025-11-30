const express = require('express');
const path = require('path');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = 3000;

// ビューエンジンの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ミドルウェアの設定
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ルーティング
app.use('/', todoRoutes);

// サーバー起動
app.listen(PORT, () => {
    console.log(`ToDo管理アプリが起動しました: http://localhost:${PORT}`);
});

module.exports = app;
