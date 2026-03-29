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

  function getTaskState(taskId) {
    return state[taskId] || { status: "pendente", date: "", notes: "" };
  }

  function setActiveTab(button) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.remove("bg-blue-700", "text-white", "border-blue-700", "shadow-sm", "scale-[1.02]");
      btn.classList.add("bg-white", "text-slate-700", "border-slate-200");
      btn.setAttribute("aria-selected", "false");
    });

    if (button) {
      button.classList.remove("bg-white", "text-slate-700", "border-slate-200");
      button.classList.add("bg-blue-700", "text-white", "border-blue-700", "shadow-sm", "scale-[1.02]");
      button.setAttribute("aria-selected", "true");
    }
  }

  function renderShell() {
    document.getElementById("app").innerHTML = UI.shellHtml();
  }

  function renderBoard(view = "all") {
    const board = document.getElementById("taskBoard");
    const grouped = {};

    APP_DATA.tasks.forEach(task => {
      if (view === "day" && task.phase !== "5") return;
      if (view !== "all" && view !== "day" && !task.groups.includes(view)) return;

      if (!grouped[task.phase]) grouped[task.phase] = [];
      grouped[task.phase].push(task);
    });

    board.innerHTML = Object.keys(APP_DATA.phases)
      .filter(phaseId => grouped[phaseId] && grouped[phaseId].length)
      .map(phaseId => {
        const phase = APP_DATA.phases[phaseId];
        const colorCfg = UI.colorMap[phase.color];
        const taskHtml = grouped[phaseId].map(task =>
          UI.taskCardHtml(task, getTaskState(task.id), phase.color)
        );
        return UI.phaseCardHtml({ id: phaseId, ...phase }, taskHtml, colorCfg);
      })
      .join("");

    bindPhaseToggles();
    bindTaskInputs();
    updateTimeline();
    updateTaskStyles();
    updateProgress();
  }

  function bindPhaseToggles() {
    document.querySelectorAll(".phase-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const section = btn.closest(".phase-card");
        const content = section.querySelector(".phase-content");
        const icon = section.querySelector(".toggle-icon");
        const hidden = content.classList.contains("hidden");
        content.classList.toggle("hidden");
        icon.textContent = hidden ? "−" : "+";
      });
    });
  }

  function bindTaskInputs() {
    document.querySelectorAll(".status-select").forEach(el => {
      el.addEventListener("change", e => {
        const taskId = e.target.closest(".task-card").dataset.taskId;
        state[taskId] = state[taskId] || {};
        state[taskId].status = e.target.value;
        StorageService.save(state);
        updateTaskStyles();
        updateTimeline();
        updateProgress();
      });
    });

    document.querySelectorAll(".date-input").forEach(el => {
      el.addEventListener("change", e => {
        const taskId = e.target.closest(".task-card").dataset.taskId;
        state[taskId] = state[taskId] || {};
        state[taskId].date = e.target.value;
        StorageService.save(state);
      });
    });

    document.querySelectorAll(".notes-input").forEach(el => {
      el.addEventListener("input", e => {
        const taskId = e.target.closest(".task-card").dataset.taskId;
        state[taskId] = state[taskId] || {};
        state[taskId].notes = e.target.value;
        StorageService.save(state);
      });
    });
  }

  function updateTimeline() {
    const input = document.getElementById("assemblyDate");
    const value = input?.value;
    const startLabel = document.getElementById("windowStartLabel");
    const remainingLabel = document.getElementById("daysRemainingLabel");

    if (!value) {
      startLabel.textContent = "—";
      remainingLabel.textContent = "—";
      document.getElementById("timelineStatus").textContent = "Defina a data da assembleia para activar a timeline.";
      document.querySelectorAll(".phase-date-range").forEach(el => {
        el.textContent = "Datas calculadas automaticamente após definir a data da assembleia.";
      });
      document.querySelectorAll(".task-date-hint").forEach(el => {
        el.textContent = "";
      });
      document.querySelectorAll(".task-card").forEach(task => {
        task.classList.remove("ring-2", "ring-red-300", "ring-amber-300", "ring-blue-300");
      });
      return;
    }

    const assemblyDate = new Date(value + "T00:00:00");
    const windowStart = shiftDate(assemblyDate, -90);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((assemblyDate - today) / (1000 * 60 * 60 * 24));

    startLabel.textContent = formatDatePT(windowStart);
    remainingLabel.textContent = diffDays >= 0 ? `${diffDays} dias` : "Assembleia já realizada";

    document.querySelectorAll(".phase-card").forEach(phaseEl => {
      const phaseId = phaseEl.dataset.phase;
      const cfg = APP_DATA.phaseDateConfig[phaseId];
      const label = phaseEl.querySelector(".phase-date-range");
      if (!cfg || !label) return;

      const start = shiftDate(assemblyDate, cfg.startOffset);
      const end = shiftDate(assemblyDate, cfg.endOffset);

      label.textContent = cfg.startOffset === cfg.endOffset
        ? `Data exacta: ${formatDatePT(start)}`
        : `Janela recomendada: ${formatDatePT(start)} a ${formatDatePT(end)}`;
    });

    document.querySelectorAll(".task-card").forEach(taskEl => {
      const id = taskEl.dataset.taskId;
      const task = APP_DATA.tasks.find(t => t.id === id);
      const hint = taskEl.querySelector(".task-date-hint");
      if (!task || !hint) return;

      const start = shiftDate(assemblyDate, task.startOffset);
      const end = shiftDate(assemblyDate, task.endOffset);
      const saved = getTaskState(id);
      const status = saved.status || "pendente";

      let timelineState = "";
      taskEl.classList.remove("ring-2", "ring-red-300", "ring-amber-300", "ring-blue-300");

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
      const saved = getTaskState(id);
      const status = saved.status || "pendente";

      taskEl.classList.remove(
        "border-slate-300",
        "border-amber-300",
        "border-green-300",
        "bg-white",
        "bg-amber-50",
        "bg-green-50",
        "border-red-400",
        "bg-red-50"
      );

      const task = APP_DATA.tasks.find(t => t.id === id);

      if (status === "concluido") {
        taskEl.classList.add("border-green-300", "bg-green-50");
      } else if (status === "emcurso") {
        taskEl.classList.add("border-amber-300", "bg-amber-50");
      } else if (task?.priority === "alta") {
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

      const pending = deps.filter(depId => {
        const depState = getTaskState(depId);
        return depState.status !== "concluido";
      });

      depHint.textContent = pending.length
        ? `Dependências em falta: ${pending.join(", ")}`
        : `Dependências satisfeitas: ${deps.join(", ")}`;
    });
  }

  function updateProgress() {
    let blocked = false;
    const riskMessages = [];
    let overdueCount = 0;
    let upcomingCount = 0;
    let onTrackCount = 0;

    const assemblyValue = document.getElementById("assemblyDate")?.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const assemblyDate = assemblyValue ? new Date(assemblyValue + "T00:00:00") : null;

    document.querySelectorAll(".phase-card").forEach(phaseEl => {
      const phaseTasks = [...phaseEl.querySelectorAll(".task-card")];
      const total = phaseTasks.length;
      const done = phaseTasks.filter(card => {
        const id = card.dataset.taskId;
        return getTaskState(id).status === "concluido";
      }).length;

      const percent = total ? Math.round((done / total) * 100) : 0;
      const bar = phaseEl.querySelector(".progress-bar");
      const label = phaseEl.querySelector(".progress-label");
      if (bar) bar.style.width = `${percent}%`;
      if (label) label.textContent = `${percent}% concluído`;

      phaseTasks.forEach(card => {
        const id = card.dataset.taskId;
        const task = APP_DATA.tasks.find(t => t.id === id);
        const saved = getTaskState(id);
        const status = saved.status || "pendente";

        if (status === "concluido") return;
        if (!assemblyDate || !task) return;

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
            riskMessages.push(`Tarefa crítica ${id} atrasada`);
          }
        }

        const deps = APP_DATA.dependencies[id] || [];
        if ((status === "emcurso" || status === "concluido") && deps.length) {
          const invalid = deps.filter(depId => getTaskState(depId).status !== "concluido");
          if (invalid.length) {
            blocked = true;
            riskMessages.push(`Tarefa ${id} depende de ${invalid.join(", ")}`);
          }
        }
      });
    });

    const statusEl = document.getElementById("timelineStatus");
    const banner = document.getElementById("riskBanner");
    const bannerText = document.getElementById("riskBannerText");

    if (blocked) {
      statusEl.textContent = `⚠️ Atrasadas: ${overdueCount} · Dentro do prazo: ${onTrackCount} · Próximas: ${upcomingCount}`;
      statusEl.classList.add("text-red-600", "font-bold");
      banner.classList.remove("hidden");
      bannerText.textContent = riskMessages.length
        ? riskMessages.slice(0, 4).join(" · ")
        : "Existem tarefas críticas em situação de risco.";
    } else {
      statusEl.textContent = `✅ Dentro do prazo: ${onTrackCount} · Próximas: ${upcomingCount} · Atrasadas: ${overdueCount}`;
      statusEl.classList.remove("text-red-600", "font-bold");
      banner.classList.add("hidden");
    }
  }

  function bindTabs() {
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        setActiveTab(btn);
        state.__activeView = btn.dataset.view;
        StorageService.save(state);
        renderBoard(btn.dataset.view);
      });
    });
  }

  function bindAssemblyDate() {
    const input = document.getElementById("assemblyDate");
    if (state.__assemblyDate) input.value = state.__assemblyDate;

    input.addEventListener("change", () => {
      state.__assemblyDate = input.value;
      StorageService.save(state);
      const activeView = state.__activeView || "all";
      renderBoard(activeView);
    });
  }

  function bindReset() {
    const btn = document.getElementById("resetDataBtn");
    btn.addEventListener("click", () => {
      const ok = confirm("Tem a certeza que quer limpar todos os estados, datas e observações?");
      if (!ok) return;
      StorageService.clear();
      Object.keys(state).forEach(k => delete state[k]);
      render();
    });
  }

  function render() {
    renderShell();
    bindTabs();
    bindAssemblyDate();
    bindReset();

    const activeView = state.__activeView || "all";
    const activeButton = document.querySelector(`.tab-btn[data-view="${activeView}"]`) ||
      document.querySelector(`.tab-btn[data-view="all"]`);
    setActiveTab(activeButton);
    renderBoard(activeView);
  }

  function renderShell() {
    document.getElementById("app").innerHTML = UI.shellHtml();
  }

  document.addEventListener("DOMContentLoaded", render);
})();
