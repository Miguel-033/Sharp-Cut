const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config(); // Загрузка переменных окружения из .env файла

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // Обслуживание статических файлов из папки public

// Подключение к базе данных
const db = new sqlite3.Database("orders.db");

// Создание таблиц для заказов
db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    instruments TEXT,
    total REAL,
    status TEXT
)`);

// Добавление нового заказа
app.post("/orders", (req, res) => {
  const { items, total, phone, name, message } = req.body;

  // Формируем текст сообщения
  const orderMessage = `
    Новая заявка с сайта Sharp Cut:
    
    Имя: ${name}
    Телефон: ${phone}
    Сообщение: ${message}
    
    Товары:
    ${items.map((item) => `${item.name}: ${item.quantity}`).join("\n")}
    
    Общая стоимость: €${total}
  `;

  // Отправляем сообщение в Telegram
  fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: orderMessage,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Message sent to Telegram:", data);
      res.json({ status: "success" });
    })
    .catch((error) => {
      console.error("Error sending message to Telegram:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to send message to Telegram",
      });
    });
});

// Получение всех заказов
app.get("/orders", (req, res) => {
  db.all("SELECT * FROM orders", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ orders: rows });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
