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
    this.initGoogleAuth();
    this.bindGoogleAuthEvents();
    this.bindHeroActions();
    this.bindDiagnosticEvents();
    this.bindCourseEvents();
    this.bindTrainerEvents();
    this.bindCongratsModal();
    this.bindCertificateEvents();
    this.bindLeaderboardEvents();
    this.bindAiHelperEvents();

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
  // Foydalanuvchi Profili, Google Auth & Lead Capture
  // ==========================================================================
  initGoogleAuth() {
    // Global Google Identity Services Callback
    window.handleGoogleCredentialResponse = (response) => {
      if (response && response.credential) {
        const payload = this.parseJwt(response.credential);
        if (payload) {
          this.handleGoogleSignIn({
            name: payload.name || payload.email.split("@")[0],
            email: payload.email,
            avatar: payload.picture,
            googleId: payload.sub,
            provider: "google"
          });
        }
      }
    };
  }

  parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT parse error", e);
      return null;
    }
  }

  bindGoogleAuthEvents() {
    const googleBtn = document.getElementById("btn-google-login");
    const googleSimModal = document.getElementById("google-sim-modal");
    const googleSimClose = document.getElementById("google-sim-close");
    const customGoogleSubmit = document.getElementById("btn-custom-google-submit");
    const customGoogleEmailInput = document.getElementById("custom-google-email");
    const logoutBtn = document.getElementById("btn-logout-user");
    const editProfileBtn = document.getElementById("btn-edit-profile");

    // Google tugmasi bosilganda simulyatsiya / hisob tanlash modalini ochish
    if (googleBtn && googleSimModal) {
      googleBtn.addEventListener("click", () => {
        const userModal = document.getElementById("user-modal");
        if (userModal) userModal.classList.remove("open");
        googleSimModal.classList.add("open");
        this.ui.playSound("click");
      });
    }

    if (googleSimClose && googleSimModal) {
      googleSimClose.addEventListener("click", () => {
        googleSimModal.classList.remove("open");
      });
    }

    // Tayyor Google account ro'yxatidan tanlash
    const acctItems = document.querySelectorAll(".google-acct-item");
    acctItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        const email = btn.getAttribute("data-email");
        const avatar = btn.getAttribute("data-avatar");

        this.handleGoogleSignIn({
          name: name,
          email: email,
          avatar: avatar,
          provider: "google"
        });

        if (googleSimModal) googleSimModal.classList.remove("open");
      });
    });

    // Custom Google Email kiritish
    if (customGoogleSubmit && customGoogleEmailInput) {
      customGoogleSubmit.addEventListener("click", () => {
        const emailVal = customGoogleEmailInput.value.trim();
        if (emailVal && emailVal.includes("@")) {
          const nameFromEmail = emailVal.split("@")[0].replace(/[._]/g, " ");
          const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
          const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emailVal)}`;

          this.handleGoogleSignIn({
            name: formattedName,
            email: emailVal,
            avatar: avatarUrl,
            provider: "google"
          });

          if (googleSimModal) googleSimModal.classList.remove("open");
        } else {
          this.ui.showToast("Iltimos, to'g'ri email manzilini kiriting!", "error");
        }
      });
    }

    // Tizimdan chiqish
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        StorageManager.clearUser();
        this.updateUserUI();
        const userModal = document.getElementById("user-modal");
        if (userModal) userModal.classList.remove("open");
        this.ui.showToast("Tizimdan chiqdingiz.", "info");
        this.ui.playSound("click");
      });
    }

    // Profilni tahrirlash (Edit)
    if (editProfileBtn) {
      editProfileBtn.addEventListener("click", () => {
        const loggedOutView = document.getElementById("user-logged-out-view");
        const loggedInView = document.getElementById("user-logged-in-view");
        if (loggedOutView && loggedInView) {
          loggedInView.style.display = "none";
          loggedOutView.style.display = "block";
        }
      });
    }
  }

  handleGoogleSignIn(userData) {
    const savedUser = StorageManager.setUser({
      name: userData.name,
      contact: userData.email,
      email: userData.email,
      avatar: userData.avatar,
      provider: userData.provider || "google"
    });

    this.updateUserUI();
    this.ui.showToast(`Google orqali kirdingiz: ${userData.name}!`, "success");
    this.ui.playSound("success");

    const userModal = document.getElementById("user-modal");
    if (userModal) userModal.classList.remove("open");
  }

  bindUserModal() {
    const profileBtn = document.getElementById("user-profile-btn");
    const modal = document.getElementById("user-modal");
    const closeBtn = document.getElementById("user-modal-close");
    const form = document.getElementById("user-profile-form");

    if (profileBtn && modal) {
      profileBtn.addEventListener("click", () => {
        this.updateUserUI();
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
          StorageManager.setUser({ name, contact, provider: "standard" });
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

    const loggedOutView = document.getElementById("user-logged-out-view");
    const loggedInView = document.getElementById("user-logged-in-view");
    const modalTitle = document.getElementById("user-modal-title");
    const modalSubtitle = document.getElementById("user-modal-subtitle");

    const xpEl = document.getElementById("nav-user-xp");
    if (xpEl) {
      const currentXP = user && user.xp !== undefined ? user.xp : 150;
      xpEl.textContent = `${currentXP} XP`;
    }

    if (user && user.name) {
      // Nav Header Update
      const firstName = user.name.split(" ")[0];
      nameEl.textContent = firstName;

      if (user.avatar) {
        avatarEl.innerHTML = `<img src="${user.avatar}" alt="${user.name}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
      } else {
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
        avatarEl.textContent = initials || "EM";
      }

      // User Modal Update (Logged-In View)
      if (loggedOutView && loggedInView) {
        loggedOutView.style.display = "none";
        loggedInView.style.display = "block";
      }

      if (modalTitle) modalTitle.textContent = "Sizning Profilingiz";
      if (modalSubtitle) modalSubtitle.textContent = user.provider === "google" ? "Google orqali tasdiqlangan hisob" : "Saqlangan profil ma'lumotlaringiz";

      // Profile details
      const profileName = document.getElementById("profile-display-name");
      const profileContact = document.getElementById("profile-display-contact");
      const profileAvatarLarge = document.getElementById("profile-avatar-large");
      const providerBadge = document.getElementById("profile-provider-badge");

      if (profileName) profileName.textContent = user.name;
      if (profileContact) profileContact.textContent = user.contact || user.email || "";

      if (profileAvatarLarge) {
        if (user.avatar) {
          profileAvatarLarge.innerHTML = `<img src="${user.avatar}" alt="${user.name}">`;
        } else {
          const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
          profileAvatarLarge.textContent = initials || "EM";
        }
      }

      if (providerBadge) {
        providerBadge.style.display = user.provider === "google" ? "flex" : "none";
      }

      // Stats Update
      const diagRes = StorageManager.getDiagnosticResult();
      const lessonsProg = StorageManager.getLessonsProgress();
      const profileStatDiag = document.getElementById("profile-stat-diag");
      const profileStatLessons = document.getElementById("profile-stat-lessons");

      if (profileStatDiag) {
        profileStatDiag.textContent = diagRes ? `${diagRes.levelName || "Yakunlangan"}` : "Boshlanmagan";
      }
      if (profileStatLessons) {
        const count = lessonsProg && lessonsProg.completedLessonIds ? lessonsProg.completedLessonIds.length : 0;
        profileStatLessons.textContent = `${count}/8 Tugallandi`;
      }
    } else {
      // Nav Header Reset
      nameEl.textContent = "Mehmon";
      avatarEl.textContent = "EM";

      // Form inputs reset
      const inputName = document.getElementById("input-user-name");
      const inputContact = document.getElementById("input-user-contact");
      if (inputName) inputName.value = "";
      if (inputContact) inputContact.value = "";

      // User Modal Update (Logged-Out View)
      if (loggedOutView && loggedInView) {
        loggedOutView.style.display = "block";
        loggedInView.style.display = "none";
      }
      if (modalTitle) modalTitle.textContent = "Foydalanuvchi Profili";
      if (modalSubtitle) modalSubtitle.textContent = "Natijalaringiz va progressni saqlash uchun ma'lumotlaringizni kiriting:";
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

    const certBtn = document.getElementById("congrats-cert-btn");
    if (certBtn) {
      certBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        this.openCertificateModal();
      });
    }
  }

  // ==========================================================================
  // 1. Rasmiy Sertifikat Generatori
  // ==========================================================================
  bindCertificateEvents() {
    const modal = document.getElementById("certificate-modal");
    const closeBtn = document.getElementById("cert-modal-close");
    const downloadBtn = document.getElementById("btn-download-cert-png");

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    }

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        this.ui.showToast("Sertifikat yuklanmoqda...", "info");
        setTimeout(() => {
          window.print();
        }, 300);
      });
    }
  }

  openCertificateModal() {
    const modal = document.getElementById("certificate-modal");
    const user = StorageManager.getUser() || { name: "Jasur Aliyev" };
    
    const nameEl = document.getElementById("cert-user-fullname");
    const dateEl = document.getElementById("cert-date-issued");
    const serialEl = document.getElementById("cert-serial-id");

    if (nameEl) nameEl.textContent = user.name || "Foydalanuvchi";
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString("ru-RU");
    if (serialEl) serialEl.textContent = `EM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (modal) modal.classList.add("open");
    this.ui.playSound("fanfare");
    this.ui.launchConfetti();
  }

  // ==========================================================================
  // 2. Liderlar Jadvali (Leaderboard & XP)
  // ==========================================================================
  bindLeaderboardEvents() {
    const btn = document.getElementById("nav-leaderboard-btn");
    const modal = document.getElementById("leaderboard-modal");
    const closeBtn = document.getElementById("leaderboard-modal-close");

    if (btn && modal) {
      btn.addEventListener("click", () => {
        this.renderLeaderboard();
        modal.classList.add("open");
        this.ui.playSound("click");
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    }
  }

  renderLeaderboard() {
    const container = document.getElementById("leaderboard-list-container");
    if (!container) return;

    const data = StorageManager.getLeaderboardData();
    container.innerHTML = data.map((item, idx) => `
      <div class="leaderboard-item ${item.isCurrent ? 'is-current' : ''}">
        <div class="rank-pill rank-${idx + 1}">${idx + 1}</div>
        ${item.avatar 
          ? `<img src="${item.avatar}" class="acct-img-avatar" style="width:34px; height:34px;">` 
          : `<div class="user-avatar" style="width:34px; height:34px; font-size:0.8rem;">${item.name.substring(0, 2).toUpperCase()}</div>`}
        <div class="lb-user-info">
          <span class="lb-user-name">${item.name} ${item.isCurrent ? '(Siz)' : ''}</span>
          <span class="lb-user-badge"><i class="fa-solid fa-medal text-gold"></i> ${item.badge}</span>
        </div>
        <span class="lb-user-xp"><i class="fa-solid fa-bolt text-gold"></i> ${item.xp} XP</span>
      </div>
    `).join("");
  }

  // ==========================================================================
  // 3. AI Excel Yordamchi Vidjeti
  // ==========================================================================
  bindAiHelperEvents() {
    const trigger = document.getElementById("ai-helper-trigger");
    const windowEl = document.getElementById("ai-chat-window");
    const closeBtn = document.getElementById("ai-chat-close");
    const sendBtn = document.getElementById("ai-chat-send-btn");
    const inputEl = document.getElementById("ai-chat-input");

    if (trigger && windowEl) {
      trigger.addEventListener("click", () => {
        windowEl.classList.toggle("open");
        this.ui.playSound("click");
      });
    }

    if (closeBtn && windowEl) {
      closeBtn.addEventListener("click", () => windowEl.classList.remove("open"));
    }

    const handleSend = () => {
      const q = inputEl.value.trim();
      if (!q) return;
      this.addAiChatMessage(q, "user");
      inputEl.value = "";
      setTimeout(() => {
        this.processAiQuery(q);
      }, 500);
    };

    if (sendBtn) sendBtn.addEventListener("click", handleSend);
    if (inputEl) {
      inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
      });
    }

    // Quick chips
    const chips = document.querySelectorAll(".ai-prompt-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const text = chip.getAttribute("data-prompt");
        this.addAiChatMessage(text, "user");
        setTimeout(() => {
          this.processAiQuery(text);
        }, 400);
      });
    });
  }

  addAiChatMessage(text, sender = "bot") {
    const messagesEl = document.getElementById("ai-chat-messages");
    if (!messagesEl) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-msg ai-msg-${sender}`;
    msgDiv.innerHTML = `<div class="msg-content">${text}</div>`;
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  processAiQuery(query) {
    const q = query.toLowerCase();
    let reply = "Ushbu formula haqida batafsil ma'lumot: Excel'da barcha formulalar <code>=</code> b-n boshlanadi. Kataklar diapazonini tanlash uchun <code>:</code> (masalan <code>B2:B6</code>) ishlatiladi.";

    if (q.includes("sum") || q.includes("yig'indi")) {
      reply = "<strong>СУММ (SUM)</strong> — belgilangan kataklar yoki diapazondagi barcha sonlar yig'indisini hisoblaydi.<br><em>Sintaksis:</em> <code>=СУММ(B2:B6)</code> yoki <code>=SUM(B2:B6)</code>.";
    } else if (q.includes("average") || q.includes("o'rtacha") || q.includes("срзнач")) {
      reply = "<strong>СРЗНАЧ (AVERAGE)</strong> — tanlangan diapazondagi sonlarning o'rtacha arifmetik qiymatini topadi.<br><em>Sintaksis:</em> <code>=СРЗНАЧ(B2:B7)</code>.";
    } else if (q.includes("$") || q.includes("qulflash") || q.includes("absolyut")) {
      reply = "<strong>$ (Absolyut manzil)</strong> — formulani boshqa kataklarga nusxalaganimizda katak manzili o'zgarib ketmasligi uchun ishlatiladi.<br><em>Misol:</em> <code>$D$1</code> — ustun va qatorni qat'iy qulflaydi.";
    } else if (q.includes("vlookup") || q.includes("впр")) {
      reply = "<strong>ВПР (VLOOKUP)</strong> — jadvalning 1-ustunidan qidirilayotgan qiymatni topib, unga mos ustundagi ma'lumotni qaytaradi.<br><em>Sintaksis:</em> <code>=ВПР(A2; A2:C10; 2; FALSE)</code>.";
    } else if (q.includes("if") || q.includes("если") || q.includes("shart")) {
      reply = "<strong>ЕСЛИ (IF)</strong> — berilgan mantiqiy shartni tekshiradi. Shart bajarilsa 1-qiymatni, bajarilmasa 2-qiymatni chiqaradi.<br><em>Sintaksis:</em> <code>=ЕСЛИ(B2>5000; \"A'lo\"; \"O'rtacha\")</code>.";
    }

    this.addAiChatMessage(reply, "bot");
    this.ui.playSound("success");
  }
}

// Ilovani ishga tushirish
document.addEventListener("DOMContentLoaded", () => {
  window.excelMastersApp = new ExcelMastersApp();
});
