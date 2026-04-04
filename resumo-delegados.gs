// ============================================================
// RESUMO DELEGADOS — Endpoint para o Dashboard Vercel
// ============================================================
// COMO INSTALAR:
//   1. Abrir o projecto Apps Script (o mesmo que já tem o código de importação Kobo)
//   2. Criar novo ficheiro → chamar "resumoDelegados"
//   3. Colar este código
//   4. Implementar → Gerir implementações → editar a implementação existente
//      OU criar nova: Tipo = Aplicação web, Executar como = Eu,
//      Acesso = Qualquer pessoa
//   5. Copiar o URL /exec e substituir o RESUMO_URL no index.html do GitHub
//
// COMO FUNCIONA:
//   O dashboard Vercel faz fetch(RESUMO_URL + "?action=resumoDelegados")
//   Este endpoint lê a sheet "Dados" e devolve os totais em JSON.
//   Assim os dados actualizam sempre que a sheet é actualizada pelo KoboToolbox.
// ============================================================

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;

  // Permitir chamadas CORS do Vercel
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    if (action === "resumoDelegados") {
      const resumo = _calcularResumoDelegados();
      output.setContent(JSON.stringify({ ok: true, resumo: resumo }));
    } else {
      output.setContent(JSON.stringify({ ok: false, error: "Acção desconhecida: " + action }));
    }
  } catch (err) {
    output.setContent(JSON.stringify({ ok: false, error: err.message }));
  }

  return output;
}

// ── Calcular totais a partir da sheet "Dados" ──────────────

function _calcularResumoDelegados() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Dados");

  if (!sheet) throw new Error('Sheet "Dados" não encontrada. Importe os dados primeiro.');

  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) throw new Error("Sem dados na sheet. Importe os dados do KoboToolbox primeiro.");

  let membrosIgrejas    = 0;
  let delegadosEleitos  = 0;
  let exOfficio         = 0;
  let suplentes         = 0;
  let totalSemSuplentes = 0;
  let totalGeral        = 0;
  let nIgrejas          = 0;

  // Cabeçalho na linha 0 — dados a partir da linha 1
  // Colunas (baseado no _escreverNaSheet do código de importação):
  //   0: Igreja
  //   1: Distrito
  //   2: Membros Igreja
  //   3: Membros Distrito
  //   4: Data Assembleia
  //   5: Delegados Eleitos
  //   6: Nº Ex Officio
  //   7: Nº Suplentes
  //   8: Total Sem Suplentes
  //   9: Total Geral

  rows.slice(1).forEach(r => {
    if (!r[0]) return; // ignorar linhas vazias
    nIgrejas++;
    membrosIgrejas    += Number(r[2]) || 0;
    delegadosEleitos  += Number(r[5]) || 0;
    exOfficio         += Number(r[6]) || 0;
    suplentes         += Number(r[7]) || 0;
    totalSemSuplentes += Number(r[8]) || 0;
    totalGeral        += Number(r[9]) || 0;
  });

  return {
    nIgrejas,
    membrosIgrejas,
    delegadosEleitos,
    exOfficio,
    suplentes,
    totalSemSuplentes,
    totalGeral,
    ultimaActualizacao: new Date().toLocaleString("pt-PT", {
      timeZone: "Africa/Maputo",
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })
  };
}

// ── Testar localmente no Apps Script ──────────────────────
// Execute esta função para ver o JSON que seria devolvido ao Vercel

function testarEndpoint() {
  try {
    const resumo = _calcularResumoDelegados();
    Logger.log(JSON.stringify(resumo, null, 2));
    SpreadsheetApp.getUi().alert(
      "Dados calculados com sucesso:\n\n" +
      "Igrejas: " + resumo.nIgrejas + "\n" +
      "Membros: " + resumo.membrosIgrejas + "\n" +
      "Eleitos: " + resumo.delegadosEleitos + "\n" +
      "Ex Officio: " + resumo.exOfficio + "\n" +
      "Suplentes: " + resumo.suplentes + "\n" +
      "Total sem Suplentes: " + resumo.totalSemSuplentes + "\n" +
      "Total Geral: " + resumo.totalGeral
    );
  } catch(e) {
    SpreadsheetApp.getUi().alert("Erro: " + e.message);
  }
}
