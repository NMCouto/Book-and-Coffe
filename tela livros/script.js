const API = "http://localhost:3000/livros";

let idEditando = null;
let listaLivros = [];

/* ---------------- FORMATAR DATA ---------------- */
function formatarDataISO(iso) {
    if (!iso) return "-";
    const [ano, mes, dia] = iso.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
}

/* ---------------- LISTAR ---------------- */
async function carregarLivros() {
    const resp = await fetch(API);
    listaLivros = await resp.json();
    renderizarTabela(listaLivros);
}

/* ---------------- RENDERIZAR ---------------- */
function renderizarTabela(dados) {
    const tbody = document.getElementById("tabela-livros");
    tbody.innerHTML = "";

    dados.forEach(l => {
        tbody.innerHTML += `
            <tr>
                <td>${l.isbn}</td>
                <td>${l.titulo}</td>
                <td>${l.genero}</td>
                <td>${l.autor}</td>
                <td>${l.editora}</td>
                <td>${l.volume ?? "-"}</td>
                <td>${l.data_lancamento ? formatarDataISO(l.data_lancamento) : "-"}</td>

                <td>
                    <button class="btn-edit" 
                        onclick="abrirPopup(
                            '${l._id}', '${l.titulo}', '${l.genero}', 
                            '${l.autor}', '${l.editora}', '${l.volume}', '${l.data_lancamento || ""}'
                        )">
                        Editar
                    </button>

                    <button class="btn-delete" onclick="deletarLivro('${l._id}')">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

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



/* ---------------- CRIAR ---------------- */
async function criarLivro() {
    // capturando os valores
    const isbn = document.getElementById("isbn").value.trim();
    const titulo = document.getElementById("titulo").value.trim();
    const genero = document.getElementById("genero").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const editora = document.getElementById("editora").value.trim();
    const volume = document.getElementById("volume").value.trim();
    const data_lancamento = document.getElementById("dataLanc").value.trim();

    // validação correta
    if (!isbn || !titulo || !genero || !autor || !editora || !data_lancamento) {
        mostrarToast("Preencha todos os campos", "erro");
        return;
    }

    const livro = {
        isbn,
        titulo,
        genero,
        autor,
        editora,
        volume,
        data_lancamento
    };

    try {
        const resp = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        });

        if (!resp.ok) {
            mostrarToast("Erro ao cadastrar livro!", "erro");
            return;
        }

        mostrarToast("Livro cadastrado com sucesso!", "sucesso");

        // recarregar tabela
        carregarLivros();

        // limpar inputs
        document.getElementById("isbn").value = "";
        document.getElementById("titulo").value = "";
        document.getElementById("genero").value = "";
        document.getElementById("autor").value = "";
        document.getElementById("editora").value = "";
        document.getElementById("volume").value = "";
        document.getElementById("dataLanc").value = "";

    } catch (e) {
        console.log(e);
        mostrarToast("Erro de conexão ao cadastrar livro!", "erro");
    }
}


/* ---------------- POPUP ---------------- */
function abrirPopup(id, titulo, genero, autor, editora, volume, lanc) {
    idEditando = id;

    document.getElementById("editTitulo").value = titulo;
    document.getElementById("editGenero").value = genero;
    document.getElementById("editAutor").value = autor;
    document.getElementById("editEditora").value = editora;
    document.getElementById("editVolume").value = volume;
    document.getElementById("editData").value = lanc.split("T")[0];

    document.querySelector(".overlay").style.display = "block";
    document.getElementById("popupEdit").style.display = "block";
}

/* ---------------- SALVAR EDIT ---------------- */
async function salvarEdicao() {
    const atualizado = {
        titulo: document.getElementById("editTitulo").value,
        genero: document.getElementById("editGenero").value,
        autor: document.getElementById("editAutor").value,
        editora: document.getElementById("editEditora").value,
        volume: document.getElementById("editVolume").value,
        data_lancamento: document.getElementById("editData").value
    };

    await fetch(`${API}/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizado)
    });

    fecharPopup();
    carregarLivros();
}

/* ---------------- DELETAR ---------------- */
async function deletarLivro(id) {
    if (!confirm("Deseja excluir?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    carregarLivros();
}

/* ---------------- FECHAR POPUP ---------------- */
function fecharPopup() {
    document.querySelector(".overlay").style.display = "none";
    document.getElementById("popupEdit").style.display = "none";
}

/* ---------------- FILTROS ---------------- */
/*function filtrarLivros() {
    const tituloFiltro = document.getElementById("pesquisaTitulo").value.toLowerCase();
    const isbnFiltro = document.getElementById("pesquisaISBN").value.toLowerCase();

    const filtrados = listaLivros.filter(l => {
        const titulo = l.titulo.toLowerCase();
        const isbn = l.isbn.toLowerCase();

        return (
            (tituloFiltro === "" || titulo.includes(tituloFiltro)) &&
            (isbnFiltro === "" || isbn.includes(isbnFiltro))
        );
    });

    renderizarTabela(filtrados);
}*/

function filtrarLivros() {
    const filtroTitulo = document.getElementById("pesquisaTitulo").value.toLowerCase();
    const filtroISBN = document.getElementById("pesquisaISBN").value.trim();
    const filtroAutor = document.getElementById("pesquisaAutor").value.toLowerCase();
    const filtroEditora = document.getElementById("pesquisaEditora").value.toLowerCase();

    const linhas = document.querySelectorAll("#tabela-livros tr");

    linhas.forEach(linha => {
        const titulo = linha.querySelector("td:nth-child(2)")?.textContent.toLowerCase();
        const isbn = linha.querySelector("td:nth-child(1)")?.textContent.trim();
        const autor = linha.querySelector("td:nth-child(4)")?.textContent.toLowerCase();
        const editora = linha.querySelector("td:nth-child(5)")?.textContent.toLowerCase();

        let mostrar = true;

        if (filtroTitulo !== "" && !titulo.includes(filtroTitulo)) mostrar = false;
        if (filtroISBN !== "" && !isbn.includes(filtroISBN)) mostrar = false;
        if (filtroAutor !== "" && !autor.includes(filtroAutor)) mostrar = false;
        if (filtroEditora !== "" && !editora.includes(filtroEditora)) mostrar = false;

        linha.style.display = mostrar ? "" : "none";
    });
}



/* ---------------- ORDENAR ---------------- */
function ordenarLivros(tipo) {
    let lista = [...listaLivros];

    switch (tipo) {

        case "titulo-asc":
            lista.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;

        case "titulo-desc":
            lista.sort((a, b) => b.titulo.localeCompare(a.titulo));
            break;

        case "autor-asc":
            lista.sort((a, b) => a.autor.localeCompare(b.autor));
            break;

        case "autor-desc":
            lista.sort((a, b) => b.autor.localeCompare(a.autor));
            break;

        case "genero-asc":
            lista.sort((a, b) => a.genero.localeCompare(b.genero));
            break;

        case "genero-desc":
            lista.sort((a, b) => b.genero.localeCompare(a.genero));
            break;

        case "data-recente":
            lista.sort((a, b) => new Date(b.data_lancamento) - new Date(a.data_lancamento));
            break;

        case "data-antiga":
            lista.sort((a, b) => new Date(a.data_lancamento) - new Date(b.data_lancamento));
            break;
    }

    renderizarTabela(lista);
    filtrarLivros(); // mantém filtros ativos
}



carregarLivros();
