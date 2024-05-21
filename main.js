const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const mysql2 = require("mysql2/promise");

const accessLogStream = fs.createWriteStream("access.log", { flags: "a" });

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    database: 'news',
    password: 'root',
});

const app = express();
app.use(express.static('public'));
// Настраиваем morgan для записи логов в файл
app.use(morgan("combined", { stream: accessLogStream }));

app.get('/', function (req, res) {
    pool.query('SELECT id, title, date FROM message').then(function (data) {
        const messages = data[0];
        res.render('index.ejs', { messages });
    });
});

app.get('/article/:id', function (req, res) {
    const articleId = req.params.id;
    pool.query('SELECT * FROM message WHERE id = ?', [articleId]).then(function (data) {
        const article = data[0][0];
        res.render('article.ejs', { article });
    });
});

app.listen(3000, function () {
    console.log('server started!');
})