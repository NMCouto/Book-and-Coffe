// -------------------------
// script.js (com edição via popup + prioridade editável)
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

function mapPriorityLabel(cl) {
  if (cl === "low") return "baixa";
  if (cl === "medium") return "média";
  if (cl === "high") return "alta";
  return "";
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

//Função para o funcionamento do Toast 
function mostrarToast(mensagem, tipo = "sucesso") {
    // garante que exista o container (caso o HTML não o tenha ou esteja depois do script)
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast " + (tipo === "erro" ? "erro" : "sucesso");

    // opcional: ícone
    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.innerHTML = tipo === "erro" ? "&#10060;" : "&#10004;"; // ✖ ou ✔
    icon.setAttribute("aria-hidden", "true");

    const text = document.createElement("div");
    text.className = "toast-text";
    text.textContent = mensagem;

    toast.appendChild(icon);
    toast.appendChild(text);

    container.appendChild(toast);

    // Força reflow para ativar animação CSS
    // eslint-disable-next-line no-unused-expressions
    toast.offsetHeight;
    toast.classList.add("show");

    // remover após 4s (ou se o usuário clicar)
    const remover = () => {
        toast.classList.remove("show");
        // aguarda transição para remover do DOM
        setTimeout(() => toast.remove(), 350);
    };

    const timer = setTimeout(remover, 4000);

    toast.addEventListener("click", () => {
        clearTimeout(timer);
        remover();
    });
}

/* -------------------------
   API
------------------------- */
async function criarCardNoBanco(cardData) {
  const resp = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cardData),
  });
  if (!resp.ok) {
    //throw new Error(`POST ${resp.status}`)
    mostrarToast("Não foi possível adicionar o Card ", "erro");
  };

  mostrarToast("Card Acionado","sucesso");
  return await resp.json();
}

async function buscarCardsNoBanco() {
  const resp = await fetch(API_BASE);
  if (!resp.ok) throw new Error(`GET ${resp.status}`);
  return await resp.json();
}

async function deletarCardNoBanco(id) {
  const resp = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!resp.ok){
    mostrarToast("Não foi possível Apagar o Card","erro");
    throw new Error(`DELETE ${resp.status}`);
  }

  mostrarToast("Card Deletado","sucesso");
    
  return await resp.json();
}

async function atualizarCardNoBanco(id, body) {
  const resp = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok){
    mostrarToast("Não foi possível atualizar o Card","erro");
    throw new Error(`PUT ${resp.status}`);
  }

  mostrarToast("Card Atualizado","sucesso");
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

  div.innerHTML = `
      <div class="badge ${card.priority}">
        <select class="priority-select">
            <option value="low" ${card.priority === "low" ? "selected" : ""}>Baixa</option>
            <option value="medium" ${card.priority === "medium" ? "selected" : ""}>Média</option>
            <option value="high" ${card.priority === "high" ? "selected" : ""}>Alta</option>
        </select>
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

  /* Drag */
  div.addEventListener("dragstart", () => div.classList.add("dragging"));
  div.addEventListener("dragend", () => div.classList.remove("dragging"));

  coluna.appendChild(div);
}

/* -------------------------
   ALTERAR PRIORIDADE (NOVO!)
------------------------- */
document.addEventListener("change", async (e) => {
  if (!e.target.classList.contains("priority-select")) return;

  const select = e.target;
  const card = select.closest(".kanban-card");
  const id = card.dataset.id;

  const novaPrioridade = select.value;

  try {
    await atualizarCardNoBanco(id, { priority: novaPrioridade });

    const badge = select.closest(".badge");
    badge.className = "badge " + novaPrioridade;

  } catch (err) {
    console.error("Erro ao atualizar prioridade:", err);
  }
});

/* -------------------------
   Criar novo card
------------------------- */
document.getElementById("addTaskBtn").addEventListener("click", async () => {
  const title = document.getElementById("taskTitle").value.trim();
  const comment = document.getElementById("taskComment").value.trim();
  const columnId = document.getElementById("taskColumn").value;
  const priority = mapPriorityValue(document.getElementById("priority").value);

  if (!title) {
    mostrarToast("Preencha o Título","erro");
    return;
  }
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
   EDITAR TÍTULO + COMENTÁRIO
------------------------- */
document.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  if (!editBtn) return;

  const card = editBtn.closest(".kanban-card");
  const id = card.dataset.id;

  const currentTitle = card.querySelector(".card-title").textContent;
  const currentComment = card.querySelector(".details-text").textContent;

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

/* ------------------------- Carrega empréstimos para devolução HOJE ------------------------- */
async function carregarDevolucoesHoje() {
    try {
        const resp = await fetch("http://localhost:3000/emprestimos/devolucaoHoje");
        if (!resp.ok) throw new Error("Resposta inválida");

        const emprestimos = await resp.json();

        // Seleciona coluna de devoluções
        const coluna = document.querySelector('.kanban-column[data-id="1"] .kanban-cards');
        if (!coluna) return;

        // NÃO limpa — mantém conteúdo existente
        // coluna.innerHTML = coluna.innerHTML; (removido porque não faz nada)

        emprestimos.forEach(e => criarCardDevolucao(e, false));

    } catch (err) {
        console.error("Erro ao carregar devoluções de hoje:", err);
    }
}


/* ------------------------- Carrega empréstimos ATRASADOS ------------------------- */
async function carregarAtrasados() {
    try {
        const resp = await fetch("http://localhost:3000/emprestimos");
        if (!resp.ok) throw new Error("Resposta inválida");

        const emprestimos = await resp.json();
        const hoje = new Date();
        hoje.setHours(0,0,0,0);

        const atrasados = emprestimos.filter(e => {
            if (e.status !== "Atrasado") return false;

            return e;
        });

        atrasados.forEach(e => criarCardDevolucao(e, true));

    } catch (err) {
        console.error("Erro ao carregar atrasados:", err);
    }
}


/* ------------------------- Cria o card de devolução ------------------------- */
function criarCardDevolucao(emprestimo, atrasado = false) {

    const coluna = document.querySelector('.kanban-column[data-id="1"] .kanban-cards');
    if (!coluna) return;

    const card = document.createElement("div");
    card.classList.add("kanban-card");
    card.setAttribute("draggable", "true");

    const badgeClass = atrasado ? "high" : "normal";
    const badgeText = atrasado ? "Atrasado" : "Devolver hoje";

    const dataDev = emprestimo.data_devolucao
        ? new Date(emprestimo.data_devolucao).toLocaleDateString("pt-BR")
        : "-";

    card.innerHTML = `
        <div class="badge ${badgeClass}">
            <span>${badgeText}</span>
        </div>

        <p class="card-title">${escapeHtml(emprestimo.titulo || "—")}</p>

        <div class="cards">
            <div class="card-icons">  
                <p><i class="fa-regular fa-calendar"></i> ${dataDev} </p>
            </div>
          
            <div class="card-meta">
                <p><i class="fa-solid fa-user"></i> CPF: 
                    ${escapeHtml(String(emprestimo.cpf_emprestimo || "-"))}
                </p>
            </div>
        </div>
    `;

    // Drag events
    card.addEventListener("dragstart", (e) =>
        e.currentTarget.classList.add("dragging"));

    card.addEventListener("dragend", (e) =>
        e.currentTarget.classList.remove("dragging"));

    coluna.appendChild(card);
}


/* ------------------------- Carregar cards atrasados (modo alternativo) ------------------------- */
async function carregarCards() {
    const resposta = await fetch(API_BASE);
    const emprestimos = await resposta.json();

    const container = document.getElementById("cardsDevolucoes");
    if (!container) return;

    container.innerHTML = ""; // limpa antes de recriar

    emprestimos
        .filter(emp => emp.status === "Atrasado")
        .forEach(emp => {
            const card = document.createElement("div");
            card.classList.add("card-atrasado");

            card.innerHTML = `
                <h3>${emp.titulo}</h3>

                <div class="info-row">
                    <span class="label">CPF:</span>
                    <span class="value">${emp.cpf_emprestimo}</span>
                </div>

                <div class="info-row">
                    <span class="label">Devolução:</span>
                    <span class="value">
                        ${new Date(emp.data_devolucao).toLocaleDateString("pt-BR")}
                    </span>
                </div>
            `;

            container.appendChild(card);
        });
}

// Chama tudo quando a página estiver pronta
document.addEventListener("DOMContentLoaded", () => {
    //carregarCards();          // Carrega cards gerais
    //carregarDevolucoesHoje(); // Carrega devoluções de hoje
    carregarAtrasados();      // Carrega entregas atrasadas
});

