// ============================================================
// DASHBOARD — Servir como WebApp com dados reais do Google Sheet
// ============================================================
// COMO USAR:
//   1. No Apps Script: Implementar → Nova implementação → WebApp
//   2. Executar como: "Eu" (ou conta de serviço)
//   3. Quem tem acesso: "Qualquer pessoa na organização" (ou "Qualquer pessoa")
//   4. Copiar o URL gerado e abrir no browser — os dados são sempre frescos.
//
// ACTUALIZAÇÃO DOS DADOS:
//   Sempre que abrir o URL do WebApp, o Apps Script:
//     1. Lê os dados actuais da sheet "Dados" (importados do KoboToolbox)
//     2. Injeta-os como JSON no HTML do dashboard
//     3. O card 2.6 mostra imediatamente os totais correctos
// ============================================================

function doGet(e) {
  const html  = HtmlService.createHtmlOutputFromFile("index");
  const dados = _lerDadosParaDashboard();
  const json  = JSON.stringify(dados);

  // Substituir o marcador no HTML pelos dados reais
  let conteudo = html.getContent();
  conteudo = conteudo.replace(
    "/*DADOS_KOBO_JSON*/null/*END_DADOS_KOBO*/",
    json
  );

  return HtmlService.createHtmlOutput(conteudo)
    .setTitle("Dashboard Assembleia Distrital")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── Ler e normalizar dados da sheet "Dados" ────────────────

function _lerDadosParaDashboard() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Dados");
  if (!sheet) return [];

  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];

  return rows.slice(1)
    .filter(r => r[0]) // ignorar linhas vazias
    .map((r, i) => ({
      id:              i + 1,
      igreja:          String(r[0] || "").trim(),
      distrito:        String(r[1] || "").trim(),
      membrosIgreja:   Number(r[2]) || 0,
      membrosDistrito: Number(r[3]) || 0,
      dataAssembleia:  r[4] ? Utilities.formatDate(new Date(r[4]), Session.getScriptTimeZone(), "yyyy-MM-dd") : "",
      eleitos:         Number(r[5]) || 0,   // Delegados Eleitos
      exofficio:       Number(r[6]) || 0,   // Nº Ex Officio
      suplentes:       Number(r[7]) || 0,   // Nº Suplentes
      totalSem:        Number(r[8]) || 0,   // Total Sem Suplentes
      totalGeral:      Number(r[9]) || 0,   // Total Geral
    }));
}

// ── Abrir o dashboard como sidebar (alternativa ao WebApp) ─

function abrirDashboard() {
  const dados    = _lerDadosParaDashboard();
  const json     = JSON.stringify(dados);
  const template = HtmlService.createHtmlOutputFromFile("index");

  let conteudo = template.getContent();
  conteudo = conteudo.replace(
    "/*DADOS_KOBO_JSON*/null/*END_DADOS_KOBO*/",
    json
  );

  const ui = HtmlService.createHtmlOutput(conteudo)
    .setWidth(1200)
    .setHeight(800)
    .setTitle("Dashboard Assembleia Distrital");

  SpreadsheetApp.getUi().showModalDialog(ui, "📊 Dashboard Assembleia Distrital");
}
