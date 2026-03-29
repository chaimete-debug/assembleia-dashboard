const STORAGE_KEY = "assembleia_v10";

const fases = {
  fase1: [
    "Encerramento do Ano Estatístico",
    "Nomeação da Comissão de Recomendações",
    "Auditoria das Contas",
    "Preparação do RAP"
  ],
  fase2: [
    "Convocação da Reunião",
    "Apresentação de Relatórios",
    "Eleição de Oficiais, Juntas, Mordomos e Ecónomos",
    "Eleição de Delegados"
  ],
  fase3: [
    "Relatórios Ministeriais",
    "Processo de Ordenação"
  ],
  fase4: [
    "Definição de Data e Local",
    "Comissão de Logística",
    "Comissão de Credenciais",
    "Comissão de Votos",
    "Preparação de Delegados"
  ],
  fase5: [
    "Abertura",
    "Registo de Delegados",
    "Verificação de Quórum",
    "Encerramento"
  ]
};

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function calcularDatas() {
  const dateInput = document.getElementById("assemblyDate").value;
  if (!dateInput) return null;

  const assemblyDate = new Date(dateInput);

  return {
    fase1: new Date(assemblyDate.getTime() - 90 * 86400000),
    fase2: new Date(assemblyDate.getTime() - 60 * 86400000),
    fase3: new Date(assemblyDate.getTime() - 30 * 86400000),
    fase4: new Date(assemblyDate.getTime() - 15 * 86400000),
    fase5: assemblyDate
  };
}

function render(tab) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  const datas = calcularDatas();

  fases[tab].forEach((tarefa, i) => {
    const key = `${tab}_${i}`;
    if (!data[key]) data[key] = { status: "pendente", nota: "" };

    const div = document.createElement("div");
    div.className = "task";

    const dataTexto = datas ? datas[tab].toLocaleDateString() : "";

    div.innerHTML = `
      <b>${tarefa}</b><br>
      <small>Data: ${dataTexto}</small>

      <div class="status">
        <select onchange="updateStatus('${key}', this.value)">
          <option value="pendente" ${data[key].status=="pendente"?"selected":""}>Pendente</option>
          <option value="emcurso" ${data[key].status=="emcurso"?"selected":""}>Em Curso</option>
          <option value="concluida" ${data[key].status=="concluida"?"selected":""}>Concluída</option>
        </select>
      </div>

      <textarea placeholder="Notas..." 
        oninput="updateNota('${key}', this.value)">${data[key].nota}</textarea>
    `;

    content.appendChild(div);
  });
}

function updateStatus(key, value) {
  data[key].status = value;
  save();
}

function updateNota(key, value) {
  data[key].nota = value;
  save();
}

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");

    render(btn.dataset.tab);
  });
});

document.getElementById("assemblyDate").addEventListener("change", () => {
  render(document.querySelector(".tab.active").dataset.tab);
});

// INIT
render("fase1");
