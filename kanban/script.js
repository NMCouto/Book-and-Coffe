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
        <button class="edit-btn">
          <i class="fa-solid fa-pen"></i>
        </button>                     
        <button class="delete-btn">
          <i class="fa-solid fa-trash"></i>
        </button>
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

document.addEventListener("DOMContentLoaded", carregarDevolucoesHoje);

async function carregarDevolucoesHoje() {
    try {
        const resp = await fetch("http://localhost:3000/emprestimos/devolucaoHoje");
        const emprestimos = await resp.json();

        emprestimos.forEach(e => criarCardDevolucao(e));

    } catch (erro) {
        console.error("Erro ao carregar empréstimos:", erro);
    }
}

function criarCardDevolucao(emprestimo) {
    const coluna = document.querySelector('.kanban-column[data-id="1"] .kanban-cards');

    const card = document.createElement("div");
    card.classList.add("kanban-card");
    card.setAttribute("draggable", "true");

    card.innerHTML = `
        <div class="badge high">
            <span> Devolver hoje </span>
        </div>
        <p class="card-title">${emprestimo.titulo}</p>
        <div class="card-infos">
            <div class="card-icons">
                <p><i class="fa-regular fa-calendar"></i> ${new Date(emprestimo.data_devolucao).toLocaleDateString("pt-BR")}</p>
            </div>
            <div class="user">
                
            </div>
        </div>
    `;

    card.addEventListener("dragstart", (e) => {
    e.currentTarget.classList.add("dragging");
  });

  card.addEventListener("dragend", (e) => {
    e.currentTarget.classList.remove("dragging");
  });

    coluna.appendChild(card);
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-btn");  

    if (btn) {
        const card = btn.closest(".kanban-card");
        card.remove();
    }
});

document.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");

    if (editBtn) {
        const card = editBtn.closest(".kanban-card");
        const titleEl = card.querySelector(".card-title");

        const novoTitulo = prompt("Editar título:", titleEl.textContent);

        if (novoTitulo && novoTitulo.trim() !== "") {
            titleEl.textContent = novoTitulo;
        }
    }
});

document.addEventListener("change", (e) => {
    if (e.target.classList.contains("priority-select")) {
        const select = e.target;
        const card = select.closest(".kanban-card");
        const badge = select.closest(".badge");

        // Remove classes antigas
        badge.classList.remove("low", "medium", "high");

        // Adiciona a nova
        badge.classList.add(select.value);
    }
});








