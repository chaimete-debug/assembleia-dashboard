window.UI = (() => {
  const colorMap = {
    blue: {
      badge: "bg-blue-700 text-white",
      subtitle: "text-blue-700",
      card: "border-blue-200 bg-blue-50",
      progressBg: "bg-blue-100",
      progressBar: "bg-blue-700",
      range: "text-blue-800"
    },
    amber: {
      badge: "bg-amber-500 text-white",
      subtitle: "text-amber-700",
      card: "border-amber-200 bg-amber-50",
      progressBg: "bg-amber-100",
      progressBar: "bg-amber-500",
      range: "text-amber-800"
    },
    rose: {
      badge: "bg-rose-600 text-white",
      subtitle: "text-rose-700",
      card: "border-rose-200 bg-rose-50",
      progressBg: "bg-rose-100",
      progressBar: "bg-rose-600",
      range: "text-rose-800"
    },
    emerald: {
      badge: "bg-emerald-600 text-white",
      subtitle: "text-emerald-700",
      card: "border-emerald-200 bg-emerald-50",
      progressBg: "bg-emerald-100",
      progressBar: "bg-emerald-600",
      range: "text-emerald-800"
    },
    slate: {
      badge: "bg-slate-800 text-white",
      subtitle: "text-slate-700",
      card: "border-slate-300 bg-slate-50",
      progressBg: "bg-slate-200",
      progressBar: "bg-slate-800",
      range: "text-slate-800"
    }
  };

  function shellHtml() {
    return `
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-700 to-slate-800 text-white p-6 md:p-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p class="uppercase tracking-[0.2em] text-xs md:text-sm text-blue-100">Manual 2023 (PT-PT)</p>
              <h1 class="text-2xl md:text-4xl font-extrabold mt-2">Guia da Assembleia Distrital</h1>
              <p class="text-base md:text-lg mt-2 text-slate-100">Igreja do Nazareno · Distrito da Matola</p>
              <p class="text-sm md:text-base mt-1 text-slate-200">Da Igreja Local até ao Dia da Assembleia</p>
            </div>
            <div class="grid grid-cols-2 gap-3 text-sm max-w-sm">
              <div class="bg-white/10 rounded-2xl p-3 backdrop-blur">
                <div class="font-semibold">5 Fases</div>
                <div class="text-slate-200 text-xs mt-1">Fluxo completo</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-3 backdrop-blur">
                <div class="font-semibold">28ª Assembleia Distrital</div>
                <div class="text-slate-200 text-xs mt-1">Planeamento distrital</div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 md:p-6 bg-slate-50 border-b border-slate-200">
          <div class="grid lg:grid-cols-[1.2fr_1fr_1fr] gap-4 mb-4">
            <div id="riskBanner" class="hidden lg:col-span-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-800">
              <div class="font-bold">Risco operacional</div>
              <div id="riskBannerText" class="text-sm mt-1">Existem tarefas críticas pendentes.</div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-4">
              <label class="text-xs uppercase tracking-wide text-slate-500 block mb-2">Data da Assembleia Distrital</label>
              <input id="assemblyDate" type="date" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <p class="text-xs text-slate-500 mt-2">Introduza a data oficial da assembleia para calcular automaticamente os prazos.</p>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">Início da janela de 90 dias</p>
              <h3 id="windowStartLabel" class="text-lg font-extrabold mt-1">—</h3>
              <p class="text-xs text-slate-500 mt-2">Marco inicial da contagem temporal do processo.</p>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">Dias restantes</p>
              <h3 id="daysRemainingLabel" class="text-lg font-extrabold mt-1">—</h3>
              <p id="timelineStatus" class="text-xs text-slate-500 mt-2">Defina a data da assembleia para activar a timeline.</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 items-center">
            <div id="viewTabs" class="inline-flex flex-wrap gap-2 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm">
              <button type="button" class="tab-btn cursor-pointer select-none bg-blue-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold border border-blue-700" data-view="all">Ver Tudo</button>
              <button type="button" class="tab-btn cursor-pointer select-none bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200" data-view="igreja">Igreja Local</button>
              <button type="button" class="tab-btn cursor-pointer select-none bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200" data-view="ministros">Pastores / Ministros</button>
              <button type="button" class="tab-btn cursor-pointer select-none bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200" data-view="sd">Superintendente</button>
              <button type="button" class="tab-btn cursor-pointer select-none bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200" data-view="juntas">Juntas</button>
              <button type="button" class="tab-btn cursor-pointer select-none bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200" data-view="day">Modo Dia</button>
            </div>
            <button type="button" id="resetDataBtn" class="cursor-pointer select-none bg-white hover:bg-red-50 text-red-700 rounded-2xl px-4 py-2.5 text-sm font-semibold border border-red-200">Limpar Dados</button>
          </div>
        </div>

        <div id="taskBoard" class="p-4 md:p-6 space-y-5"></div>
      </div>
    `;
  }

  function phaseCardHtml(phase, tasks, colorCfg) {
    return `
      <section class="phase-card rounded-3xl border ${colorCfg.card} overflow-hidden" data-phase="${phase.id}">
        <button class="phase-toggle w-full text-left p-5 md:p-6 flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <span class="${colorCfg.badge} text-xs font-bold px-3 py-1 rounded-full">${phase.code}</span>
              <span class="text-xs md:text-sm font-semibold ${colorCfg.subtitle}">${phase.subtitle}</span>
            </div>
            <h2 class="text-xl md:text-2xl font-extrabold mt-3">${phase.title}</h2>
            <p class="text-sm md:text-base text-slate-700 mt-1">${phase.description}</p>
            <p class="phase-date-range text-xs md:text-sm font-semibold ${colorCfg.range} mt-2">Datas calculadas automaticamente após definir a data da assembleia.</p>
            <div class="mt-4 max-w-md">
              <div class="w-full ${colorCfg.progressBg} h-2 rounded-full">
                <div class="progress-bar h-2 rounded-full ${colorCfg.progressBar}" style="width:0%"></div>
              </div>
              <p class="progress-label text-xs mt-2 ${colorCfg.subtitle} font-semibold">0% concluído</p>
            </div>
          </div>
          <span class="toggle-icon ${colorCfg.subtitle} text-sm font-bold mt-1">−</span>
        </button>

        <div class="phase-content px-5 md:px-6 pb-6">
          <div class="grid md:grid-cols-2 gap-4">
            ${tasks.join("")}
          </div>
        </div>
      </section>
    `;
  }

  function taskCardHtml(task, savedState, colorName) {
    const toneMap = {
      blue: "text-blue-700",
      amber: "text-amber-700",
      rose: "text-rose-700",
      emerald: "text-emerald-700",
      slate: "text-slate-800"
    };

    const hintToneMap = {
      blue: "text-blue-800",
      amber: "text-amber-800",
      rose: "text-rose-800",
      emerald: "text-emerald-800",
      slate: "text-slate-700"
    };

    return `
      <article class="task-card bg-white rounded-2xl border border-slate-200 p-4" data-task-id="${task.id}" data-groups="${task.groups.join(" ")}">
        <div class="text-sm font-bold ${toneMap[colorName]}">${task.id} ${task.title}</div>
        <div class="text-sm text-slate-500 mt-1">Responsável: ${task.owner}</div>
        <div class="task-date-hint text-xs font-semibold ${hintToneMap[colorName]} mt-2"></div>
        <div class="dependency-hint text-xs text-slate-500 mt-1"></div>
        <div class="mt-3 grid md:grid-cols-2 gap-2">
          <select class="status-select w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="pendente" ${savedState.status === "pendente" ? "selected" : ""}>Pendente</option>
            <option value="emcurso" ${savedState.status === "emcurso" ? "selected" : ""}>Em curso</option>
            <option value="concluido" ${savedState.status === "concluido" ? "selected" : ""}>Concluído</option>
          </select>
          <input class="date-input w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" type="date" value="${savedState.date || ""}" />
        </div>
        <textarea class="notes-input w-full mt-2 rounded-xl border border-slate-300 px-3 py-2 text-sm" rows="2" placeholder="Observações...">${savedState.notes || ""}</textarea>
      </article>
    `;
  }

  return {
    shellHtml,
    phaseCardHtml,
    taskCardHtml,
    colorMap
  };
})();
