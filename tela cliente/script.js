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

/* -------- CRIAR NOVO CLIENTE -------- */
async function criarCliente() {
    const cpf = document.getElementById("cpf").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const nasc = document.getElementById("nasc").value.trim();
    const cep = document.getElementById("cep").value.trim();

    if (!cpf || !nome || !telefone || !nasc || !cep) {
        alert("Preencha todos os campos para cadastrar o cliente.");
        return;
    }

    const novo = {
        cpf: Number(cpf),
        nome,
        Telefone: telefone,
        DataNasc: nasc,
        CEP: cep,
    };

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo)
    });

    carregarClientes();
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
