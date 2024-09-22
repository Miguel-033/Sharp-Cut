document.addEventListener("DOMContentLoaded", () => {
  const ordersTable = document.querySelector("#orders-table tbody");
  const archiveTable = document.querySelector("#archive-table tbody");
  const toggleArchiveButton = document.querySelector("#toggle-archive");

  function loadOrders() {
    fetch("/orders")
      .then((response) => {
        console.log("Ответ от сервера:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Данные от сервера:", data);
        ordersTable.innerHTML = "";
        data.orders.forEach((order) => {
          const row = document.createElement("tr");
          row.innerHTML = `
             <td>${order.id}</td>
             <td>${order.name}</td>
             <td>${order.instruments}</td>
             <td>${order.total || "Не указана"}</td>
             <td>
               <select class="form-select" onchange="updateStatus(${
                 order.id
               }, this.value)">
                 <option value="Новый" ${
                   order.status === "Новый" ? "selected" : ""
                 }>Новый</option>
                 <option value="В процессе" ${
                   order.status === "В процессе" ? "selected" : ""
                 }>В процессе</option>
                 <option value="Завершен" ${
                   order.status === "Завершен" ? "selected" : ""
                 }>Завершен</option>
               </select>
             </td>
             <td>
               <button class="btn btn-danger" onclick="archiveOrder(${
                 order.id
               })">Архивировать</button>
             </td>
           `;
          ordersTable.appendChild(row);
        });
      })
      .catch((error) => console.error("Ошибка загрузки заказов:", error));
  }

  window.updateStatus = function (id, status) {
    fetch(`/orders/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((response) => response.json())
      .then(() => loadOrders())
      .catch((error) => console.error("Ошибка обновления статуса:", error));
  };

  window.archiveOrder = function (id) {
    fetch(`/orders/archive/${id}`, { method: "POST" })
      .then((response) => response.json())
      .then(() => loadOrders())
      .catch((error) => console.error("Ошибка архивации заказа:", error));
  };

  function loadArchive() {
    fetch("/archive")
      .then((response) => response.json())
      .then((data) => {
        console.log("Данные архива от сервера:", data);
        archiveTable.innerHTML = "";
        data.archive.forEach((order) => {
          const row = document.createElement("tr");
          row.innerHTML = `
             <td>${order.id}</td>
             <td>${order.name}</td>
             <td>${order.instruments}</td>
             <td>${order.total || "Не указана"}</td>
             <td>${order.status}</td>
           `;
          archiveTable.appendChild(row);
        });
      })
      .catch((error) => console.error("Ошибка загрузки архива:", error));
  }

  toggleArchiveButton.addEventListener("click", () => {
    const isArchiveVisible = archiveTable.style.display === "table";
    archiveTable.style.display = isArchiveVisible ? "none" : "table";
    if (!isArchiveVisible) loadArchive();
  });

  loadOrders();
});
