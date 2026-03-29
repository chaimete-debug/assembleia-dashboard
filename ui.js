window.UI = (() => {
  function renderShell(container) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-700 to-slate-800 text-white p-6 md:p-8">
          <h1 class="text-2xl md:text-4xl font-extrabold">Guia da Assembleia Distrital</h1>
          <p class="mt-2 text-slate-100">Igreja do Nazareno · Distrito da Matola</p>
        </div>

        <div class="p-4 md:p-6 bg-slate-50 border-b border-slate-200">
          <div class="grid lg:grid-cols-3 gap-4">
            <div class="bg-white border border-slate-200 rounded-2xl p-4">
              <label class="text-xs uppercase tracking-wide text-slate-500 block mb-2">Data da Assembleia Distrital</label>
              <input id="assemblyDate" type="date" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div class="bg-white border border-slate-200 rounded-2xl p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">Início da janela de 90 dias</p>
              <h3 id="windowStartLabel" class="text-lg font-extrabold mt-1">—</h3>
            </div>
            <div class="bg-white border border-slate-200 rounded-2xl p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">Dias restantes</p>
              <h3 id="daysRemainingLabel" class="text-lg font-extrabold mt-1">—</h3>
              <p id="timelineStatus" class="text-xs text-slate-500 mt-2">Defina a data da assembleia.</p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-3 items-center">
            <div id="viewTabs" class="inline-flex flex-wrap gap-2 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm">
              <button class="tab-btn filter-btn bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold border border-blue-700" data-view="all">Ver Tudo</button>
              <button class="tab-btn filter-btn bg-white text-slate-700 rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200" data-view="igreja">Igreja Local</button>
              <button class="tab-btn filter-btn bg-white text-slate-700 rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200" data-view="ministros">Pastores / Ministros</button>
              <button class="tab-btn filter-btn bg-white text-slate-700 rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200" data-view="sd">Superintendente</button>
              <button class="tab-btn filter-btn bg-white text-slate-700 rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200" data-view="juntas">Juntas</button>
              <button class="tab-btn filter-btn bg-white text-slate-700 rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200" data-view="day">Modo Dia</button>
            </div>
          </div>
        </div>

        <div id="taskBoard" class="p-4 md:p-6 space-y-4"></div>
      </div>
    `;
  }

  return { renderShell };
})();