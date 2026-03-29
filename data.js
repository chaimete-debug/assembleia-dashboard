window.APP_DATA = {
  phaseDateConfig: {
    "1": { startOffset: -90, endOffset: -61 },
    "2": { startOffset: -90, endOffset: -1 },
    "3": { startOffset: -75, endOffset: -15 },
    "4": { startOffset: -60, endOffset: -1 },
    "5": { startOffset: 0, endOffset: 0 }
  },

  tasks: [
    {
      id: "1.1",
      phase: "1",
      title: "Encerramento do Ano Estatístico",
      owner: "Pastor + Secretário",
      groups: ["igreja", "ministros"],
      startOffset: -90,
      endOffset: -85,
      priority: "media"
    },
    {
      id: "2.3",
      phase: "2",
      title: "Eleição de Oficiais, Juntas, Mordomos e Ecónomos",
      owner: "Membros da Igreja",
      groups: ["igreja"],
      startOffset: -39,
      endOffset: -30,
      priority: "media"
    },
    {
      id: "4.1",
      phase: "4",
      title: "Fixação da Data, Local e Logística",
      owner: "Superintendente Geral + Junta Consultiva",
      groups: ["sd", "juntas"],
      startOffset: -60,
      endOffset: -52,
      priority: "alta"
    },
    {
      id: "5.1",
      phase: "5",
      title: "Abertura e Culto de Inauguração",
      owner: "Oficial que preside",
      groups: ["sd"],
      startOffset: 0,
      endOffset: 0,
      priority: "media"
    }
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