/**
 * Excel Masters MVP - Asosiy Dastur Kontrolleri (Main App Controller)
 */

import { DIAGNOSTIC_QUESTIONS, COURSE_LESSONS, TRAINER_TASKS } from "./data.js";
import { FormulaEngine } from "./formulaEngine.js";
import { StorageManager } from "./storage.js";
import { UIManager } from "./ui.js";

class ExcelMastersApp {
  constructor() {
    this.formulaEngine = new FormulaEngine();
    this.ui = new UIManager();

    // Joriy holat (State)
    this.currentView = "hero-view";
    this.diagCurrentStep = 0;
    this.diagAnswers = [];
    this.currentLessonId = StorageManager.getCurrentLessonId();
    this.currentTaskId = 1;
    this.selectedCell = "B7";
    this.trainerScores = {};

    this.init();
  }

  init() {
    this.bindGlobalNavigation();
    this.bindUserModal();
    this.bindHeroActions();
    this.bindDiagnosticEvents();
    this.bindCourseEvents();
    this.bindTrainerEvents();
    this.bindCongratsModal();

    this.updateUserUI();
    this.renderCourseSidebar();
    this.loadLesson(this.currentLessonId);
    this.loadTrainerTask(this.currentTaskId);
  }

  // ==========================================================================
  // Global Navigatsiya va Ko'rinishlar (View Switcher)
  // ==========================================================================
  bindGlobalNavigation() {
    const navButtons = document.querySelectorAll(".nav-tab-btn");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetView = btn.getAttribute("data-view");
        this.switchView(targetView);
        this.ui.playSound("click");
      });
    });

    const brandLogo = document.getElementById("nav-brand-logo");
    if (brandLogo) {
      brandLogo.addEventListener("click", () => {
        this.switchView("hero-view");
        this.ui.playSound("click");
      });
    }
  }

  switchView(viewId) {
    this.currentView = viewId;

    // View sectionlarni almashtirish
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });
    const targetSec = document.getElementById(viewId);
    if (targetSec) {
      targetSec.classList.add("active");
    }

    // Nav tugmalar holatini yangilash
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-view") === viewId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Agar kursga o'tsa progressni yangilash
    if (viewId === "course-view") {
      this.renderCourseSidebar();
    }
  }

  // ==========================================================================
  // Foydalanuvchi Profili va Lead Capture
  // ==========================================================================
  bindUserModal() {
    const profileBtn = document.getElementById("user-profile-btn");
    const modal = document.getElementById("user-modal");
    const closeBtn = document.getElementById("user-modal-close");
    const form = document.getElementById("user-profile-form");

    if (profileBtn && modal) {
      profileBtn.addEventListener("click", () => {
        const user = StorageManager.getUser();
        if (user) {
          document.getElementById("input-user-name").value = user.name || "";
          document.getElementById("input-user-contact").value = user.contact || "";
        }
        modal.classList.add("open");
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("input-user-name").value.trim();
        const contact = document.getElementById("input-user-contact").value.trim();

        if (name && contact) {
          StorageManager.setUser({ name, contact });
          this.updateUserUI();
          modal.classList.remove("open");
          this.ui.showToast(`Xush kelibsiz, ${name}! Profilingiz saqlandi.`, "success");
          this.ui.playSound("success");
        }
      });
    }
  }

  updateUserUI() {
    const user = StorageManager.getUser();
    const nameEl = document.getElementById("nav-user-name");
    const avatarEl = document.getElementById("nav-user-avatar");

    if (user && user.name) {
      nameEl.textContent = user.name.split(" ")[0];
      const initials = user.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
      avatarEl.textContent = initials || "EM";
    } else {
      nameEl.textContent = "Mehmon";
      avatarEl.textContent = "EM";
    }
  }

  // ==========================================================================
  // Hero / Landing Actions
  // ==========================================================================
  bindHeroActions() {
    const startDiagBtn = document.getElementById("hero-start-diag-btn");
    const directCourseBtn = document.getElementById("hero-direct-course-btn");

    if (startDiagBtn) {
      startDiagBtn.addEventListener("click", () => {
        this.switchView("diagnostic-view");
        this.startDiagnosticTest();
        this.ui.playSound("click");
      });
    }

    if (directCourseBtn) {
      directCourseBtn.addEventListener("click", () => {
        this.switchView("course-view");
        this.ui.playSound("click");
      });
    }
  }

  // ==========================================================================
  // Diagnostika (Placement Test) Mantiqi
  // ==========================================================================
  startDiagnosticTest() {
    this.diagCurrentStep = 0;
    this.diagAnswers = [];
    document.getElementById("diag-question-container").style.display = "block";
    document.getElementById("diag-result-container").style.display = "none";
    this.renderDiagnosticStep();
  }

  renderDiagnosticStep() {
    const total = DIAGNOSTIC_QUESTIONS.length;
    const qData = DIAGNOSTIC_QUESTIONS[this.diagCurrentStep];
    if (!qData) {
      this.finishDiagnosticTest();
      return;
    }

    // Step va progress bar yangilash
    document.getElementById("diag-step-label").textContent = `${this.diagCurrentStep + 1}-Savol (Jami ${total} ta)`;
    const progressPercent = ((this.diagCurrentStep + 1) / total) * 100;
    document.getElementById("diag-progress-bar").style.width = `${progressPercent}%`;

    const container = document.getElementById("diag-question-container");
    container.innerHTML = `
      <h2 class="diag-question-title">
        <i class="${qData.icon} diag-q-icon"></i>
        <span>${qData.question}</span>
      </h2>
      <div class="diag-options-list">
        ${qData.options.map((opt, idx) => `
          <button class="diag-option-btn" data-opt-idx="${idx}">
            <div class="diag-opt-text">
              <strong>${opt.text}</strong>
              <span>${opt.desc}</span>
            </div>
            <i class="fa-solid fa-chevron-right diag-opt-arrow"></i>
          </button>
        `).join("")}
      </div>
    `;

    // Tanlash hodisalari
    const optButtons = container.querySelectorAll(".diag-option-btn");
    optButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-opt-idx"), 10);
        this.selectDiagnosticOption(idx);
      });
    });
  }

  selectDiagnosticOption(optIndex) {
    const qData = DIAGNOSTIC_QUESTIONS[this.diagCurrentStep];
    const selected = qData.options[optIndex];
    this.diagAnswers.push({
      questionId: qData.id,
      questionText: qData.question,
      selectedText: selected.text,
      score: selected.score || 0
    });

    this.ui.playSound("click");
    this.diagCurrentStep++;

    if (this.diagCurrentStep < DIAGNOSTIC_QUESTIONS.length) {
      this.renderDiagnosticStep();
    } else {
      this.finishDiagnosticTest();
    }
  }

  finishDiagnosticTest() {
    const totalScore = this.diagAnswers.reduce((acc, curr) => acc + curr.score, 0);
    let levelTitle = "0-Daraja (Boshlang'ich Poydevor)";
    let levelDesc = "Diagnostika natijasiga ko'ra, siz uchun Excel asoslari, kataklar bilan to'g'ri ishlash va ilk formulalarni o'rganish juda mos keladi.";

    if (totalScore >= 5) {
      levelTitle = "0-Daraja Tezkor Kurs & Pro Tayyorgarlik";
      levelDesc = "Sizda ma'lum darajada tajriba bor. 0-darajaning trenajor checkpointidan tezkor o'tib, Pro kursimizga tayyorlanishingiz mumkin!";
    }

    // Saqlash
    StorageManager.setDiagnosticResult({
      answers: this.diagAnswers,
      totalScore,
      recommendedLevel: levelTitle
    });

    document.getElementById("diag-question-container").style.display = "none";
    document.getElementById("diag-result-container").style.display = "block";
    document.getElementById("diag-result-level-title").textContent = levelTitle;
    document.getElementById("diag-result-level-desc").textContent = levelDesc;

    this.ui.playSound("fanfare");
    this.ui.launchConfetti();

    // Agar foydalanuvchi ma'lumoti bo'lmasa, lead capture modalini ko'rsatamiz
    const user = StorageManager.getUser();
    if (!user || !user.name) {
      setTimeout(() => {
        document.getElementById("user-modal").classList.add("open");
      }, 900);
    }
  }

  bindDiagnosticEvents() {
    const continueBtn = document.getElementById("diag-continue-to-course-btn");
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        this.switchView("course-view");
        this.ui.playSound("click");
      });
    }
  }

  // ==========================================================================
  // 0-Daraja Kursi (LMS) Mantiqi
  // ==========================================================================
  renderCourseSidebar() {
    const progress = StorageManager.getLessonsProgress();
    const listContainer = document.getElementById("sidebar-lessons-list");
    if (!listContainer) return;

    const completedCount = progress.completedLessonIds.length;
    const totalCount = COURSE_LESSONS.length;
    const percent = Math.round((completedCount / totalCount) * 100);

    document.getElementById("course-progress-text").textContent = `${completedCount}/${totalCount} Tugallandi (${percent}%)`;
    document.getElementById("course-progress-bar-fill").style.width = `${percent}%`;

    listContainer.innerHTML = COURSE_LESSONS.map((lesson) => {
      const isUnlocked = progress.unlockedLessonIds.includes(lesson.id);
      const isCompleted = progress.completedLessonIds.includes(lesson.id);
      const isActive = lesson.id === this.currentLessonId;

      let statusIcon = '<i class="fa-solid fa-lock"></i>';
      let itemClass = "lesson-item-btn";

      if (isCompleted) {
        statusIcon = '<i class="fa-solid fa-circle-check"></i>';
        itemClass += " completed";
      } else if (isUnlocked) {
        statusIcon = '<i class="fa-regular fa-circle-play"></i>';
      } else {
        itemClass += " locked";
      }

      if (isActive) itemClass += " active";

      return `
        <button class="${itemClass}" data-lesson-id="${lesson.id}" ${!isUnlocked ? "disabled" : ""}>
          <span class="lesson-status-icon">${statusIcon}</span>
          <div class="lesson-item-info">
            <div class="lesson-item-title">${lesson.id}. ${lesson.title}</div>
            <div class="lesson-item-meta">${lesson.duration}</div>
          </div>
        </button>
      `;
    }).join("");

    // Darsni bosganda yuklash
    listContainer.querySelectorAll(".lesson-item-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-lesson-id"), 10);
        if (id) {
          this.loadLesson(id);
          this.ui.playSound("click");
        }
      });
    });
  }

  loadLesson(lessonId) {
    const lesson = COURSE_LESSONS.find(l => l.id === lessonId);
    if (!lesson) return;

    this.currentLessonId = lessonId;
    StorageManager.setCurrentLessonId(lessonId);

    // Sidebar faolligini yangilash
    this.renderCourseSidebar();

    // Sarlavha va meta
    document.getElementById("lesson-module-pill").textContent = lesson.module;
    document.getElementById("lesson-duration-pill").innerHTML = `<i class="fa-regular fa-clock"></i> ${lesson.duration}`;
    document.getElementById("lesson-title-heading").textContent = `${lesson.id}-Dars: ${lesson.title}`;
    document.getElementById("lesson-summary-box").textContent = lesson.summary;
    document.getElementById("video-box-title").textContent = lesson.videoPlaceholder;
    document.getElementById("lesson-content-body").innerHTML = lesson.content;

    // Mini-Quizni tayyorlash
    this.renderLessonQuiz(lesson);

    // Oldingi / Keyingi tugmalar
    const prevBtn = document.getElementById("prev-lesson-btn");
    const nextBtn = document.getElementById("next-lesson-btn");
    const progress = StorageManager.getLessonsProgress();

    prevBtn.disabled = lessonId <= 1;
    nextBtn.disabled = !progress.unlockedLessonIds.includes(lessonId + 1);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderLessonQuiz(lesson) {
    const quiz = lesson.quiz;
    const questionEl = document.getElementById("lesson-quiz-question");
    const optionsContainer = document.getElementById("lesson-quiz-options");
    const feedbackBox = document.getElementById("lesson-quiz-feedback");

    feedbackBox.className = "quiz-feedback-box";
    feedbackBox.style.display = "none";

    questionEl.textContent = quiz.question;
    optionsContainer.innerHTML = quiz.options.map((opt, idx) => `
      <button class="quiz-opt-btn" data-quiz-idx="${idx}">
        <span>${opt.text}</span>
        <i class="fa-regular fa-circle"></i>
      </button>
    `).join("");

    optionsContainer.querySelectorAll(".quiz-opt-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-quiz-idx"), 10);
        this.submitLessonQuiz(lesson, idx, btn);
      });
    });
  }

  submitLessonQuiz(lesson, optionIdx, clickedBtn) {
    const quiz = lesson.quiz;
    const selected = quiz.options[optionIdx];
    const optionsContainer = document.getElementById("lesson-quiz-options");
    const feedbackBox = document.getElementById("lesson-quiz-feedback");

    // Tugmalarni nofaol qilish
    optionsContainer.querySelectorAll(".quiz-opt-btn").forEach(b => {
      b.disabled = true;
    });

    if (selected.isCorrect) {
      clickedBtn.classList.add("correct");
      clickedBtn.querySelector("i").className = "fa-solid fa-circle-check";
      feedbackBox.className = "quiz-feedback-box show success";
      feedbackBox.innerHTML = `<strong>Ajoyib!</strong> ${selected.feedback || "To'g'ri javob berdingiz!"}`;

      // Darsni tugatish va keyingisini ochish
      StorageManager.completeLesson(lesson.id);
      this.renderCourseSidebar();
      this.ui.playSound("correct");
      this.ui.showToast("Dars muvaffaqiyatli yakunlandi! Keyingi dars ochildi.", "success");

      // Keyingi tugmani faollashtirish
      const nextBtn = document.getElementById("next-lesson-btn");
      if (lesson.id < COURSE_LESSONS.length) {
        nextBtn.disabled = false;
      }
    } else {
      clickedBtn.classList.add("wrong");
      clickedBtn.querySelector("i").className = "fa-solid fa-circle-xmark";
      feedbackBox.className = "quiz-feedback-box show error";
      feedbackBox.innerHTML = `<strong>Xato:</strong> Ushbu javob noto'g'ri. Dars matnini qayta ko'rib chiqib, yana urinib ko'ring.`;

      this.ui.playSound("error");
      setTimeout(() => {
        optionsContainer.querySelectorAll(".quiz-opt-btn").forEach(b => {
          b.disabled = false;
          b.classList.remove("wrong", "correct");
          b.querySelector("i").className = "fa-regular fa-circle";
        });
      }, 1500);
    }
  }

  bindCourseEvents() {
    const prevBtn = document.getElementById("prev-lesson-btn");
    const nextBtn = document.getElementById("next-lesson-btn");
    const goTrainerBtn = document.getElementById("sidebar-go-trainer-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (this.currentLessonId > 1) {
          this.loadLesson(this.currentLessonId - 1);
          this.ui.playSound("click");
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (this.currentLessonId < COURSE_LESSONS.length) {
          this.loadLesson(this.currentLessonId + 1);
          this.ui.playSound("click");
        }
      });
    }

    if (goTrainerBtn) {
      goTrainerBtn.addEventListener("click", () => {
        this.switchView("trainer-view");
        this.ui.playSound("click");
      });
    }

    const videoPlayTrigger = document.getElementById("video-play-trigger");
    if (videoPlayTrigger) {
      videoPlayTrigger.addEventListener("click", () => {
        this.ui.showToast("Video darslik namoyishi faollashtirildi!", "info");
        this.ui.playSound("click");
      });
    }
  }

  // ==========================================================================
  // Formula Trenajori (Interactive Excel Simulator Checkpoint)
  // ==========================================================================
  loadTrainerTask(taskId) {
    const task = TRAINER_TASKS.find(t => t.id === taskId);
    if (!task) return;

    this.currentTaskId = taskId;
    this.selectedCell = task.targetCell;

    // Header info
    document.getElementById("trainer-progress-badge").textContent = `Vazifa: ${taskId} / ${TRAINER_TASKS.length}`;
    document.getElementById("trainer-task-title").textContent = task.title;
    document.getElementById("trainer-task-instruction").innerHTML = task.instruction;
    document.getElementById("trainer-task-hint").textContent = `Maslahat: ${task.hint}`;

    // Formula bar tozalash
    const formulaInput = document.getElementById("excel-formula-input");
    formulaInput.value = "";
    document.getElementById("excel-active-cell-name").textContent = task.targetCell;

    // Feedback alertni yashirish
    const feedbackAlert = document.getElementById("trainer-feedback-alert");
    feedbackAlert.className = "trainer-feedback-alert";
    feedbackAlert.style.display = "none";
    document.getElementById("trainer-next-task-btn").style.display = "none";

    // Excel Grid jadvalini chizish
    this.renderExcelGrid(task);
  }

  renderExcelGrid(task) {
    const table = document.getElementById("excel-grid-table");
    const gridData = task.gridData;

    let html = `
      <thead>
        <tr>
          <th class="excel-header-corner"></th>
          ${gridData.headers.map(h => `<th class="excel-col-header">${h}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
    `;

    gridData.rows.forEach(r => {
      html += `<tr>`;
      html += `<td class="excel-row-header">${r.row}</td>`;
      gridData.headers.forEach(h => {
        const cellCoord = `${h}${r.row}`;
        const val = r.cells[h] !== undefined ? r.cells[h] : "";
        const isTarget = cellCoord === task.targetCell;
        let cellClass = "excel-cell";
        if (isTarget) cellClass += " target-pulse active-selected";

        html += `
          <td class="${cellClass}" 
              data-cell="${cellCoord}" 
              data-val="${val}" 
              id="cell-${cellCoord}">
            ${typeof val === "number" ? val.toLocaleString() : val}
          </td>
        `;
      });
      html += `</tr>`;
    });

    html += `</tbody>`;
    table.innerHTML = html;

    // Katakni bosganda tanlash
    table.querySelectorAll(".excel-cell").forEach(td => {
      td.addEventListener("click", () => {
        const cellCoord = td.getAttribute("data-cell");
        this.selectExcelCell(cellCoord);
      });
    });
  }

  selectExcelCell(coord) {
    this.selectedCell = coord;
    document.getElementById("excel-active-cell-name").textContent = coord;

    document.querySelectorAll(".excel-cell").forEach(td => {
      td.classList.remove("active-selected");
    });
    const selectedEl = document.getElementById(`cell-${coord}`);
    if (selectedEl) {
      selectedEl.classList.add("active-selected");
    }

    const formulaInput = document.getElementById("excel-formula-input");
    formulaInput.focus();
  }

  submitTrainerFormula() {
    const task = TRAINER_TASKS.find(t => t.id === this.currentTaskId);
    if (!task) return;

    const formulaInput = document.getElementById("excel-formula-input");
    const rawFormula = formulaInput.value.trim();

    if (!rawFormula) {
      this.ui.showToast("Iltimos, formula kiriting!", "warning");
      return;
    }

    const validation = this.formulaEngine.validateTask(rawFormula, task);
    const feedbackAlert = document.getElementById("trainer-feedback-alert");
    const feedbackMsg = document.getElementById("trainer-feedback-message");
    const nextTaskBtn = document.getElementById("trainer-next-task-btn");
    const targetCellEl = document.getElementById(`cell-${task.targetCell}`);

    if (validation.isCorrect) {
      // To'g'ri javob
      this.trainerScores[task.id] = true;
      feedbackAlert.className = "trainer-feedback-alert show success";
      feedbackMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Barakalla!</strong> ${validation.message}`;
      nextTaskBtn.style.display = "inline-flex";

      if (targetCellEl) {
        targetCellEl.classList.remove("target-pulse", "cell-error");
        targetCellEl.classList.add("cell-success");
        targetCellEl.textContent = typeof validation.userResult === "number" 
          ? validation.userResult.toLocaleString() 
          : validation.userResult;
      }

      this.ui.playSound("correct");
      this.ui.launchConfetti();
      this.ui.showToast("Formula to'g'ri hisoblandi!", "success");

      // Progress saqlash
      const tProgress = StorageManager.getTrainerProgress();
      if (!tProgress.completedTaskIds.includes(task.id)) {
        tProgress.completedTaskIds.push(task.id);
      }
      StorageManager.setTrainerProgress(tProgress);
    } else {
      // Xato
      feedbackAlert.className = "trainer-feedback-alert show error";
      feedbackMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${validation.message}`;
      nextTaskBtn.style.display = "none";

      if (targetCellEl) {
        targetCellEl.classList.add("cell-error");
      }

      this.ui.playSound("error");
    }
  }

  bindTrainerEvents() {
    const submitBtn = document.getElementById("excel-formula-submit-btn");
    const formulaInput = document.getElementById("excel-formula-input");
    const nextTaskBtn = document.getElementById("trainer-next-task-btn");

    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        this.submitTrainerFormula();
      });
    }

    if (formulaInput) {
      formulaInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.submitTrainerFormula();
        }
      });
    }

    if (nextTaskBtn) {
      nextTaskBtn.addEventListener("click", () => {
        if (this.currentTaskId < TRAINER_TASKS.length) {
          this.loadTrainerTask(this.currentTaskId + 1);
          this.ui.playSound("click");
        } else {
          this.finishTrainerCheckpoint();
        }
      });
    }
  }

  finishTrainerCheckpoint() {
    const total = TRAINER_TASKS.length;
    const correctCount = Object.keys(this.trainerScores).length;
    const percent = Math.round((correctCount / total) * 100);

    const congratsModal = document.getElementById("congrats-modal");
    document.getElementById("congrats-score-pill").textContent = `Natija: ${correctCount}/${total} to'g'ri (${percent}%)`;

    const tProgress = StorageManager.getTrainerProgress();
    tProgress.bestScore = percent;
    tProgress.passedCheckpoint = percent >= 80;
    StorageManager.setTrainerProgress(tProgress);

    congratsModal.classList.add("open");
    this.ui.playSound("fanfare");
    this.ui.launchConfetti();
  }

  bindCongratsModal() {
    const modal = document.getElementById("congrats-modal");
    const closeBtn = document.getElementById("congrats-modal-close");
    const retryBtn = document.getElementById("congrats-retry-btn");
    const proBtn = document.getElementById("congrats-pro-btn");

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    }

    if (retryBtn && modal) {
      retryBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        this.trainerScores = {};
        this.loadTrainerTask(1);
      });
    }

    if (proBtn && modal) {
      proBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        this.ui.showToast("Pro Daraja moduli tez orada ishga tushadi!", "info");
      });
    }
  }
}

// Ilovani ishga tushirish
document.addEventListener("DOMContentLoaded", () => {
  window.excelMastersApp = new ExcelMastersApp();
});
