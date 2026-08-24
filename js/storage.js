/**
 * Excel Masters MVP - State & LocalStorage Manager
 * Foydalanuvchi ma'lumotlari, diagnostika natijalari, darslar va trenajor progressini saqlash
 */

const STORAGE_KEYS = {
  USER: "excelmasters_user",
  DIAGNOSTIC: "excelmasters_diagnostic",
  LESSONS_PROGRESS: "excelmasters_lessons_progress",
  CURRENT_LESSON: "excelmasters_current_lesson",
  TRAINER_PROGRESS: "excelmasters_trainer_progress",
  SETTINGS: "excelmasters_settings"
};

export class StorageManager {
  // Foydalanuvchi ma'lumotlarini olish
  static getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Foydalanuvchi ma'lumotlarini saqlash
  static setUser(userObj) {
    try {
      const current = this.getUser() || {};
      const updated = {
        ...current,
        ...userObj,
        updatedAt: new Date().toISOString()
      };
      if (!updated.createdAt) {
        updated.createdAt = new Date().toISOString();
      }
      if (updated.xp === undefined) {
        updated.xp = 150; // Dastlabki bonus XP
      }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error("User storage error", e);
      return null;
    }
  }

  // XP qo'shish va darajani yangilash
  static addXP(amount) {
    const user = this.getUser();
    if (!user) return 0;
    const currentXP = user.xp || 0;
    const newXP = currentXP + amount;
    this.setUser({ xp: newXP });
    return newXP;
  }

  // Liderlar jadvali (Mock + Joriy foydalanuvchi)
  static getLeaderboardData() {
    const defaultLeaderboard = [
      { name: "Sardor Rahimov", xp: 850, badge: "Formula Ninja", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sardor" },
      { name: "Jasur Aliyev", xp: 720, badge: "Excel Master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasur" },
      { name: "Nilufar Rahimova", xp: 640, badge: "Speed Learner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nilufar" },
      { name: "Bekzod Umarov", xp: 510, badge: "Analyst", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bekzod" }
    ];

    const currentUser = this.getUser();
    if (currentUser && currentUser.name) {
      const userXP = currentUser.xp || 150;
      const existingIdx = defaultLeaderboard.findIndex(u => u.name.toLowerCase() === currentUser.name.toLowerCase());
      if (existingIdx >= 0) {
        defaultLeaderboard[existingIdx].xp = Math.max(defaultLeaderboard[existingIdx].xp, userXP);
      } else {
        defaultLeaderboard.push({
          name: currentUser.name,
          xp: userXP,
          badge: currentUser.provider === "google" ? "Google Verified" : "Excel Learner",
          avatar: currentUser.avatar || null,
          isCurrent: true
        });
      }
    }

    return defaultLeaderboard.sort((a, b) => b.xp - a.xp);
  }

  // Foydalanuvchini tizimdan chiqarish / tozalash
  static clearUser() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error("Clear user error", e);
    }
  }

  // Diagnostika natijalarini olish
  static getDiagnosticResult() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIAGNOSTIC);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Diagnostika natijalarini saqlash
  static setDiagnosticResult(resultObj) {
    try {
      const payload = {
        ...resultObj,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.DIAGNOSTIC, JSON.stringify(payload));
      return payload;
    } catch (e) {
      console.error("Diagnostic storage error", e);
      return null;
    }
  }

  // Joriy kurs ID si (boshlangich, pro, promax)
  static getCurrentCourseId() {
    try {
      return localStorage.getItem("excelmasters_current_course") || "boshlangich";
    } catch {
      return "boshlangich";
    }
  }

  static setCurrentCourseId(courseId) {
    try {
      localStorage.setItem("excelmasters_current_course", courseId);
    } catch (e) {
      console.error("Set course ID error", e);
    }
  }

  // Darslar progressini ko'rsatilgan kurs ID bo'yicha olish
  static getLessonsProgress(courseId = this.getCurrentCourseId()) {
    try {
      const key = `${STORAGE_KEYS.LESSONS_PROGRESS}_${courseId}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      // Dastlabki holatda 1-dars ochiq
      const initial = {
        completedLessonIds: [],
        unlockedLessonIds: [1],
        quizScores: {}
      };
      this.setLessonsProgress(initial, courseId);
      return initial;
    } catch {
      return { completedLessonIds: [], unlockedLessonIds: [1], quizScores: {} };
    }
  }

  // Darslar progressini saqlash
  static setLessonsProgress(progressObj, courseId = this.getCurrentCourseId()) {
    try {
      const key = `${STORAGE_KEYS.LESSONS_PROGRESS}_${courseId}`;
      localStorage.setItem(key, JSON.stringify(progressObj));
      return progressObj;
    } catch (e) {
      console.error("Lessons progress storage error", e);
      return null;
    }
  }

  // Darsni tugallangan deb belgilash va keyingisini ochish
  static completeLesson(lessonId, quizScore = 100, courseId = this.getCurrentCourseId()) {
    const progress = this.getLessonsProgress(courseId);
    if (!progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds.push(lessonId);
      this.addXP(50); // Darsni tugatgani uchun +50 XP
    }
    progress.quizScores[lessonId] = quizScore;

    // Keyingi darsni ochish (masalan lessonId + 1)
    const nextLessonId = lessonId + 1;
    if (!progress.unlockedLessonIds.includes(nextLessonId)) {
      progress.unlockedLessonIds.push(nextLessonId);
    }

    this.setLessonsProgress(progress, courseId);
    return progress;
  }

  // Oxirgi ko'rilgan dars ID
  static getCurrentLessonId(courseId = this.getCurrentCourseId()) {
    try {
      const id = localStorage.getItem(`${STORAGE_KEYS.CURRENT_LESSON}_${courseId}`);
      return id ? parseInt(id, 10) : 1;
    } catch {
      return 1;
    }
  }

  static setCurrentLessonId(lessonId, courseId = this.getCurrentCourseId()) {
    try {
      localStorage.setItem(`${STORAGE_KEYS.CURRENT_LESSON}_${courseId}`, lessonId.toString());
    } catch (e) {
      console.error("Current lesson storage error", e);
    }
  }

  // Formula trenajori natijalari
  static getTrainerProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRAINER_PROGRESS);
      if (data) return JSON.parse(data);
      const initial = {
        completedTaskIds: [],
        taskAttempts: {},
        bestScore: 0,
        passedCheckpoint: false
      };
      this.setTrainerProgress(initial);
      return initial;
    } catch {
      return { completedTaskIds: [], taskAttempts: {}, bestScore: 0, passedCheckpoint: false };
    }
  }

  static setTrainerProgress(trainerObj) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRAINER_PROGRESS, JSON.stringify(trainerObj));
      return trainerObj;
    } catch (e) {
      console.error("Trainer progress error", e);
      return null;
    }
  }

  // Barcha ma'lumotlarni tozalash (Restart qilish uchun)
  static resetAll() {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.error("Reset error", e);
    }
  }
}
