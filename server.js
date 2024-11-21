const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

let patients = []; // Масив для збереження пацієнтів (в реальному проєкті це буде база даних)

// Налаштування для парсингу JSON-запитів
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для головної сторінки
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Маршрут для отримання всіх пацієнтів
app.get('/api/patients', (req, res) => {
  res.json(patients);
});

// Маршрут для додавання нового пацієнта
app.post('/api/patients', (req, res) => {
  const newPatient = req.body;
  newPatient.id = Date.now();
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
