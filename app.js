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
      btn.classList.toggle("active", active);
    });
  }

  function renderBoard(view) {
    const board = document.getElementById("taskBoard");

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
        const body = section.querySelector(".phase-body");
        const icon = section.querySelector(".phase-toggle-icon");
        const collapsed = body.classList.toggle("collapsed");
        icon.textContent = collapsed ? "+" : "−";
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

    document.querySelectorAll(".date-input.task-date, input.task-date").forEach(el => {
      el.onchange = e => {
        const card = e.target.closest(".task-card");
        if (!card) return;
        const taskId = card.dataset.taskId;
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
    const value = input ? input.value : "";
    const startLabel = document.getElementById("windowStartLabel");
    const daysLabel = document.getElementById("daysRemainingLabel");
    const timelineStatus = document.getElementById("timelineStatus");

    if (!value) {
      if (startLabel) startLabel.textContent = "—";
      if (daysLabel) daysLabel.textContent = "—";
      if (timelineStatus) timelineStatus.textContent = "Defina a data da assembleia para activar a timeline.";

      document.querySelectorAll(".phase-date-range").forEach(el => {
        el.textContent = "Datas calculadas automaticamente após definir a data da assembleia.";
        el.style.color = "var(--c-text-muted)";
      });
      document.querySelectorAll(".task-timeline-hint").forEach(el => el.textContent = "");
      document.querySelectorAll(".task-card").forEach(el => {
        el.classList.remove("overdue", "on-track", "upcoming");
      });
      return;
    }

    const assemblyDate = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start90 = shiftDate(assemblyDate, -90);
    const diffDays = Math.ceil((assemblyDate - today) / (1000 * 60 * 60 * 24));

    if (startLabel) startLabel.textContent = formatDatePT(start90);
    if (daysLabel) daysLabel.textContent = diffDays >= 0 ? `${diffDays} dias` : "Assembleia realizada";

    document.querySelectorAll(".phase-card").forEach(phaseEl => {
      const phaseId = phaseEl.dataset.phase;
      const phase = APP_DATA.phases[phaseId];
      const label = phaseEl.querySelector(".phase-date-range");
      if (!phase || !label) return;

      const phaseTasks = APP_DATA.tasks.filter(t => t.phase === phaseId);
      if (!phaseTasks.length) return;

      const minOffset = Math.min(...phaseTasks.map(t => t.startOffset));
      const maxOffset = Math.max(...phaseTasks.map(t => t.endOffset));
      const start = shiftDate(assemblyDate, minOffset);
      const end = shiftDate(assemblyDate, maxOffset);

      label.textContent = minOffset === maxOffset
        ? `Data: ${formatDatePT(start)}`
        : `Janela: ${formatDatePT(start)} → ${formatDatePT(end)}`;
    });

    document.querySelectorAll(".task-card").forEach(taskEl => {
      const id = taskEl.dataset.taskId;
      const task = getTaskById(id);
      const hint = taskEl.querySelector(".task-timeline-hint");
      const saved = getTaskState(id);
      const status = saved.status || "pendente";

      if (!task || !hint) return;

      const start = shiftDate(assemblyDate, task.startOffset);
      const end = shiftDate(assemblyDate, task.endOffset);

      taskEl.classList.remove("overdue", "on-track", "upcoming");

      let timelineState = "";

      if (status === "concluido") {
        timelineState = "✅ Concluída";
      } else if (today < start) {
        const daysToStart = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
        timelineState = `⏳ Começa em ${daysToStart} dia(s)`;
        taskEl.classList.add("upcoming");
      } else if (today >= start && today <= end) {
        const daysToEnd = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        timelineState = `🟡 Em prazo · ${daysToEnd} dia(s) restante(s)`;
        taskEl.classList.add("on-track");
      } else {
        const overdueDays = Math.ceil((today - end) / (1000 * 60 * 60 * 24));
        timelineState = `❌ Atrasada há ${overdueDays} dia(s)`;
        taskEl.classList.add("overdue");
      }

      hint.textContent = task.startOffset === task.endOffset
        ? `${formatDatePT(start)} · ${timelineState}`
        : `${formatDatePT(start)} → ${formatDatePT(end)} · ${timelineState}`;
    });
  }

  function updateTaskStyles() {
    document.querySelectorAll(".task-card").forEach(taskEl => {
      const id = taskEl.dataset.taskId;
      const task = getTaskById(id);
      const saved = getTaskState(id);
      const status = saved.status || "pendente";

      taskEl.classList.remove("status-concluido", "status-emcurso", "status-pendente");

      if (status === "concluido") taskEl.classList.add("status-concluido");
      else if (status === "emcurso") taskEl.classList.add("status-emcurso");
      else taskEl.classList.add("status-pendente");

      const depHint = taskEl.querySelector(".task-dep-hint");
      const deps = APP_DATA.dependencies[id] || [];

      if (!depHint) return;

      if (!deps.length) {
        depHint.textContent = "";
        return;
      }

      const pending = deps.filter(depId => getTaskState(depId).status !== "concluido");
      depHint.textContent = pending.length
        ? `⚠ Dependências em falta: ${pending.join(", ")}`
        : `✔ Dependências satisfeitas: ${deps.join(", ")}`;
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

    const input = document.getElementById("assemblyDate");
    const value = input ? input.value : "";
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

      if (today < start) upcomingCount++;
      else if (today >= start && today <= end) onTrackCount++;
      else {
        overdueCount++;
        if (task.priority === "alta") {
          blocked = true;
          riskMessages.push(`${task.id} atrasada`);
        }
      }

      const deps = APP_DATA.dependencies[task.id] || [];
      if ((status === "emcurso" || status === "concluido") && deps.length) {
        const invalid = deps.filter(depId => getTaskState(depId).status !== "concluido");
        if (invalid.length) {
          blocked = true;
          riskMessages.push(`${task.id} depende de ${invalid.join(", ")}`);
        }
      }
    });

    const totalTasks = APP_DATA.tasks.length;
    const globalProgress = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;

    const el = id => document.getElementById(id);
    if (el("kpiProgressGlobal")) el("kpiProgressGlobal").textContent = `${globalProgress}%`;
    if (el("kpiConcluidas")) el("kpiConcluidas").textContent = completedCount;
    if (el("kpiEmCurso")) el("kpiEmCurso").textContent = inProgressCount;
    if (el("kpiPendentes")) el("kpiPendentes").textContent = pendingCount;
    if (el("kpiAtrasadas")) el("kpiAtrasadas").textContent = overdueCount;

    document.querySelectorAll(".phase-card").forEach(phaseEl => {
      const cards = [...phaseEl.querySelectorAll(".task-card")];
      const total = cards.length;
      const done = cards.filter(card => getTaskState(card.dataset.taskId).status === "concluido").length;
      const percent = total ? Math.round((done / total) * 100) : 0;

      const fill = phaseEl.querySelector(".phase-progress-fill");
      const label = phaseEl.querySelector(".phase-progress-label");
      if (fill) fill.style.width = `${percent}%`;
      if (label) label.textContent = `${percent}%`;
    });

    if (timelineStatus) {
      if (!assemblyDate) {
        timelineStatus.textContent = "Defina a data da assembleia para activar a timeline.";
        timelineStatus.style.color = "var(--c-text-muted)";
      } else if (blocked) {
        timelineStatus.textContent = `⚠️ Atrasadas: ${overdueCount} · Em prazo: ${onTrackCount} · Próximas: ${upcomingCount}`;
        timelineStatus.style.color = "var(--c-danger)";
      } else {
        timelineStatus.textContent = `✅ Em prazo: ${onTrackCount} · Próximas: ${upcomingCount} · Atrasadas: ${overdueCount}`;
        timelineStatus.style.color = "var(--c-success)";
      }
    }

    if (banner) {
      if (blocked) {
        banner.classList.add("visible");
        if (bannerText) bannerText.textContent = riskMessages.slice(0, 4).join(" · ");
      } else {
        banner.classList.remove("visible");
      }
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
    if (!input) return;
    if (state.__assemblyDate) input.value = state.__assemblyDate;

    input.onchange = () => {
      state.__assemblyDate = input.value;
      saveState();
      updateTimeline();
      updateTaskStyles();
      updateProgress();
    };
  }

  function bindReset() {
    const btn = document.getElementById("resetDataBtn");
    if (!btn) return;
    btn.onclick = () => {
      if (!confirm("Limpar todos os estados, datas e observações?")) return;
      StorageService.clear();
      Object.keys(state).forEach(k => delete state[k]);
      renderApp();
    };
  }

  function renderApp() {
    document.getElementById("app").innerHTML = UI.shell();
    bindTabs();
    bindAssemblyDate();
    bindReset();

    const view = state.__activeView || "all";
    setActiveTab(view);
    renderBoard(view);
  }

  document.addEventListener("DOMContentLoaded", renderApp);
})();
