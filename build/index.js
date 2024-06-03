"use strict";
let listElement = document.querySelector("#app ul");
let inputElement = document.querySelector("#app input");
let buttonElement = document.querySelector("#app button");
let filterElement = document.querySelector("#app select");
let listaSalva = localStorage.getItem("@listagem_tarefas");
let tarefas = listaSalva !== null ? JSON.parse(listaSalva) : [];
function listarTarefas(filtro = "todas") {
    listElement.innerHTML = "";
    tarefas.map((item, index) => {
        if (filtro === "concluidas" && !item.concluida)
            return;
        if (filtro === "naoConcluidas" && item.concluida)
            return;
        let todoElement = document.createElement("li");
        let tarefaText = document.createElement("span");
        tarefaText.textContent = item.texto;
        if (item.concluida) {
            tarefaText.style.textDecoration = "line-through";
        }
        let actionLinks = document.createElement("div");
        actionLinks.classList.add("action-links");
        let linkExcluirElement = document.createElement("a");
        linkExcluirElement.setAttribute("href", "#");
        linkExcluirElement.addEventListener("click", () => {
            deletarTarefa(index);
        });
        linkExcluirElement.textContent = "Excluir";
        let linkConcluirElement = document.createElement("a");
        linkConcluirElement.setAttribute("href", "#");
        linkConcluirElement.addEventListener("click", () => {
            concluirTarefa(index);
        });
        linkConcluirElement.textContent = item.concluida ? "Desmarcar" : "Concluir";
        actionLinks.appendChild(linkExcluirElement);
        actionLinks.appendChild(linkConcluirElement);
        let selectPrioridadeElement = document.createElement("select");
        selectPrioridadeElement.addEventListener("change", () => {
            definirPrioridade(index, selectPrioridadeElement.value);
        });
        ["alta", "média", "baixa"].forEach(prioridade => {
            let optionElement = document.createElement("option");
            optionElement.value = prioridade;
            optionElement.text = prioridade.charAt(0).toUpperCase() + prioridade.slice(1);
            if (item.prioridade === prioridade) {
                optionElement.selected = true;
            }
            selectPrioridadeElement.appendChild(optionElement);
        });
        todoElement.appendChild(tarefaText);
        todoElement.appendChild(selectPrioridadeElement);
        todoElement.appendChild(actionLinks);
        listElement.appendChild(todoElement);
    });
}
listarTarefas();
function adicionarTarefa() {
    if (inputElement.value === "") {
        alert("Digite alguma tarefa!");
        return false;
    }
    else {
        let tarefaDigitada = { texto: inputElement.value, concluida: false, prioridade: "baixa" };
        tarefas.push(tarefaDigitada);
        inputElement.value = "";
        listarTarefas();
        salvarDados();
    }
}
buttonElement.onclick = adicionarTarefa;
function deletarTarefa(posicao) {
    tarefas.splice(posicao, 1);
    listarTarefas();
    salvarDados();
}
function concluirTarefa(posicao) {
    tarefas[posicao].concluida = !tarefas[posicao].concluida;
    listarTarefas();
    salvarDados();
}
function salvarDados() {
    localStorage.setItem("@listagem_tarefas", JSON.stringify(tarefas));
}
filterElement.onchange = () => {
    listarTarefas(filterElement.value);
};
function definirPrioridade(index, novaPrioridade) {
    if (["alta", "média", "baixa"].includes(novaPrioridade.toLowerCase())) {
        tarefas[index].prioridade = novaPrioridade.toLowerCase();
        listarTarefas();
        salvarDados();
    }
    else {
        alert("Prioridade inválida! Use alta, média ou baixa.");
    }
}
