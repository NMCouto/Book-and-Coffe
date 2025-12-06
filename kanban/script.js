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

document.addEventListener("DOMContentLoaded", carregarCards);

async function carregarCards() {
    const resp = await fetch("http://localhost:3000/cards");
    const cards = await resp.json();

    cards.forEach(c => criarCardHTML(c));
}

function criarCardHTML(card) {
    const coluna = document.querySelector(`.kanban-column[data-id="${card.columnId}"] .kanban-cards`);

    const div = document.createElement("div");
    div.classList.add("kanban-card");
    div.setAttribute("draggable", "true");
    div.dataset.id = card._id;

    div.innerHTML = `
        <div class="badge ${card.priority}">
            <span>${card.priority}</span>
        </div>

        <p class="card-title">${card.title}</p>

        <div class="card-infos">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn" data-id="${card._id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    coluna.appendChild(div);
}

async function criarCardNoBanco(cardData) {
    const resp = await fetch("http://localhost:3000/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData)
    });

    return await resp.json();
}

const data = {
    title,
    comment,
    priority,
    columnId
};

const novoCard = await criarCardNoBanco(data);
criarCardHTML(novoCard);

document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;

    const id = btn.dataset.id;

    await fetch(`http://localhost:3000/cards/${id}`, {
        method: "DELETE"
    });

    btn.closest(".kanban-card").remove();
});

async function moverCard(id, novaColuna) {
    await fetch(`http://localhost:3000/cards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId: novaColuna })
    });
}

moverCard(card.dataset.id, colunaDestino);





/*/SERVE PARA CRIAR UM CARD NOVO 
document.getElementById("addTaskBtn").addEventListener("click", () => {
  const title = document.getElementById("taskTitle").value.trim();
  const columnId = document.getElementById("taskColumn").value;
  const comment = document.getElementById("taskComment").value.trim();
  const prioridade = document.getElementById("priority").value;

  if (!title) {
    alert("Digite o título da tarefa.");
    return;
  }

  let prioridade2 = "";
  let prioridade3 = "";
  if(prioridade === 1){
    prioridade2 = "badge low";
    prioridade3 = "Baixa";
  }else if(prioridade === 2){
    prioridade2 = "badge medium";
    prioridade3 = "Média";
  }else if(prioridade === 3){
    prioridade2 = "badge high";
    prioridade3 = "Alta";
  }

  const card = document.createElement("div");
  card.classList.add("kanban-card");
  card.setAttribute("draggable", "true");
  card.innerHTML = `
    <div class="${prioridade2}"><span> ${prioridade3}</span></div>
    <p class="card-title">${title}</p>
    <div class="card-infos">
      <div class="card-icons">
        <button class="details-btn">
          <p><i class="fa-regular fa-comment"></i></p>
        </button>
      </div>
      <div class="user">
        <button class="edit-btn">
          <i class="fa-solid fa-pen"></i>
        </button>                     
        <button class="delete-btn">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>

      <div class="card-details-popup hidden">
        <div class="details-content">
          <h3>Detalhes</h3>
          <p class="details-text">${comment}</p>
          <button class="close-popup">Fechar</button>
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
*/

//CARREGA OS EMPRESTIMOS DO DIA DO BANCO DE DADOS 
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

//INSERE ESSES DADOS NO HTML NA COLUNA DE DEVOLUÇÕES
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

//ADICIONA O BOTÃO DE APAGAR OS CARDS 
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-btn");  

    if (btn) {
        const card = btn.closest(".kanban-card");
        card.remove();
        //ADICIONAR UMA LOGICA MELHOR PARA DE FATO APAGAR DO BANCO DE DADOS AO SER APAGAO
        //APARECER UM POP UP ANTES PERGUNTANDO SE REALMENTE DESEJA APAGAR ESSE CARD 
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

// --- Abrir / criar popup de detalhes por clique no ícone de comentário ---
document.addEventListener("click", (e) => {
  // detecta clique no ícone <i class="fa-...-comment"> ou em um botão .details-btn
  const commentTrigger = e.target.closest("i.fa-comment, i.fa-regular.fa-comment, .details-btn, .card-icons p");

  if (!commentTrigger) return;

  // achar o card
  const card = commentTrigger.closest(".kanban-card");
  if (!card) return;

  // se não existir popup dentro do card, cria um (para evitar null)
  let popup = card.querySelector(".card-details-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.className = "card-details-popup hidden";
    popup.innerHTML = `
      <div class="details-content">
        <h3>Detalhes</h3>
        <p class="details-text">Nenhum detalhe ainda...</p>
        <button class="close-popup">Fechar</button>
      </div>
    `;
    card.appendChild(popup);
  }

  // mostra o popup (remove a classe hidden com segurança)
  popup.classList.remove("hidden");
});

// --- Fechar popup quando clicar no botão .close-popup ---
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-popup")) {
    const popup = e.target.closest(".card-details-popup");
    if (popup) popup.classList.add("hidden");
  }
});

// opcional: fechar popup se clicar fora do conteúdo (clicando no overlay do próprio popup)
// como o popup está dentro do card (não é overlay global), identificamos clique direto na div .card-details-popup
document.addEventListener("click", (e) => {
  const popup = e.target.closest(".card-details-popup");
  if (popup && e.target === popup) {
    popup.classList.add("hidden");
  }
});

//ADICIONAR UM BOTÃO DE PERMITE APAGAR TODOS OS CARDS DE UMA VEZ E APARECER UM POPUP PERGUNTA SE REALMENTE DESEJA APAGAR TUDO
//TUDO TAMBÉM SERIA APAGADO DO BANCO DE DADOS 








