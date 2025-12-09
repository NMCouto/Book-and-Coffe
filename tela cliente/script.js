const API = "http://localhost:3000/clientes";

let idEditando = null;

/* -------- FUNÇÃO PARA FORMATAR A DATA CORRETAMENTE -------- */
function formatarDataISO(isoString) {
    if (!isoString) return "-";

    // Pega apenas a parte YYYY-MM-DD
    const [ano, mes, dia] = isoString.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
}

/* -------- LISTAR CLIENTES -------- */
async function carregarClientes() {
    const resp = await fetch(API);
    const clientes = await resp.json();

    const tbody = document.getElementById("tabela-clientes");
    tbody.innerHTML = "";

    clientes.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.cpf}</td>
                <td>${c.nome}</td>
                <td>${c.Telefone}</td>
                <td>${c.DataNasc ? formatarDataISO(c.DataNasc) : "-"}</td>
                <td>${c.CEP || "-"}</td>
                <td>
                    <button class="btn-edit" onclick="abrirPopup('${c._id}', '${c.nome}', '${c.Telefone}', '${c.DataNasc || ""}', '${c.CEP || ""}')">Editar</button>
                    <button class="btn-delete" onclick="deletarCliente('${c._id}')">Excluir</button>
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

/* -------- CRIAR NOVO CLIENTE -------- */
async function criarCliente() {
    const cpf = document.getElementById("cpf").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const nasc = document.getElementById("nasc").value.trim();
    const cep = document.getElementById("cep").value.trim();

    if (!cpf || !nome || !telefone || !nasc || !cep) {
        mostrarToast("Preencha todos os Campos", "erro");
        return;
    }

    const novo = {
        cpf: Number(cpf),
        nome,
        Telefone: telefone,
        DataNasc: nasc,
        CEP: cep,
    };
    
    try{
        const resp = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novo)
        });
        
        if(!resp.ok){
            mostrarToast("Error ao cadastrar Cliente!","erro");
            return;
        }

        mostrarToast("Cliente cadastrado com Sucesso!","sucesso");

        carregarClientes();

        document.getElementById("cpf").value = "";
        document.getElementById("nome").value = "";
        document.getElementById("telefone").value = "";
        document.getElementById("nasc").value = "";
        document.getElementById("cep").value = "";

    } catch (e){
        mostrarToast("Erro de conexão ao cadastrar Cliente", "erro");
    }


}

/* -------- ABRIR POPUP DE EDIÇÃO -------- */
function abrirPopup(id, nome, tel, nasc, cep) {
    idEditando = id;

    document.getElementById("editNome").value = nome;
    document.getElementById("editTelefone").value = tel;
    document.getElementById("editNasc").value = nasc ? nasc.split("T")[0] : "";
    document.getElementById("editCep").value = cep;

    document.querySelector(".overlay").style.display = "block";
    document.getElementById("popupEdit").style.display = "block";
}

/* -------- SALVAR EDIÇÃO -------- */
async function salvarEdicao() {
    const nome = document.getElementById("editNome").value.trim();
    const telefone = document.getElementById("editTelefone").value.trim();
    const nasc = document.getElementById("editNasc").value.trim();
    const cep = document.getElementById("editCep").value.trim();

    if (!nome || !telefone || !nasc || !cep) {
        alert("Preencha todos os campos antes de salvar.");
        return;
    }

    const atualizado = {
        nome,
        Telefone: telefone,
        DataNasc: nasc,
        CEP: cep,
    };

    await fetch(`${API}/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizado)
    });

    fecharPopup();
    carregarClientes();
}

/* -------- EXCLUIR CLIENTE -------- */
async function deletarCliente(id) {
    if (!confirm("Deseja realmente excluir?")) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });
    carregarClientes();
}

/* -------- FECHAR POPUP -------- */
function fecharPopup() {
    document.querySelector(".overlay").style.display = "none";
    document.getElementById("popupEdit").style.display = "none";
}

carregarClientes();

function filtrarTabela() {
    const filtro = document.getElementById("pesquisaNome").value.toLowerCase();
    const linhas = document.querySelectorAll("#tabela-clientes tr");

    linhas.forEach(linha => {
        const nome = linha.querySelector("td:nth-child(2)")?.textContent.toLowerCase();

        if (nome && nome.includes(filtro)) {
            linha.style.display = "";
        } else {
            linha.style.display = "none";
        }
    });
}

/*function filtrarClientes() {
    const nomeFiltro = document.getElementById("pesquisaNome").value.toLowerCase();
    const cpfFiltro = document.getElementById("pesquisaCPF").value.toLowerCase();
    const linhas = document.querySelectorAll("#tabela-clientes tr");

    linhas.forEach(linha => {
        const cpf = linha.querySelector("td:nth-child(1)")?.textContent.toLowerCase() || "";
        const nome = linha.querySelector("td:nth-child(2)")?.textContent.toLowerCase() || "";

        let mostrar = true;

        // Se nome estiver preenchido → filtra por nome
        if (nomeFiltro !== "") {
            mostrar = nome.includes(nomeFiltro);
        }

        // Se CPF estiver preenchido → filtra por CPF também
        if (cpfFiltro !== "") {
            mostrar = mostrar && cpf.includes(cpfFiltro);
        }

        linha.style.display = mostrar ? "" : "none";
    });
}*/

function filtrarClientes() {
    const nomeFiltro = document.getElementById("pesquisaNome").value.toLowerCase();
    const cpfFiltro = document.getElementById("pesquisaCPF").value.toLowerCase();

    const linhas = document.querySelectorAll("#tabela-clientes tr");

    linhas.forEach(linha => {
        const cpf = linha.querySelector("td:nth-child(1)")?.textContent.toLowerCase() || "";
        const nome = linha.querySelector("td:nth-child(2)")?.textContent.toLowerCase() || "";

        let mostrar = true;

        if (nomeFiltro !== "") mostrar = nome.includes(nomeFiltro);
        if (cpfFiltro !== "") mostrar = mostrar && cpf.includes(cpfFiltro);

        linha.style.display = mostrar ? "" : "none";
    });
}


//Funções para que o filtro funcione 

let listaClientes = []; // << guardar clientes carregados

async function carregarClientes() {
    const resp = await fetch(API);
    listaClientes = await resp.json(); // << salva em memória

    renderizarTabela(listaClientes);
}

function renderizarTabela(dados) {
    const tbody = document.getElementById("tabela-clientes");
    tbody.innerHTML = "";

    dados.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.cpf}</td>
                <td>${c.nome}</td>
                <td>${c.Telefone}</td>
                <td>${c.DataNasc ? formatarDataISO(c.DataNasc) : "-"}</td>
                <td>${c.CEP || "-"}</td>
                <td>
                    <button class="btn-edit" onclick="abrirPopup('${c._id}', '${c.nome}', '${c.Telefone}', '${c.DataNasc || ""}', '${c.CEP || ""}')">Editar</button>
                    <button class="btn-delete" onclick="deletarCliente('${c._id}')">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function ordenarClientes(tipo) {
    let ordenado = [...listaClientes];

    switch (tipo) {
        case "nome-asc":
            ordenado.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        case "nome-desc":
            ordenado.sort((a, b) => b.nome.localeCompare(a.nome));
            break;
        case "nasc-recente":
            ordenado.sort((a, b) => new Date(b.DataNasc) - new Date(a.DataNasc));
            break;
        case "nasc-antiga":
            ordenado.sort((a, b) => new Date(a.DataNasc) - new Date(b.DataNasc));
            break;
    }

    renderizarTabela(ordenado);
    filtrarClientes(); // mantém os filtros ativos
}
