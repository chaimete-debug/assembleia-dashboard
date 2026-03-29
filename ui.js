window.UI = (() => {
  const colors = {
    blue: {
      card: "border-blue-200 bg-blue-50",
      badge: "bg-blue-700 text-white",
      subtitle: "text-blue-700",
      range: "text-blue-800",
      progressBg: "bg-blue-100",
      progressBar: "bg-blue-700",
      titleTone: "text-blue-700"
    },
    amber: {
      card: "border-amber-200 bg-amber-50",
      badge: "bg-amber-500 text-white",
      subtitle: "text-amber-700",
      range: "text-amber-800",
      progressBg: "bg-amber-100",
      progressBar: "bg-amber-500",
      titleTone: "text-amber-700"
    },
    rose: {
      card: "border-rose-200 bg-rose-50",
      badge: "bg-rose-600 text-white",
      subtitle: "text-rose-700",
      range: "text-rose-800",
      progressBg: "bg-rose-100",
      progressBar: "bg-rose-600",
      titleTone: "text-rose-700"
    },
    emerald: {
      card: "border-emerald-200 bg-emerald-50",
      badge: "bg-emerald-600 text-white",
      subtitle: "text-emerald-700",
      range: "text-emerald-800",
      progressBg: "bg-emerald-100",
      progressBar: "bg-emerald-600",
      titleTone: "text-emerald-700"
    },
    slate: {
      card: "border-slate-300 bg-slate-50",
      badge: "bg-slate-800 text-white",
      subtitle: "text-slate-700",
      range: "text-slate-800",
      progressBg: "bg-slate-200",
      progressBar: "bg-slate-800",
      titleTone: "text-slate-800"
    }
  };

  function shell() {
    return `
      <div class="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-700 to-slate-800 text-white p-4 sm:p-5 md:p-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div class="min-w-0">
              <p class="uppercase tracking-[0.18em] text-[10px] sm:text-xs md:text-sm text-blue-100">Manual 2023 (PT-PT)</p>
              <h1 class="text-xl sm:text-2xl md:text-4xl font-extrabold mt-2 leading-tight">
                Guia da Assembleia Distrital
              </h1>
              <p class="text-sm sm:text-base md:text-lg mt-2 text-slate-100">
                Igreja do Nazareno · Distrito da Matola
              </p>
              <p class="text-xs sm:text-sm md:text-base mt-1 text-slate-200">
                Da Igreja Local até ao Dia da Assembleia
              </p>
            </div>

            <div class="grid grid-cols-2 gap-2 sm:gap-3 w-full lg:w-auto lg:max-w-sm text-xs sm:text-sm">
              <div class="bg-white/10 rounded-2xl p-3 backdrop-blur">
                <div class="font-semibold">5 Fases</div>
                <div class="text-slate-200 text-[11px] sm:text-xs mt-1">Fluxo completo</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-3 backdrop-blur">
                <div class="font-semibold">28ª Assembleia Distrital</div>
                <div class="text-slate-200 text-[11px] sm:text-xs mt-1">Planeamento distrital</div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-3 sm:p-4 md:p-6 bg-slate-50 border-b border-slate-200">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr] gap-3 md:gap-4 mb-4">
            <div id="riskBanner" class="hidden sm:col-span-2 xl:col-span-3 rounded-2xl border border-red-300 bg-red-50 p-3 md:p-4 text-red-800">
              <div class="font-bold text-sm md:text-base">Risco operacional</div>
              <div id="riskBannerText" class="text-xs md:text-sm mt-1">Existem tarefas críticas pendentes.</div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-3 md:p-4">
              <label class="text-[11px] md:text-xs uppercase tracking-wide text-slate-500 block mb-2">
                Data da Assembleia Distrital
              </label>
              <input id="assemblyDate" type="date" class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
              <p class="text-[11px] md:text-xs text-slate-500 mt-2">
                Introduza a data oficial da assembleia para calcular automaticamente os prazos.
              </p>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-3 md:p-4">
              <p class="text-[11px] md:text-xs uppercase tracking-wide text-slate-500">
                Início da janela de 90 dias
              </p>
              <h3 id="windowStartLabel" class="text-base sm:text-lg font-extrabold mt-1 leading-tight">—</h3>
              <p class="text-[11px] md:text-xs text-slate-500 mt-2">
                Marco inicial da contagem temporal do processo.
              </p>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 sm:col-span-2 xl:col-span-1">
              <p class="text-[11px] md:text-xs uppercase tracking-wide text-slate-500">
                Dias restantes
              </p>
              <h3 id="daysRemainingLabel" class="text-base sm:text-lg font-extrabold mt-1 leading-tight">—</h3>
              <p id="timelineStatus" class="text-[11px] md:text-xs text-slate-500 mt-2 leading-snug">
                Defina a data da assembleia para activar a timeline.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 items-center">
            <div class="w-full overflow-x-auto no-scrollbar">
              <div id="viewTabs" class="inline-flex min-w-max gap-2 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm">
                <button type="button" class="tab-btn bg-blue-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold border border-blue-700 whitespace-nowrap" data-view="all" aria-selected="true">Ver Tudo</button>
                <button type="button" class="tab-btn bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200 whitespace-nowrap" data-view="igreja" aria-selected="false">Igreja Local</button>
                <button type="button" class="tab-btn bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200 whitespace-nowrap" data-view="ministros" aria-selected="false">Pastores / Ministros</button>
                <button type="button" class="tab-btn bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200 whitespace-nowrap" data-view="sd" aria-selected="false">Superintendente</button>
                <button type="button" class="tab-btn bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200 whitespace-nowrap" data-view="juntas" aria-selected="false">Juntas</button>
                <button type="button" class="tab-btn bg-white text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold border border-slate-200 whitespace-nowrap" data-view="day" aria-selected="false">Modo Dia</button>
              </div>
            </div>

            <button type="button" id="resetDataBtn" class="bg-white hover:bg-red-50 text-red-700 rounded-2xl px-4 py-2.5 text-sm font-semibold border border-red-200 w-full sm:w-auto">
              Limpar Dados
            </button>
          </div>
        </div>

        <div id="taskBoard" class="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-5"></div>
      </div>
    `;
  }

  function phaseCard(phaseId, phase, tasksHtml) {
    const c = colors[phase.color];
    return `
      <section class="phase-card rounded-2xl md:rounded-3xl border ${c.card} overflow-hidden" data-phase="${phaseId}">
        <button class="phase-toggle w-full text-left p-4 md:p-6 flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2 md:gap-3 flex-wrap">
              <span class="${c.badge} text-[11px] md:text-xs font-bold px-3 py-1 rounded-full">${phase.code}</span>
              <span class="text-[11px] md:text-sm font-semibold ${c.subtitle}">${phase.subtitle}</span>
            </div>
            <h2 class="text-lg md:text-2xl font-extrabold mt-3 leading-tight">${phase.title}</h2>
            <p class="text-sm md:text-base text-slate-700 mt-1">${phase.description}</p>
            <p class="phase-date-range text-xs md:text-sm font-semibold ${c.range} mt-2">Datas calculadas automaticamente após definir a data da assembleia.</p>
            <div class="mt-4 max-w-md">
              <div class="w-full ${c.progressBg} h-2 rounded-full">
                <div class="progress-bar h-2 rounded-full ${c.progressBar}" style="width:0%"></div>
              </div>
              <p class="progress-label text-xs mt-2 ${c.subtitle} font-semibold">0% concluído</p>
            </div>
          </div>
          <span class="toggle-icon ${c.subtitle} text-sm font-bold mt-1 shrink-0">−</span>
        </button>

        <div class="phase-content px-4 md:px-6 pb-4 md:pb-6">
          <div class="grid md:grid-cols-2 gap-3 md:gap-4">
            ${tasksHtml}
          </div>
        </div>
      </section>
    `;
  }

  function taskCard(task, phaseColor, saved) {
    const c = colors[phaseColor];
    return `
      <article class="task-card bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-sm" data-task-id="${task.id}" data-groups="${task.groups.join(" ")}">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <div class="text-sm md:text-base font-bold ${c.titleTone} leading-snug">${task.id} ${task.title}</div>
            <div class="text-xs md:text-sm text-slate-500 mt-1 leading-snug">Responsável: ${task.owner}</div>
          </div>
          <span class="shrink-0 text-[11px] px-2 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600">${task.priority}</span>
        </div>

        <div class="task-date-hint text-xs font-semibold ${c.range} mt-3 leading-snug"></div>
        <div class="dependency-hint text-xs text-slate-500 mt-1 leading-snug"></div>

        <div class="mt-3 task-grid-mobile md:grid md:grid-cols-2 md:gap-2">
          <select class="status-select w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
            <option value="pendente" ${saved.status === "pendente" ? "selected" : ""}>Pendente</option>
            <option value="emcurso" ${saved.status === "emcurso" ? "selected" : ""}>Em curso</option>
            <option value="concluido" ${saved.status === "concluido" ? "selected" : ""}>Concluído</option>
          </select>

          <input class="date-input w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" type="date" value="${saved.date || ""}" />
        </div>

        <textarea class="notes-input w-full mt-3 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" rows="3" placeholder="Observações...">${saved.notes || ""}</textarea>
      </article>
    `;
  }

  return { shell, phaseCard, taskCard };
})();
