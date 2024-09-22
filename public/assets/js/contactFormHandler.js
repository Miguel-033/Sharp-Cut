document.addEventListener("DOMContentLoaded", function () {
  // Получаем форму по классу
  const form = document.querySelector(".php-email-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Предотвращаем стандартную отправку формы

    // Сбор данных из формы
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const subject = form.querySelector('input[name="subject"]').value;
    const message = form.querySelector('textarea[name="message"]').value;

    // Telegram Bot API details
    const token = "7448769112:AAG8DBM_FTdxy9nO4Xix03eO_yuf4U-7usg";
    const chat_id = "5895553185";
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // Форматированное сообщение
    const text = `
Новое сообщение с сайта Sharp Cut:\n
Имя: ${name}\n
Email:${email}\n
Телефон:${subject}\n
Сообщение: ${message}
`;

    // Отправка данных в Telegram
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chat_id,
        text: text,
        parse_mode: "HTML", // Для поддержки HTML-разметки в сообщении
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          // Успешная отправка
          form.querySelector(".sent-message").style.display = "block";
          form.querySelector(".loading").style.display = "none";
          form.querySelector(".error-message").style.display = "none";
          form.reset(); // Сброс формы
        } else {
          // Ошибка отправки
          form.querySelector(".error-message").textContent =
            "Ошибка отправки: " + data.description;
          form.querySelector(".error-message").style.display = "block";
          form.querySelector(".loading").style.display = "none";
        }
      })
      .catch((error) => {
        form.querySelector(".error-message").textContent =
          "Ошибка: " + error.message;
        form.querySelector(".error-message").style.display = "block";
        form.querySelector(".loading").style.display = "none";
      });

    // Показать индикатор загрузки
    form.querySelector(".loading").style.display = "block";
  });
});
