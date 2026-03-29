window.UI = (() => {

  function shell() {
    return `
      <div class="app-wrapper">

        <!-- Header -->
        <header class="app-header">
          <p class="header-eyebrow">Manual 2023 · Igreja do Nazareno</p>
          <h1 class="header-title">Guia da Assembleia Distrital</h1>
          <p class="header-subtitle">Distrito da Matola · Da Igreja Local até ao Dia da Assembleia</p>
          <div class="header-meta">
            <span class="meta-chip">5 Fases</span>
            <span class="meta-chip">28 Tarefas</span>
            <span class="meta-chip">28ª Assembleia</span>
          </div>
        </header>

        <!-- Date Config Card -->
        <div class="date-card">
          <div class="date-card-inner">
            <div class="date-field">
              <label class="date-label" for="assemblyDate">Data da Assembleia Distrital</label>
              <input id="assemblyDate" type="date" class="date-input" />
            </div>
            <div class="date-field">
              <label class="date-label">Início da janela de 90 dias</label>
              <div id="windowStartLabel" class="date-input" style="display:flex;align-items:center;font-size:13px;color:var(--c-text-muted)">—</div>
            </div>
            <div class="date-field">
              <label class="date-label">Dias restantes</label>
              <div id="daysRemainingLabel" class="date-input" style="display:flex;align-items:center;font-size:13px;color:var(--c-text-muted)">—</div>
            </div>
          </div>
          <div id="timelineStatus" class="timeline-status" style="margin-top:10px;font-size:12px;">
            Defina a data da assembleia para activar a timeline.
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="kpi-grid">
          <div class="kpi-card accent">
            <div class="kpi-label">Progresso</div>
            <div id="kpiProgressGlobal" class="kpi-value">0%</div>
            <div class="kpi-accent-bar"></div>
          </div>
          <div class="kpi-card success">
            <div class="kpi-label">Concluídas</div>
            <div id="kpiConcluidas" class="kpi-value">0</div>
            <div class="kpi-accent-bar"></div>
          </div>
          <div class="kpi-card warning">
            <div class="kpi-label">Em curso</div>
            <div id="kpiEmCurso" class="kpi-value">0</div>
            <div class="kpi-accent-bar"></div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Pendentes</div>
            <div id="kpiPendentes" class="kpi-value">0</div>
            <div class="kpi-accent-bar"></div>
          </div>
          <div class="kpi-card danger">
            <div class="kpi-label">Atrasadas</div>
            <div id="kpiAtrasadas" class="kpi-value">0</div>
            <div class="kpi-accent-bar"></div>
          </div>
        </div>

        <!-- Tabs + Reset -->
        <div class="action-row">
          <div class="tabs-wrapper" style="flex:1;margin-bottom:0;">
            <div class="tabs-inner" id="viewTabs">
              <button class="tab-btn active" data-view="all">Ver Tudo</button>
              <button class="tab-btn" data-view="igreja">Igreja Local</button>
              <button class="tab-btn" data-view="ministros">Pastores / Ministros</button>
              <button class="tab-btn" data-view="sd">Superintendente</button>
              <button class="tab-btn" data-view="juntas">Juntas</button>
              <button class="tab-btn" data-view="day">Modo Dia</button>
            </div>
          </div>
          <button id="resetDataBtn" class="reset-btn">Limpar Dados</button>
        </div>

        <!-- Risk Banner -->
        <div id="riskBanner" class="risk-banner">
          <span class="risk-icon">⚠️</span>
          <div class="risk-content">
            <div class="risk-title">Risco operacional detectado</div>
            <div id="riskBannerText" class="risk-text">—</div>
          </div>
        </div>

        <!-- Board -->
        <div id="taskBoard"></div>

      </div>
    `;
  }

  function phaseCard(phaseId, phase, tasksHtml) {
    return `
      <section class="phase-card" data-phase="${phaseId}" data-color="${phase.color}">
        <button class="phase-header phase-toggle">
          <div class="phase-header-left">
            <div class="phase-top-row">
              <span class="phase-icon">${phase.icon || '📌'}</span>
              <span class="phase-code">${phase.code}</span>
              <span class="phase-subtitle-badge">${phase.subtitle}</span>
            </div>
            <h2 class="phase-title">${phase.title}</h2>
            <p class="phase-desc">${phase.description}</p>
            <p class="phase-date-range" style="color:var(--c-text-muted)">Datas calculadas automaticamente após definir a data da assembleia.</p>
            <div class="phase-progress-row">
              <div class="phase-progress-track">
                <div class="phase-progress-fill" style="width:0%"></div>
              </div>
              <span class="phase-progress-label">0%</span>
            </div>
          </div>
          <span class="phase-toggle-icon">−</span>
        </button>
        <div class="phase-body">
          <div class="tasks-grid">
            ${tasksHtml}
          </div>
        </div>
      </section>
    `;
  }

  function taskCard(task, phaseColor, saved) {
    const priorityMap = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
    return `
      <article class="task-card priority-${task.priority}" data-task-id="${task.id}" data-groups="${task.groups.join(' ')}">
        <div class="task-header">
          <div>
            <div class="task-id">${task.id}</div>
            <div class="task-title">${task.title}</div>
            <div class="task-owner">${task.owner}</div>
          </div>
          <span class="priority-badge ${task.priority}">${priorityMap[task.priority] || task.priority}</span>
        </div>

        <div class="task-timeline-hint"></div>
        <div class="task-dep-hint"></div>

        <div class="task-controls">
          <select class="task-select status-select">
            <option value="pendente" ${saved.status === 'pendente' ? 'selected' : ''}>⬜ Pendente</option>
            <option value="emcurso" ${saved.status === 'emcurso' ? 'selected' : ''}>🟡 Em curso</option>
            <option value="concluido" ${saved.status === 'concluido' ? 'selected' : ''}>✅ Concluído</option>
          </select>
          <input class="task-date date-input" type="date" value="${saved.date || ''}" />
        </div>
        <textarea class="task-notes notes-input" rows="2" placeholder="Observações...">${saved.notes || ''}</textarea>
      </article>
    `;
  }

  return { shell, phaseCard, taskCard };
})();
