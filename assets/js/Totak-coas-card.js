document.addEventListener("DOMContentLoaded", function () {
  const decreaseButtons = document.querySelectorAll(".decrease");
  const increaseButtons = document.querySelectorAll(".increase");
  const quantityInputs = document.querySelectorAll(".quantity");
  const totalSumElement = document.getElementById("total-sum-value");

  function updateTotalSum() {
    let totalSum = 0;
    quantityInputs.forEach((input) => {
      const price = parseFloat(
        input.closest(".card").querySelector(".price").textContent
      );
      const quantity = parseInt(input.value, 10);
      totalSum += price * quantity;
    });
    totalSumElement.textContent = totalSum.toFixed(2);
  }

  decreaseButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      let quantity = parseInt(quantityInputs[index].value, 10);
      if (quantity > 1) {
        quantityInputs[index].value = quantity - 1;
      }
      updateTotalSum();
    });
  });

  increaseButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      let quantity = parseInt(quantityInputs[index].value, 10);
      quantityInputs[index].value = quantity + 1;
      updateTotalSum();
    });
  });

  quantityInputs.forEach((input) => {
    input.addEventListener("input", updateTotalSum);
  });

  document.getElementById("send-button").addEventListener("click", () => {
    // Display modal and fill it with data
    const modal = document.getElementById("myModal");
    const modalTotalCostElement = document.getElementById(
      "modal-total-cost-value"
    );
    const itemListElement = document.getElementById("item-list");
    let itemListHTML = "";
    quantityInputs.forEach((input) => {
      const quantity = parseInt(input.value, 10);
      if (quantity > 0) {
        const itemName = input.closest(".card").querySelector("h2").textContent;
        const itemPrice = input
          .closest(".card")
          .querySelector(".price").textContent;
        itemListHTML += `<p>${itemName}: ${quantity} шт. по €${itemPrice} за ед.</p>`;
      }
    });
    itemListElement.innerHTML = itemListHTML;
    modalTotalCostElement.textContent = totalSumElement.textContent;
    modal.style.display = "block";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("myModal").style.display = "none";
  });

  document
    .getElementById("contact-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Collecting form data
      const phone = document.getElementById("phone").value;
      const name = document.getElementById("name").value;
      const message = document.getElementById("message").value;
      const itemList = document.getElementById("item-list").innerHTML;
      const totalCost = document.getElementById(
        "modal-total-cost-value"
      ).textContent;

      // Telegram Bot API details
      const token = "7448769112:AAG8DBM_FTdxy9nO4Xix03eO_yuf4U-7usg";
      const chat_id = "5895553185";
      const url = `https://api.telegram.org/bot${token}/sendMessage`;

      // Constructing the message to send
      const text = `
Новая заявка с сайта Sharp Cut:\n
Имя: ${name}\n
Телефон: ${phone}\n
Сообщение: ${message}\n\n
Товары:\n${itemList.replace(/<[^>]*>?/gm, "").replace(/\./g, ".\n")}\n
Общая стоимость: €${totalCost}
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
          parse_mode: "HTML", // Убедитесь, что разметка HTML корректная, иначе уберите этот параметр
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Отладочная информация
          if (data.ok) {
            alert("Форма успешно отправлена!");
            // Сброс формы после успешной отправки
            document.getElementById("contact-form").reset();
            // Сброс суммы и списка товаров в модальном окне
            document.getElementById("item-list").innerHTML = "";
            document.getElementById("modal-total-cost-value").textContent = "0";
          } else {
            alert("Не удалось отправить сообщение: " + data.description);
          }
          document.getElementById("myModal").style.display = "none";
        })
        .catch((error) => {
          console.log(error.message); // Отладочная информация
          alert("Ошибка: " + error.message);
        });
    });
});
