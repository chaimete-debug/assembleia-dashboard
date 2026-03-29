(function () {
  const state = StorageService.load();

  function formatDatePT(date) {
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  function shiftDate(base, offsetDays) {
    const d = new Date(base);
    d.setDate(d.getDate() + offsetDays);
    return d;
  }

  function getTaskById(id) {
    return APP_DATA.tasks.find(t => t.id === id);
  }

  function getTaskState(id) {
    return state[id] || { status: "pendente", date: "", notes: "" };
  }

  function saveState() {
    StorageService.save(state);
  }

  function setActiveTab(view) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      const active = btn.dataset.view === view;
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.classList.remove("bg-blue-700", "text-white", "border-blue-700", "shadow-sm", "scale-[1.02]");
      btn.classList.remove("bg-white", "text-slate-700", "border-slate-200");

      if (active) {
        btn.classList.add("bg-blue-700", "text-white", "border-blue-700", "shadow-sm", "scale-[1.02]");
      } else {
        btn.classList.add("bg-white", "text-slate-700", "border-slate-200");
      }
    });
  }

  function renderShell() {
    document.getElementById("app").innerHTML = UI.shell();
    document.getElementById("overviewPanel").innerHTML = UI.overviewCards();
  }

  function renderBoard(view) {
    const board = document.getElementById("taskBoard");
    const overviewPanel = document.getElementById("overviewPanel");

    if (view === "overview") {
      board.innerHTML = "";
      overviewPanel.classList.remove("hidden");
      updateTimeline();
      updateTaskStyles();
      updateProgress();
      return;
    }

    overviewPanel.classList.add("hidden");

    const grouped = {};

    APP_DATA.tasks.forEach(task => {
      const visible =
        view === "all" ||
        (view === "day" && task.phase === "5") ||
        (view !== "all" && view !== "day" && task.groups.includes(view));

      if (!visible) return;

      if (!grouped[task.phase]) grouped[task.phase] = [];
      grouped[task.phase].push(task);
    });

    let html = "";

    Object.keys(APP_DATA.phases).forEach(phaseId => {
      if (!grouped[phaseId] || !grouped[phaseId].length) return;

      const phase = APP_DATA.phases[phaseId];
      const tasksHtml = grouped[phaseId]
        .map(task => UI.taskCard(task, phase.color, getTaskState(task.id)))
        .join("");

      html += UI.phaseCard(phaseId, phase, tasksHtml);
    });

    board.innerHTML = html;
    bindPhaseToggles();
    bindTaskInputs();
    updateTimeline();
    updateTaskStyles();
    updateProgress();
  }

  function bindPhaseToggles() {
    document.querySelectorAll(".phase-toggle").forEach(btn => {
      btn.onclick = () => {
        const section = btn.closest(".phase-card");
        const content = section.querySelector(".phase-content");
        const icon = section.querySelector(".toggle-icon");
        const hidden = content.classList.contains("hidden-force");
        content.classList.toggle("hidden-force");
        icon.textContent = hidden ? "−" : "+";
      };
    });
  }

  function bindTaskInputs() {
    document.querySelectorAll(".status-select").forEach(el => {
      el.onchange = e => {
        const taskId = e.target.closest(".task-card").dataset.taskId;
        state[taskId] = state[taskId] || {};
        state[taskId].status = e.target.value;
        saveState();
        updateTaskStyles();
        updateTimeline();
        updateProgress();
      };
    });

    document.querySelectorAll(".date-input").forEach(el => {
      el.onchange = e => {
        const taskId = e.target.closest(".task-card").dataset.taskId;
        state[taskId] = state[taskId] || {};
        state[taskId].date = e.target.value;
        saveState();
      };
    });

    document.querySelectorAll(".notes-input").forEach(el => {
      el.oninput = e => {
        const taskId = e.target.closest(".task-card").dataset.taskId;
        state[taskId] = state[taskId] || {};
        state[taskId].notes = e.target.value;
        saveState();
      };
    });
  }

  function updateTimeline() {
    const input = document.getElementById("assemblyDate");
    const value = input.value;
    const startLabel = document.getElementById("windowStartLabel");
    const daysLabel = document.getElementById("daysRemainingLabel");
    const timelineStatus = document.getElementById("timelineStatus");
    const overviewAssemblyDate = document.getElementById("overviewAssemblyDate");

    if (!value) {
      if (overviewAssemblyDate) overviewAssemblyDate.textContent = "—";
      startLabel.textContent = "—";
      daysLabel.textContent = "—";
      timelineStatus.textContent = "Defina a data da assembleia para activar a timeline.";

      document.querySelectorAll(".phase-date-range").forEach(el => {
        el.textContent = "Datas calculadas automaticamente após definir a data da assembleia.";
      });

      document.querySelectorAll(".task-date-hint").forEach(el => {
        el.textContent = "";
      });

      document.querySelectorAll(".task-card").forEach(taskEl => {
        taskEl.classList.remove("ring-2", "ring-red-300", "ring-amber-300", "ring-blue-300");
      });

      return;
    }

    const assemblyDate = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start90 = shiftDate(assemblyDate, -90);
    const diffDays = Math.ceil((assemblyDate - today) / (1000 * 60 * 60 * 24));

    if (overviewAssemblyDate) overviewAssemblyDate.textContent = formatDatePT(assemblyDate);
    startLabel.textContent = formatDatePT(start90);
    daysLabel.textContent = diffDays >= 0 ? `${diffDays} dias` : "Assembleia já realizada";

    document.querySelectorAll(".phase-card").forEach(phaseEl => {
      const phaseId = phaseEl.dataset.phase;
      const offset = APP_DATA.phaseDateConfig[phaseId];
      const label = phaseEl.querySelector(".phase-date-range");
      if (!offset || !label) return;

      const start = shiftDate(assemblyDate, offset.startOffset);
      const end = shiftDate(assemblyDate, offset.endOffset);

      label.textContent = offset.startOffset === offset.endOffset
        ? `Data exacta: ${formatDatePT(start)}`
        : `Janela recomendada: ${formatDatePT(start)} a ${formatDatePT(end)}`;
    });

    document.querySelectorAll(".task-card").forEach(taskEl => {
      const id = taskEl.dataset.taskId;
      const task = getTaskById(id);
      const hint = taskEl.querySelector(".task-date-hint");
      const saved = getTaskState(id);
      const status = saved.status || "pendente";

      if (!task || !hint) return;

      const start = shiftDate(assemblyDate, task.startOffset);
      const end = shiftDate(assemblyDate, task.endOffset);

      taskEl.classList.remove("ring-2", "ring-red-300", "ring-amber-300", "ring-blue-300");

      let timelineState = "";

      if (status === "concluido") {
        timelineState = "✔ Concluída";
      } else if (today < start) {
        const daysToStart = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
        timelineState = `⏳ Próxima: começa em ${daysToStart} dia(s)`;
        taskEl.classList.add("ring-2", "ring-blue-300");
      } else if (today >= start && today <= end) {
        const daysToEnd = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        timelineState = `🟡 Dentro do prazo: restam ${daysToEnd} dia(s)`;
        taskEl.classList.add("ring-2", "ring-amber-300");
      } else {
        const overdueDays = Math.ceil((today - end) / (1000 * 60 * 60 * 24));
        timelineState = `❌ Atrasada há ${overdueDays} dia(s)`;
        taskEl.classList.add("ring-2", "ring-red-300");
      }

      hint.textContent = task.startOffset === task.endOffset
        ? `${task.label}: ${formatDatePT(start)} · ${timelineState}`
        : `${task.label}: ${formatDatePT(start)} a ${formatDatePT(end)} · ${timelineState}`;
    });
  }

  function updateTaskStyles() {
    document.querySelectorAll(".task-card").forEach(taskEl => {
      const id = taskEl.dataset.taskId;
      const task = getTaskById(id);
      const saved = getTaskState(id);
      const status = saved.status || "pendente";

      taskEl.classList.remove(
        "border-slate-300", "border-amber-300", "border-green-300",
        "bg-white", "bg-amber-50", "bg-green-50",
        "border-red-400", "bg-red-50"
      );

      if (status === "concluido") {
        taskEl.classList.add("border-green-300", "bg-green-50");
      } else if (status === "emcurso") {
        taskEl.classList.add("border-amber-300", "bg-amber-50");
      } else if (task && task.priority === "alta") {
        taskEl.classList.add("border-red-400", "bg-red-50");
      } else {
        taskEl.classList.add("border-slate-300", "bg-white");
      }

      const depHint = taskEl.querySelector(".dependency-hint");
      const deps = APP_DATA.dependencies[id] || [];

      if (!depHint) return;

      if (!deps.length) {
        depHint.textContent = "";
        return;
      }

      const pending = deps.filter(depId => getTaskState(depId).status !== "concluido");

      depHint.textContent = pending.length
        ? `Dependências em falta: ${pending.join(", ")}`
        : `Dependências satisfeitas: ${deps.join(", ")}`;
    });
  }

  function updateProgress() {
    let blocked = false;
    let overdueCount = 0;
    let upcomingCount = 0;
    let onTrackCount = 0;
    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;
    const riskMessages = [];

    const value = document.getElementById("assemblyDate").value;
    const banner = document.getElementById("riskBanner");
    const bannerText = document.getElementById("riskBannerText");
    const timelineStatus = document.getElementById("timelineStatus");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const assemblyDate = value ? new Date(value + "T00:00:00") : null;

    APP_DATA.tasks.forEach(task => {
      const saved = getTaskState(task.id);
      const status = saved.status || "pendente";

      if (status === "concluido") completedCount++;
      else if (status === "emcurso") inProgressCount++;
      else pendingCount++;

      if (!assemblyDate || status === "concluido") return;

      const start = shiftDate(assemblyDate, task.startOffset);
      const end = shiftDate(assemblyDate, task.endOffset);

      if (today < start) {
        upcomingCount++;
      } else if (today >= start && today <= end) {
        onTrackCount++;
      } else {
        overdueCount++;
        if (task.priority === "alta") {
          blocked = true;
          riskMessages.push(`Tarefa crítica ${task.id} atrasada`);
        }
      }

      const deps = APP_DATA.dependencies[task.id] || [];
      if ((status === "emcurso" || status === "concluido") && deps.length) {
        const invalid = deps.filter(depId => getTaskState(depId).status !== "concluido");
        if (invalid.length) {
          blocked = true;
          riskMessages.push(`Tarefa ${task.id} depende de ${invalid.join(", ")}`);
        }
      }
    });

    const totalTasks = APP_DATA.tasks.length;
    const globalProgress = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;

    const kpiProgressGlobal = document.getElementById("kpiProgressGlobal");
    const kpiConcluidas = document.getElementById("kpiConcluidas");
    const kpiEmCurso = document.getElementById("kpiEmCurso");
    const kpiPendentes = document.getElementById("kpiPendentes");
    const kpiAtrasadas = document.getElementById("kpiAtrasadas");

    if (kpiProgressGlobal) kpiProgressGlobal.textContent = `${globalProgress}%`;
    if (kpiConcluidas) kpiConcluidas.textContent = completedCount;
    if (kpiEmCurso) kpiEmCurso.textContent = inProgressCount;
    if (kpiPendentes) kpiPendentes.textContent = pendingCount;
    if (kpiAtrasadas) kpiAtrasadas.textContent = overdueCount;

    document.querySelectorAll(".phase-card").forEach(phaseEl => {
      const cards = [...phaseEl.querySelectorAll(".task-card")];
      const total = cards.length;
      const done = cards.filter(card => {
        const id = card.dataset.taskId;
        return getTaskState(id).status === "concluido";
      }).length;

      const percent = total ? Math.round((done / total) * 100) : 0;
      const bar = phaseEl.querySelector(".progress-bar");
      const label = phaseEl.querySelector(".progress-label");

      if (bar) bar.style.width = `${percent}%`;
      if (label) label.textContent = `${percent}% concluído`;
    });

    if (blocked) {
      timelineStatus.textContent = `⚠️ Atrasadas: ${overdueCount} · Dentro do prazo: ${onTrackCount} · Próximas: ${upcomingCount}`;
      timelineStatus.classList.add("text-red-600", "font-bold");
      banner.classList.remove("hidden");
      bannerText.textContent = riskMessages.slice(0, 4).join(" · ");
    } else {
      timelineStatus.textContent = `✅ Dentro do prazo: ${onTrackCount} · Próximas: ${upcomingCount} · Atrasadas: ${overdueCount}`;
      timelineStatus.classList.remove("text-red-600", "font-bold");
      banner.classList.add("hidden");
    }
  }

  function bindTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.onclick = () => {
        const view = btn.dataset.view;
        state.__activeView = view;
        saveState();
        setActiveTab(view);
        renderBoard(view);
      };
    });
  }

  function bindAssemblyDate() {
    const input = document.getElementById("assemblyDate");
    if (state.__assemblyDate) input.value = state.__assemblyDate;

    input.onchange = () => {
      state.__assemblyDate = input.value;
      saveState();
      renderBoard(state.__activeView || "overview");
    };
  }

  function bindReset() {
    document.getElementById("resetDataBtn").onclick = () => {
      const ok = confirm("Tem a certeza que quer limpar todos os estados, datas e observações?");
      if (!ok) return;
      StorageService.clear();
      Object.keys(state).forEach(k => delete state[k]);
      renderApp();
    };
  }

  function renderApp() {
    renderShell();
    bindTabs();
    bindAssemblyDate();
    bindReset();

    const view = state.__activeView || "overview";
    setActiveTab(view);
    renderBoard(view);
  }

  function renderShell() {
    document.getElementById("app").innerHTML = UI.shell();
  }

  document.addEventListener("DOMContentLoaded", renderApp);
})();
