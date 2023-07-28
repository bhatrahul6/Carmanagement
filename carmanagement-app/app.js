
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 1234;

// Configure MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_sqlpassword',
  database: 'your_database',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  connection.query('SELECT * FROM cars', (err, results) => {
    if (err) throw err;
    res.render('index', { cars: results });
  });
});

app.post('/add', (req, res) => {
  const { make, model, year } = req.body;
  connection.query(
    'INSERT INTO cars (make, model, year) VALUES (?, ?, ?)',
    [make, model, year],
    (err, result) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

app.post('/update/:id', (req, res) => {
  const { make, model, year } = req.body;
  const carId = req.params.id;
  connection.query(
    'UPDATE cars SET make=?, model=?, year=? WHERE id=?',
    [make, model, year, carId],
    (err, result) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

app.get('/delete/:id', (req, res) => {
  const carId = req.params.id;
  connection.query('DELETE FROM cars WHERE id=?', [carId], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.listen(1234, () => {
  console.log(`Server is running on http://localhost:${1234}`);
});
