document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("send-button");

  sendButton.addEventListener("click", () => {
    const cards = document.querySelectorAll(".card");
    const orders = [];

    cards.forEach((card) => {
      const quantityInput = card.querySelector(".quantity");
      const itemName = card.querySelector("h2").textContent;
      const quantity = parseInt(quantityInput.value, 10);

      if (quantity > 0) {
        orders.push({
          name: itemName,
          quantity: quantity,
        });
      }
    });

    if (orders.length > 0) {
      fetch("/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orders,
          total: document.getElementById("total-sum-value").textContent,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Заказ отправлен!");
          // Очистка количества после отправки
          document
            .querySelectorAll(".quantity")
            .forEach((input) => (input.value = "0"));
          document.getElementById("total-sum-value").textContent = "0";
        })
        .catch((error) => console.error("Ошибка:", error));
    } else {
      alert("Добавьте хотя бы один инструмент.");
    }
  });

  // Обновление общей стоимости при изменении количества
  const updateTotal = () => {
    let total = 0;
    document.querySelectorAll(".card").forEach((card) => {
      const price = parseFloat(card.querySelector(".price").textContent);
      const quantity = parseInt(card.querySelector(".quantity").value, 10);
      total += price * quantity;
    });
    document.getElementById("total-sum-value").textContent = total.toFixed(2);
  };

  document.querySelectorAll(".quantity-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const input = button.parentElement.querySelector(".quantity");
      let currentValue = parseInt(input.value, 10);

      if (button.classList.contains("increase")) {
        input.value = currentValue + 1;
      } else if (button.classList.contains("decrease") && currentValue > 0) {
        input.value = currentValue - 1;
      }

      updateTotal();
    });
  });

  // Изначально обновляем стоимость
  updateTotal();
});
