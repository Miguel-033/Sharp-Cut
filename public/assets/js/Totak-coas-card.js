document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("send-button");
  const orderModal = document.getElementById("myModal");
  const closeModal = document.querySelector(".modal-call .close");
  const orderForm = document.getElementById("contact-form");
  const itemList = document.getElementById("item-list");
  const modalTotalCostValue = document.getElementById("modal-total-cost-value");

  // Функция для открытия модального окна
  const openModal = () => {
    const hasItems = Array.from(document.querySelectorAll(".quantity")).some(
      (input) => parseInt(input.value, 10) > 0
    );
    if (hasItems) {
      itemList.innerHTML = "";
      document.querySelectorAll(".cardItem").forEach((cardItem) => {
        const quantityInput = cardItem.querySelector(".quantity");
        const itemName = cardItem.querySelector("h3").textContent; // h3 для названия товара
        const quantity = parseInt(quantityInput.value, 10);

        if (quantity > 0) {
          const listItem = document.createElement("div");
          listItem.textContent = `${itemName}: ${quantity}`;
          itemList.appendChild(listItem);
        }
      });
      modalTotalCostValue.textContent =
        document.getElementById("total-sum-value").textContent;
      orderModal.style.display = "block";
    } else {
      alert("Добавьте хотя бы один инструмент.");
    }
  };

  // Функция для закрытия модального окна
  const closeModalWindow = () => {
    orderModal.style.display = "none";
  };

  // Обработчик для кнопки отправки заказа
  sendButton.addEventListener("click", openModal);

  closeModal.addEventListener("click", closeModalWindow);

  window.addEventListener("click", (event) => {
    if (event.target === orderModal) {
      closeModalWindow();
    }
  });

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const phone = document.getElementById("phone").value;
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;

    const cards = document.querySelectorAll(".cardItem");
    const orders = [];

    cards.forEach((cardItem) => {
      const quantityInput = cardItem.querySelector(".quantity");
      const itemName = cardItem.querySelector("h3").textContent;
      const quantity = parseInt(quantityInput.value, 10);

      if (quantity > 0) {
        orders.push({
          name: itemName,
          quantity: quantity,
        });
      }
    });

    fetch("/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: orders,
        total: modalTotalCostValue.textContent,
        phone: phone,
        name: name,
        message: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Заказ отправлен!");
        document
          .querySelectorAll(".quantity")
          .forEach((input) => (input.value = "0"));
        document.getElementById("total-sum-value").textContent = "0";
        closeModalWindow();
      })
      .catch((error) => console.error("Ошибка:", error));
  });

  // Функция для обновления общей стоимости всех товаров
  const updateTotal = () => {
    let total = 0;
    document.querySelectorAll(".cardItem").forEach((cardItem) => {
      const price = parseFloat(cardItem.querySelector(".price").textContent);
      const quantity =
        parseInt(cardItem.querySelector(".quantity").value, 10) || 0;
      const cardTotal = price * quantity;

      // Обновляем общую стоимость для каждой карточки
      cardItem.querySelector(".totalPrice").textContent = cardTotal.toFixed(2);

      total += cardTotal; // Суммируем все товары для общей стоимости
    });
    document.getElementById("total-sum-value").textContent = total.toFixed(2);
  };

  // Обновляем общую стоимость при изменении количества с помощью кнопок
  document.querySelectorAll(".quantity-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const input = button.parentElement.querySelector(".quantity");
      let currentValue = parseInt(input.value, 10) || 0;

      if (button.classList.contains("increase")) {
        input.value = currentValue + 1;
      } else if (button.classList.contains("decrease") && currentValue > 0) {
        input.value = currentValue - 1;
      }

      updateTotal();
    });
  });

  // Обновление общей стоимости при вводе вручную в поле количества
  document.querySelectorAll(".quantity").forEach((input) => {
    input.addEventListener("change", () => {
      if (parseInt(input.value, 10) < 1 || isNaN(input.value)) {
        input.value = 0;
      }
      updateTotal(); // Обновляем общую стоимость
    });
  });

  // Изначально обновляем общую стоимость при загрузке страницы
  updateTotal();
});
