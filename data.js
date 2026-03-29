window.APP_DATA = {
  phases: {
    "1": {
      code: "FASE 1",
      title: "Preparação na Igreja Local",
      subtitle: "Até 90 dias antes da Assembleia",
      description: "Encerramento do ano estatístico, contas, comissão local e relatório anual do pastor.",
      color: "blue",
      icon: "🏛️"
    },
    "2": {
      code: "FASE 2",
      title: "Reunião Anual da Igreja Local",
      subtitle: "Dentro de 90 dias antes da Assembleia Distrital",
      description: "Convocação, apresentação de relatórios e eleição de oficiais e delegados.",
      color: "amber",
      icon: "📋"
    },
    "3": {
      code: "FASE 3",
      title: "Preparação Ministerial Individual",
      subtitle: "Pastores, ordenados e licenciados",
      description: "Relatórios ministeriais, ordenação e renovação de licenças.",
      color: "rose",
      icon: "✝️"
    },
    "4": {
      code: "FASE 4",
      title: "Organização Distrital Pré-Assembleia",
      subtitle: "Superintendente Distrital + Junta Consultiva",
      description: "Logística, comissões de apoio, documentação, credenciação e preparação final da assembleia.",
      color: "emerald",
      icon: "⚙️"
    },
    "5": {
      code: "FASE 5",
      title: "O Dia da Assembleia Distrital",
      subtitle: "Dia da Assembleia",
      description: "Fluxo operativo do dia: abertura, registo, apresentação de relatórios, eleições e encerramento.",
      color: "slate",
      icon: "🎯"
    }
  },

  tasks: [
    { id: "1.1", phase: "1", title: "Encerramento do Ano Estatístico", owner: "Pastor + Secretário", groups: ["igreja","ministros"], startOffset: -90, endOffset: -85, label: "Executar entre", priority: "media" },
    { id: "1.2", phase: "1", title: "Nomeação da Comissão de Recomendações Local", owner: "Pastor", groups: ["igreja","ministros"], startOffset: -84, endOffset: -80, label: "Executar entre", priority: "media" },
    { id: "1.3", phase: "1", title: "Auditoria / Revisão das Contas", owner: "Junta da Igreja / Comissão de Auditoria", groups: ["igreja","juntas"], startOffset: -79, endOffset: -70, label: "Executar entre", priority: "media" },
    { id: "1.4", phase: "1", title: "Preparação do Relatório Anual do Pastor (RAP)", owner: "Pastor + Secretário + Tesoureiro", groups: ["igreja","ministros"], startOffset: -69, endOffset: -61, label: "Executar entre", priority: "media" },

    { id: "2.1", phase: "2", title: "Convocação e Anúncio da Reunião Anual", owner: "Pastor", groups: ["igreja","ministros"], startOffset: -60, endOffset: -50, label: "Executar entre", priority: "media" },
    { id: "2.2", phase: "2", title: "Apresentação de Relatórios na Reunião Anual", owner: "Pastor + Líderes Locais", groups: ["igreja","ministros"], startOffset: -49, endOffset: -40, label: "Executar entre", priority: "media" },
    { id: "2.3", phase: "2", title: "Eleição de Oficiais, Juntas, Mordomos e Ecónomos", owner: "Membros da Igreja (voto por cédula)", groups: ["igreja"], startOffset: -39, endOffset: -30, label: "Executar entre", priority: "media" },
    { id: "2.4", phase: "2", title: "Eleição de Delegados à Assembleia Distrital", owner: "Membros da Igreja (voto por cédula)", groups: ["igreja"], startOffset: -39, endOffset: -30, label: "Executar entre", priority: "media" },
    { id: "2.5", phase: "2", title: "Certificado de Eleição e Formulários Distritais", owner: "Secretário da Igreja", groups: ["igreja"], startOffset: -29, endOffset: -20, label: "Executar entre", priority: "media" },

    { id: "3.1", phase: "3", title: "Relatório Anual dos Ministros Ordenados e Licenciados", owner: "Cada Ministro", groups: ["ministros"], startOffset: -75, endOffset: -35, label: "Executar entre", priority: "media" },
    { id: "3.2", phase: "3", title: "Candidatos à Ordenação e Renovação de Licenças", owner: "Candidatos + Junta de Estudos / Credenciais", groups: ["ministros","juntas"], startOffset: -60, endOffset: -20, label: "Executar entre", priority: "media" },

    { id: "4.1", phase: "4", title: "Fixação da Data, Local e Logística", owner: "Superintendente Geral + Junta Consultiva", groups: ["sd","juntas"], startOffset: -60, endOffset: -52, label: "Executar entre", priority: "alta" },
    { id: "4.2", phase: "4", title: "Nomeação da Comissão de Logística", owner: "Superintendente Distrital + Junta Consultiva", groups: ["sd","juntas"], startOffset: -51, endOffset: -46, label: "Executar entre", priority: "media" },
    { id: "4.3", phase: "4", title: "Criação das Comissões de Contagem de Votos", owner: "Superintendente Distrital + Junta Consultiva", groups: ["sd","juntas"], startOffset: -45, endOffset: -40, label: "Executar entre", priority: "alta" },
    { id: "4.4", phase: "4", title: "Revisão da Documentação", owner: "Secretário Distrital", groups: ["sd"], startOffset: -39, endOffset: -33, label: "Executar entre", priority: "alta" },
    { id: "4.5", phase: "4", title: "Comissão de Credenciais", owner: "Junta designada + Secretaria Distrital", groups: ["juntas"], startOffset: -32, endOffset: -26, label: "Executar entre", priority: "alta" },
    { id: "4.6", phase: "4", title: "Comissão de Recepção e Acolhimento", owner: "Equipa de apoio distrital", groups: ["juntas"], startOffset: -25, endOffset: -20, label: "Executar entre", priority: "baixa" },
    { id: "4.7", phase: "4", title: "Comissão de Protocolo e Ordem", owner: "Equipa de protocolo", groups: ["juntas"], startOffset: -19, endOffset: -14, label: "Executar entre", priority: "media" },
    { id: "4.8", phase: "4", title: "Comissão de Som e Equipamentos", owner: "Equipa técnica", groups: ["juntas"], startOffset: -13, endOffset: -9, label: "Executar entre", priority: "media" },
    { id: "4.9", phase: "4", title: "Comissão de Alimentação", owner: "Equipa designada", groups: ["juntas"], startOffset: -8, endOffset: -5, label: "Executar entre", priority: "baixa" },
    { id: "4.10", phase: "4", title: "Comissão de Segurança", owner: "Equipa de segurança", groups: ["juntas"], startOffset: -4, endOffset: -1, label: "Executar entre", priority: "baixa" },

    { id: "5.1", phase: "5", title: "Abertura e Culto de Inauguração", owner: "Oficial que preside", groups: ["sd"], startOffset: 0, endOffset: 0, label: "Executar em", priority: "media" },
    { id: "5.2", phase: "5", title: "Registo de Delegados e Credenciais", owner: "Secretário Distrital", groups: ["sd"], startOffset: 0, endOffset: 0, label: "Executar em", priority: "media" },
    { id: "5.3", phase: "5", title: "Apresentação de Relatórios", owner: "Mesa + Relatores", groups: ["sd","ministros"], startOffset: 0, endOffset: 0, label: "Executar em", priority: "media" },
    { id: "5.4", phase: "5", title: "Eleições", owner: "Assembleia + Comissão de Contagem de Votos", groups: ["juntas"], startOffset: 0, endOffset: 0, label: "Executar em", priority: "media" },
    { id: "5.5", phase: "5", title: "Encerramento, Jornal e Arquivamento", owner: "Secretário Distrital + Mesa", groups: ["sd"], startOffset: 0, endOffset: 1, label: "Executar entre", priority: "media" }
  ],

  dependencies: {
    "2.5": ["2.3", "2.4"],
    "4.4": ["2.5", "3.1"],
    "4.5": ["2.5", "3.2"],
    "5.2": ["4.5"],
    "5.3": ["4.4"],
    "5.4": ["4.3", "5.2"],
    "5.5": ["5.3", "5.4"]
  }
};
