const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

// Підключення до бази даних MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Andrey22852015', // Замість 'your_password' вкажіть ваш пароль
  database: 'clinic' // Ім'я вашої бази даних
});

db.connect(err => {
  if (err) {
    console.error('Помилка з підключенням до бази даних: ' + err.stack);
    return;
  }
  console.log('Підключено до бази даних MySQL');
});

// Налаштування для парсингу JSON-запитів
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для головної сторінки
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Маршрут для отримання всіх пацієнтів з бази даних
app.get('/api/patients', (req, res) => {
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Помилка при отриманні пацієнтів' });
    }
    res.json(results);
  });
});

// Маршрут для додавання нового пацієнта в базу даних
app.post('/api/patients', (req, res) => {
  const { name, age, contact, lastVisit, disease } = req.body;
  const newPatient = { name, age, contact, lastVisit, disease };

  const query = 'INSERT INTO patients (name, age, contact, lastVisit, disease) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [newPatient.name, newPatient.age, newPatient.contact, newPatient.lastVisit, newPatient.disease], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Помилка при додаванні пацієнта' });
    }
    newPatient.id = results.insertId;
    res.status(201).json(newPatient);
  });
});
// Маршрут для отримання конкретного пацієнта
app.get('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM patients WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Помилка при отриманні пацієнта' });
    }
    res.json(results[0]);
  });
});

// Маршрут для оновлення пацієнта
app.put('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, contact, lastVisit, disease } = req.body;

  const query = 'UPDATE patients SET name = ?, age = ?, contact = ?, lastVisit = ?, disease = ? WHERE id = ?';
  db.query(query, [name, age, contact, lastVisit, disease, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Помилка при оновленні пацієнта' });
    }
    res.json({ id, name, age, contact, lastVisit, disease });
  });
});

// Маршрут для видалення пацієнта
app.delete('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM patients WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Помилка при видаленні пацієнта' });
    }
    res.status(204).send();
  });
});


// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
