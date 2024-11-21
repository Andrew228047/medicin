const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Встановлюємо директорію для публічних файлів (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для головної сторінки
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Маршрут для сторінки деталей пацієнта
app.get('/details.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'details.html'));
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
