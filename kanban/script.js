document.querySelectorAll(".kanban-card").forEach((card) => {
  card.addEventListener("dragstart", (e) => {
    e.currentTarget.classList.add("dragging");
  });

  card.addEventListener("dragend", (e) => {
    e.currentTarget.classList.remove("dragging");
  });
});

document.querySelectorAll(".kanban-cards").forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault(); // Permite o drop
    e.currentTarget.classList.add("cards-hover");
  });

  column.addEventListener("dragleave", (e) => {
    e.currentTarget.classList.remove("cards-hover");
  });

  column.addEventListener("drop", (e) => {
    e.currentTarget.classList.remove("cards-hover");
    const dragCard = document.querySelector(".kanban-card.dragging");
    e.currentTarget.appendChild(dragCard);
  });
});

document.getElementById("addTaskBtn").addEventListener("click", () => {
  const title = document.getElementById("taskTitle").value.trim();
  const columnId = document.getElementById("taskColumn").value;

  if (!title) {
    alert("Digite o título da tarefa.");
    return;
  }

  const card = document.createElement("div");
  card.classList.add("kanban-card");
  card.setAttribute("draggable", "true");
  card.innerHTML = `
    <div class="badge low"><span> Nova tarefa </span></div>
    <p class="card-title">${title}</p>
    <div class="card-infos">
      <div class="card-icons">
        <p><i class="fa-regular fa-comment"></i> 0</p>
        <p><i class="fa-solid fa-paperclip"></i> 0</p>
      </div>
      <div class="user">
        <img src="images/avatar.jpg" alt="Avatar" />
      </div>
    </div>
  `;

  card.addEventListener("dragstart", (e) => {
    e.currentTarget.classList.add("dragging");
  });

  card.addEventListener("dragend", (e) => {
    e.currentTarget.classList.remove("dragging");
  });

  const targetColumn = document.querySelector(
        `.kanban-column[data-id="${columnId}"] .kanban-cards`
    );
  targetColumn.appendChild(card);
  document.getElementById("taskTitle").value = "";
  
});


