// -------------------------
// script.js (com edição via popup)
// -------------------------

const API_BASE = "http://localhost:3000/cards";

/* -------------------------
   Helper prioridade
------------------------- */
function mapPriorityValue(v) {
  if (v === "1" || v === 1) return "low";
  if (v === "2" || v === 2) return "medium";
  if (v === "3" || v === 3) return "high";
  return v;
}

/* -------------------------
   Drag & Drop
------------------------- */
function enableDragDropForExisting() {
  document.querySelectorAll(".kanban-cards").forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      column.classList.add("cards-hover");
    });

    column.addEventListener("dragleave", () => column.classList.remove("cards-hover"));

    column.addEventListener("drop", async (e) => {
      e.preventDefault();
      column.classList.remove("cards-hover");

      const dragCard = document.querySelector(".kanban-card.dragging");
      if (!dragCard) return;

      column.appendChild(dragCard);

      const id = dragCard.dataset.id;
      const novaColuna = column.closest(".kanban-column").dataset.id;

      try {
        await atualizarCardNoBanco(id, { columnId: String(novaColuna) });
      } catch (err) {
        console.error("Erro ao mover card:", err);
      }
    });
  });
}
enableDragDropForExisting();

/* -------------------------
   API
------------------------- */
async function criarCardNoBanco(cardData) {
  const resp = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cardData),
  });
  if (!resp.ok) throw new Error(`POST ${resp.status}`);
  return await resp.json();
}

async function buscarCardsNoBanco() {
  const resp = await fetch(API_BASE);
  if (!resp.ok) throw new Error(`GET ${resp.status}`);
  return await resp.json();
}

async function deletarCardNoBanco(id) {
  const resp = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!resp.ok) throw new Error(`DELETE ${resp.status}`);
  return await resp.json();
}

async function atualizarCardNoBanco(id, body) {
  const resp = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`PUT ${resp.status}`);
  return await resp.json();
}

/* -------------------------
   Carregar cards ao iniciar
------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const cards = await buscarCardsNoBanco();
    cards.forEach((c) => criarCardHTML(c));
  } catch (err) {
    console.error("Erro ao carregar:", err);
  }
});

/* -------------------------
   Criar HTML do card
------------------------- */
function criarCardHTML(card) {
  const col = String(card.columnId);
  const coluna = document.querySelector(`.kanban-column[data-id="${col}"] .kanban-cards`);
  if (!coluna) return;

  const div = document.createElement("div");
  div.className = "kanban-card";
  div.draggable = true;
  div.dataset.id = card._id;
  let prioridade = "";
  if(card.priority === "low"){
    prioridade = "baixa";
  }else if(card.priority === "medium"){
    prioridade ="média";
  }else if(card.priority === "high"){
    prioridade = "alta";
  }

  div.innerHTML = `
      <div class="badge ${card.priority}">
        <span>${prioridade}</span>
      </div>

      <p class="card-title">${escapeHtml(card.title)}</p>

      <div class="card-infos">
        <div class="card-icons">
          <button class="details-btn"><i class="fa-regular fa-comment"></i></button>
        </div>

        <div class="user">
          <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
          <button class="delete-btn" data-id="${card._id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>

      <div class="card-details-popup hidden">
        <div class="details-content">
          <h3>Detalhes</h3>
          <p class="details-text">${escapeHtml(card.comment)}</p>
          <button class="close-popup">Fechar</button>
        </div>
      </div>
  `;

  div.addEventListener("dragstart", () => div.classList.add("dragging"));
  div.addEventListener("dragend", () => div.classList.remove("dragging"));

  coluna.appendChild(div);
}

/* -------------------------
   Criar novo card
------------------------- */
document.getElementById("addTaskBtn").addEventListener("click", async () => {
  const title = document.getElementById("taskTitle").value.trim();
  const comment = document.getElementById("taskComment").value.trim();
  const columnId = document.getElementById("taskColumn").value;
  const priority = mapPriorityValue(document.getElementById("priority").value);

  if (!title) return alert("Digite o título.");

  const payload = { title, comment, columnId, priority };

  try {
    const novo = await criarCardNoBanco(payload);
    criarCardHTML(novo);
  } catch (err) {
    console.error(err);
  }
});

/* -------------------------
   Deletar card
------------------------- */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;

  if (!confirm("Apagar card?")) return;

  try {
    await deletarCardNoBanco(btn.dataset.id);
    btn.closest(".kanban-card").remove();
  } catch (err) {
    console.error(err);
  }
});

/* -------------------------
   EDITAR TÍTULO + COMENTÁRIO (NOVO POPUP)
------------------------- */
document.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  if (!editBtn) return;

  const card = editBtn.closest(".kanban-card");
  const id = card.dataset.id;

  const currentTitle = card.querySelector(".card-title").textContent;
  const currentComment = card.querySelector(".details-text").textContent;

  // Criar popup
  const popup = document.createElement("div");
  popup.classList.add("edit-popup");

  popup.innerHTML = `
    <div class="edit-content">
      <h3>Editar Card</h3>

      <label>Título</label>
      <input type="text" id="edit-title" value="${currentTitle}">

      <label>Comentário</label>
      <textarea id="edit-comment">${currentComment}</textarea>

      <button class="save-edit">Salvar</button>
      <button class="cancel-edit">Cancelar</button>
    </div>
  `;

  card.appendChild(popup);
});

/* -------------------------
   Salvar edição
------------------------- */
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("save-edit")) return;

  const popup = e.target.closest(".edit-popup");
  const card = popup.closest(".kanban-card");
  const id = card.dataset.id;

  const newTitle = popup.querySelector("#edit-title").value.trim();
  const newComment = popup.querySelector("#edit-comment").value.trim();

  if (!newTitle) return alert("Título não pode ser vazio.");

  try {
    await atualizarCardNoBanco(id, {
      title: newTitle,
      comment: newComment,
    });

    card.querySelector(".card-title").textContent = newTitle;
    card.querySelector(".details-text").textContent = newComment;

  } catch (err) {
    console.error(err);
  }

  popup.remove();
});

/* -------------------------
   Cancelar edição
------------------------- */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("cancel-edit")) {
    e.target.closest(".edit-popup").remove();
  }
});

/* -------------------------
   Detalhes popup
------------------------- */
document.addEventListener("click", (e) => {
  if (e.target.closest(".details-btn")) {
    const card = e.target.closest(".kanban-card");
    const popup = card.querySelector(".card-details-popup");
    popup.classList.remove("hidden");
  }

  if (e.target.classList.contains("close-popup")) {
    const popup = e.target.closest(".card-details-popup");
    popup.classList.add("hidden");
  }
});

/* -------------------------
   Escape HTML
------------------------- */
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
