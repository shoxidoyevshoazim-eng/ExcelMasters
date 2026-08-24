/**
 * Excel Masters MVP - Ma'lumotlar Bazasi (Data Module)
 * Diagnostika savollari, 0-Daraja darslari va Formula trenajori topshiriqlari
 */

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    question: "Excel bilan avval ishlaganmisiz yoki tanishligingiz qanday?",
    icon: "fa-solid fa-chart-simple",
    options: [
      {
        text: "Umuman yo'q, noldan boshlayapman",
        desc: "Excel dasturini deyarli ochib ko'rmaganman yoki faqat oddiy matn yozganman",
        score: 0,
        recLevel: "0-daraja (Mutlaqo Boshlang'ich)"
      },
      {
        text: "Asosiy amallarni bilaman",
        desc: "Jadval chizish, katakchalarni bo'yash va oddiy qo'shish-ayirishni bilaman",
        score: 1,
        recLevel: "0-daraja (Poydevorni mustahkamlash)"
      },
      {
        text: "Formulalarni ozgina ishlataman",
        desc: "SUM, AVERAGE kabi tayyor funksiyalarni ishlatganman, lekin murakkab tahlillarda qiynalaman",
        score: 2,
        recLevel: "0-daraja tezkor o'tish & Pro tayyorgarlik"
      }
    ]
  },
  {
    id: 2,
    question: "Excel bilimlarini qaysi sohada qo'llamoqchisiz?",
    icon: "fa-solid fa-briefcase",
    options: [
      {
        text: "Moliya, buxgalteriya yoki hisob-kitob",
        desc: "Kirim-chiqim, oylik maoshlar va moliyaviy hisobotlar uchun",
        score: 1
      },
      {
        text: "Savdo, marketing va CRM tahlili",
        desc: "Mijozlar bazasi, savdo hajmi va dinamikani kuzatish uchun",
        score: 1
      },
      {
        text: "O'qish, shaxsiy boshqaruv yoki freelance",
        desc: "Shaxsiy byudjet, rejalashtirish yoki masofaviy ishlarda qo'llash",
        score: 1
      },
      {
        text: "Karyerada o'sish va yangi nufuzli ish topish",
        desc: "Rezyumeni kuchaytirish va zamonaviy ofis talablariga javob berish",
        score: 1
      }
    ]
  },
  {
    id: 3,
    question: "Quyidagi formulalardan qaysi birining vazifasini aniq bilasiz?",
    icon: "fa-solid fa-square-root-variable",
    options: [
      {
        text: "Hech birini bilmayman yoki adashtiraman",
        desc: "Formulalar qanday ishlashini to'liq tushunishni xohlayman",
        score: 0
      },
      {
        text: "Faqat =СУММ() yoki =SUM() yig'indisini bilaman",
        desc: "Boshqa formulalar sintaksisi va parametrlarini yaxshi bilmayman",
        score: 1
      },
      {
        text: "=ЕСЛИ() (IF), =ВПР() (VLOOKUP) yoki $A$1 qulflashni bilaman",
        desc: "Formulalar bilan tajribam bor, amaliyotda tezkorlik kerak",
        score: 2
      }
    ]
  },
  {
    id: 4,
    question: "Kuniga Excel o'rganish uchun qancha vaqt ajrata olasiz?",
    icon: "fa-solid fa-clock",
    options: [
      {
        text: "Kuniga 15-20 daqiqa (Tezkor mikro-darslar)",
        desc: "Kichik qadamlar bilan, har kuni muntazam ravishda",
        score: 1
      },
      {
        text: "Kuniga 45-60 daqiqa (Intensiv o'rganish)",
        desc: "Darslar va Formula trenajorida amaliy mashqlar qilib",
        score: 2
      },
      {
        text: "Hafta oxirlarida to'liq amaliyot",
        desc: "Dam olish kunlari to'liq botib o'rganish",
        score: 1
      }
    ]
  }
];

export const COURSE_LESSONS = [
  {
    id: 1,
    title: "Excel Interfeysi: Lenta, Kataklar va Varaqlar",
    duration: "10 daqiqa",
    module: "1-Modul: Asoslar",
    summary: "Excel muhitining anatomiyasi, Lenta (Ribbon) menyusi, Katakchalar koordinatalari va Varaqlar (Sheets) bilan to'g'ri ishlash qoidalari.",
    videoPlaceholder: "Excel Interfeysi & Navigatsiya Tahlili",
    content: `
      <h3>1. Excel Dasturining Asosiy Anatomiyasi</h3>
      <p>Excel — bu sonlar, matnlar va murakkab formulalar bilan ishlash uchun dunyodagi eng ommabop elektron jadval tizimidir. Uni professional boshqarish uchun avvalo 3 ta asosiy elementni yaxshi bilib olish zarur:</p>
      
      <div class="content-cards-grid">
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-layer-group"></i> <strong>Lenta (Ribbon)</strong></div>
          <p>Dasturning yuqori qismidagi asosiy boshqaruv paneli: <em>Главная (Home)</em>, <em>Вставка (Insert)</em>, <em>Формулы (Formulas)</em>, <em>Данные (Data)</em> kabi menyulardan iborat.</p>
        </div>
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-table-cells"></i> <strong>Katakcha (Cell)</strong></div>
          <p>Ustun (harflar: A, B, C...) va Qator (sonlar: 1, 2, 3...) kesishmasidagi asosiy birlik. Masalan: <code>B4</code> — B ustun va 4-qator kesishmasi.</p>
        </div>
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-file-excel"></i> <strong>Varaqlar (Worksheets)</strong></div>
          <p>Bitta ishchi kitob (Workbook) ichida bir nechta varaqlar yaratish, ularni qayta nomlash, rang berish va nusxalash mumkin.</p>
        </div>
      </div>

      <div class="tip-box">
        <i class="fa-solid fa-lightbulb"></i>
        <div>
          <strong>Qimmatli Maslahat:</strong> Nom maydoni (Name Box) — chap yuqoridagi katakcha nomini ko'rsatuvchi joyga istalgan manzilni (masalan, <code>Z100</code>) yozib <kbd>Enter</kbd> bossangiz, Excel sizni darhol o'sha katakka eltadi!
        </div>
      </div>

      <h3>2. Tezkor Navigatsiya Tugmalari</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tugmalar</th>
            <th>Vazifasi</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><kbd>Ctrl</kbd> + <kbd>→</kbd> / <kbd>↓</kbd></td><td>Jadvalning eng oxirgi to'ldirilgan katagiga sakrash</td></tr>
          <tr><td><kbd>Ctrl</kbd> + <kbd>Home</kbd></td><td>Har doim <code>A1</code> boshlang'ich katakka qaytish</td></tr>
          <tr><td><kbd>Shift</kbd> + <kbd>Space</kbd></td><td>Butun qatorni bir zumda belgilash</td></tr>
          <tr><td><kbd>Ctrl</kbd> + <kbd>Space</kbd></td><td>Butun ustunni bir zumda belgilash</td></tr>
        </tbody>
      </table>
    `,
    quiz: {
      question: "B ustunidagi 5-qator kesishmasida joylashgan katakchaning to'g'ri manzili qaysi?",
      options: [
        { text: "5B", isCorrect: false },
        { text: "B5", isCorrect: true, feedback: "Aynan to'g'ri! Excel'da avval ustun harfi, keyin qator raqami yoziladi." },
        { text: "B-5", isCorrect: false },
        { text: "Row5ColB", isCorrect: false }
      ]
    }
  },
  {
    id: 2,
    title: "Ma'lumot Turlari va To'g'ri Kiritish",
    duration: "12 daqiqa",
    module: "1-Modul: Asoslar",
    summary: "Excel'da matn, son, sana va mantiqiy qiymatlarni to'g'ri farqlash va hisob-kitoblarda xatolarga yo'l qo'ymaslik sirlari.",
    videoPlaceholder: "Ma'lumot Turlari & Xatoliklarni Oldini Olish",
    content: `
      <h3>1. Excel'da 4 Asosiy Ma'lumot Turi</h3>
      <p>Excelga kiritilgan har bir ma'lumot o'z xarakteriga ega. Agar ma'lumot turi noto'g'ri bo'lsa, formulalar hisoblamasdan <code>#VALUE!</code> xatosini qaytaradi.</p>

      <div class="types-grid">
        <div class="type-badge-card type-text">
          <span class="badge">Matn (Text)</span>
          <p>Ismlar, mahsulot nomlari, izohlar. Odatiy holatda katakning <strong>chap tomoniga</strong> tekislanadi.</p>
        </div>
        <div class="type-badge-card type-number">
          <span class="badge">Son (Number)</span>
          <p>Narxlar, miqdorlar, foizlar. Odatiy holatda katakning <strong>o'ng tomoniga</strong> tekislanadi.</p>
        </div>
        <div class="type-badge-card type-date">
          <span class="badge">Sana & Vaqt (Date)</span>
          <p>Excel aslida sanalarni 1900-yil 1-yanvardan boshlab ketma-ket sonlar sifatida saqlaydi.</p>
        </div>
        <div class="type-badge-card type-boolean">
          <span class="badge">Mantiqiy (TRUE / FALSE)</span>
          <p>Taqqoslash natijalari: <code>ROST (ИСТИНА)</code> yoki <code>YOLG'ON (ЛОЖЬ)</code>.</p>
        </div>
      </div>

      <div class="warning-box">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div>
          <strong>Ehtiyot bo'ling:</strong> Agar son kiritganingizda u katakning chap tomonida qolib ketsa, demak u matn formatida qabul qilingan! Masalan, son oldidan probel yoki nuqta-vergul xatosi bo'lishi mumkin.
        </div>
      </div>
    `,
    quiz: {
      question: "Excel katagiga to'g'ri son kiritilganda, u odatiy holatda qaysi tomonga tekislanadi?",
      options: [
        { text: "Chap tomonga", isCorrect: false },
        { text: "O'ng tomonga", isCorrect: true, feedback: "To'g'ri! Sonlar va sanalar avtomatik ravishda o'ng tomonga tekislanadi." },
        { text: "O'rtaga", isCorrect: false },
        { text: "Tepaga", isCorrect: false }
      ]
    }
  },
  {
    id: 3,
    title: "Katakchalarni Professional Formatlash",
    duration: "15 daqiqa",
    module: "2-Modul: Dizayn & Format",
    summary: "Pul birliklari (UZS, USD), sanalar formati, chegaralar (Borders) va shartli rang berish (Conditional Formatting).",
    videoPlaceholder: "Jadvallarni Professional Formatlash Sirlari",
    content: `
      <h3>1. Raqamli Formatlar — Nima Uchun Muhim?</h3>
      <p>Oddiy <code>1500000</code> sonini <code>1 500 000 so'm</code> yoki <code>$1,500.00</code> ko'rinishida formatlash hisob-kitob natijasini o'zgartirmaydi, lekin ko'rinishini juda o'qishli qiladi.</p>

      <div class="content-cards-grid">
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-money-bill-wave"></i> <strong>Pul Formati (Currency)</strong></div>
          <p>Raqamlarga minglik ajratkich (bo'sh joy) va so'm/USD belgilarini qo'shish.</p>
        </div>
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-percent"></i> <strong>Foiz Formati (Percentage)</strong></div>
          <p><code>0.15</code> qiymatini <code>15%</code> ko'rinishida chiqarish uchun <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>%</kbd> tugmasi.</p>
        </div>
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-calendar-days"></i> <strong>Sana Formati</strong></div>
          <p><code>DD.MM.YYYY</code> (masalan: 17.08.2026) yoki to'liq matnli sana formatlari.</p>
        </div>
      </div>

      <div class="tip-box">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <div>
          <strong>Format bo'yicha namunachi (Format Painter):</strong> Cho'tka belgisi orqali bitta chiroyli katakning shrifti, rangi va chegarasini boshqa barcha kataklarga 1 ta bosishda ko'chiring!
        </div>
      </div>
    `,
    quiz: {
      question: "Katakdagi 0.25 sonini tezda 25% ko'rinishiga o'tkazish uchun qaysi format tanlanadi?",
      options: [
        { text: "Matn (Text)", isCorrect: false },
        { text: "Foiz (Percentage)", isCorrect: true, feedback: "Barakalla! Foiz formati sonni 100 ga ko'paytirib, % belgisini qo'yadi." },
        { text: "Ilmiy (Scientific)", isCorrect: false },
        { text: "Maxsus (Special)", isCorrect: false }
      ]
    }
  },
  {
    id: 4,
    title: "Ilk Formulalar: SUM (СУММ) va AVERAGE (СРЗНАЧ)",
    duration: "18 daqiqa",
    module: "3-Modul: Asosiy Formulalar",
    summary: "Formulaning boshlanish qoidasi (=), kataklar diapazoni (A1:A10) bilan ishlash, yig'indi va o'rtacha qiymatni topish.",
    videoPlaceholder: "SUM va AVERAGE Formulalari Amaliyotda",
    content: `
      <h3>1. Har bir formula <code>=</code> belgisi bilan boshlanadi</h3>
      <p>Agar siz katakka <code>SUM(A1:A5)</code> deb yozsangiz, Excel uni oddiy matn deb o'ylaydi. Formula ishlashi uchun doimo <strong><code>=</code> (tenglik)</strong> belgisini qo'yish shart!</p>

      <div class="formula-spotlight">
        <div class="formula-box">
          <div class="formula-title">Yig'indini hisoblash (SUM):</div>
          <code>=СУММ(A2:A10)</code> yoki <code>=SUM(A2:A10)</code>
          <p>A2 dan A10 gacha bo'lgan barcha sonlar yig'indisini chiqaradi.</p>
        </div>
        <div class="formula-box">
          <div class="formula-title">O'rtacha qiymatni hisoblash (AVERAGE):</div>
          <code>=СРЗНАЧ(B2:B10)</code> yoki <code>=AVERAGE(B2:B10)</code>
          <p>Kataklardagi sonlarning o'rtacha arifmetik qiymatini avtomatik topadi.</p>
        </div>
      </div>

      <div class="tip-box">
        <i class="fa-solid fa-bolt"></i>
        <div>
          <strong>Avto-yig'indi super-tezkor tugmasi:</strong> <kbd>Alt</kbd> + <kbd>=</kbd> tugmalarini bosing — Excel sizning o'rningizga tepasidagi barcha sonlarni o'zi tanlab <code>=СУММ()</code> formulasini qo'yib beradi!
        </div>
      </div>
    `,
    quiz: {
      question: "A1 dan A5 gacha bo'lgan barcha sonlarning o'rtacha qiymatini hisoblovchi to'g'ri formula qaysi?",
      options: [
        { text: "AVERAGE(A1-A5)", isCorrect: false },
        { text: "=СРЗНАЧ(A1:A5)", isCorrect: true, feedback: "Ajoyib! =СРЗНАЧ(A1:A5) yoki =AVERAGE(A1:A5) to'g'ri diapazon sintaksisi." },
        { text: "=SUM(A1:A5)/平均", isCorrect: false },
        { text: "A1:A5 = AVERAGE", isCorrect: false }
      ]
    }
  },
  {
    id: 5,
    title: "Sanash Formulalari: COUNT (СЧЁТ) va COUNTA (СЧЁТЗ)",
    duration: "14 daqiqa",
    module: "3-Modul: Asosiy Formulalar",
    summary: "Faqat sonli kataklarni sanash (COUNT) va bo'sh bo'lmagan barcha kataklarni sanash (COUNTA) o'rtasidagi farq.",
    videoPlaceholder: "COUNT va COUNTA Funksiyalari Farqi",
    content: `
      <h3>1. COUNT va COUNTA farqini bilasizmi?</h3>
      <p>Jadvalda nechta mijoz yoki nechta sotuv amalga oshirilganini sanashda ko'pchilik xatoga yo'l qo'yadi. Mana bu ikkisining asosiy farqi:</p>

      <div class="comparison-grid">
        <div class="comp-col">
          <h4><code>=СЧЁТ()</code> / <code>=COUNT()</code></h4>
          <span class="badge blue">Faqat Sonlarni Sanaydi</span>
          <p>Agar katakda matn (masalan, ism) yoki bo'sh joy bo'lsa, ularni hisobga olmaydi. Faqat raqamli kataklarni sanaydi.</p>
          <div class="example-code">=СЧЁТ(A2:A10)</div>
        </div>
        <div class="comp-col">
          <h4><code>=СЧЁТЗ()</code> / <code>=COUNTA()</code></h4>
          <span class="badge green">Bo'sh Bo'lmagan Hammasini Sanaydi</span>
          <p>Katakda matn, son yoki belgi bo'lishidan qat'i nazar, agar katak bo'sh bo'lmasa uni 1 ta deb sanaydi.</p>
          <div class="example-code">=СЧЁТЗ(B2:B10)</div>
        </div>
      </div>
    `,
    quiz: {
      question: "Agar A ustunda xodimlarning ismlari (matn) yozilgan bo'lsa, xodimlar sonini sanash uchun qaysi formula to'g'ri keladi?",
      options: [
        { text: "=СЧЁТ(A2:A20)", isCorrect: false },
        { text: "=СЧЁТЗ(A2:A20)", isCorrect: true, feedback: "To'g'ri! Ismlar matn bo'lgani uchun =СЧЁТЗ (COUNTA) ishlatiladi." },
        { text: "=СУММ(A2:A20)", isCorrect: false },
        { text: "=COUNTNUM(A2:A20)", isCorrect: false }
      ]
    }
  },
  {
    id: 6,
    title: "Nisbiy va Absolyut Manzillar ($ Belgisi Siri)",
    duration: "20 daqiqa",
    module: "4-Modul: Professional Texnikalar",
    summary: "Formulalarni pastga tortganda nima uchun siljishi va qachon $A$1 qulflash (F4 tugmasi) kerakligi.",
    videoPlaceholder: "$ Manzil Qulflash va F4 Sehri",
    content: `
      <h3>1. Nisbiy manzil (Relative Reference) nima?</h3>
      <p>Masalan, <code>=A2*B2</code> formulasini yozib pastga tortganingizda, keyingi qatorda u avtomatik <code>=A3*B3</code> ga aylanadi. Bu <em>nisbiy manzil</em> deyiladi.</p>

      <h3>2. Absolyut manzil ($ Belgisi) nima uchun kerak?</h3>
      <p>Agar siz barcha narxlarni bitta katakdagi Dollar kursiga (masalan <code>D1</code>) ko'paytirmoqchi bo'lsangiz, formulani pastga tortganda <code>D1</code> katakcha <code>D2</code>, <code>D3</code> ga siljib ketmasligi uchun uni <strong>qulflash</strong> kerak!</p>

      <div class="formula-spotlight">
        <div class="formula-box highlight">
          <div class="formula-title">Qulflangan Formula:</div>
          <code>=A2 * $D$1</code>
          <p>Pastga tortilganda <code>A2</code> <code>A3</code> ga o'zgaradi, lekin <code>$D$1</code> doimo qat'iy turadi!</p>
        </div>
      </div>

      <div class="tip-box">
        <i class="fa-solid fa-key"></i>
        <div>
          <strong>Tezkor tugma:</strong> Formulada manzil ustida turganda <kbd>F4</kbd> tugmasini bosing — Excel o'zi avtomatik <code>$</code> belgilarini qo'yib beradi!
        </div>
      </div>
    `,
    quiz: {
      question: "Formulani pastga nusxalaganda ma'lum bir katak (masalan C1) o'zgarmasdan qat'iy qolishi uchun nima qilish kerak?",
      options: [
        { text: "C1 oldiga hech narsa qo'yilmaydi", isCorrect: false },
        { text: "$C$1 ko'rinishida qulflanadi (F4 bosiladi)", isCorrect: true, feedback: "Aynan to'g'ri! $ belgisi ustun va qatorni qulflaydi." },
        { text: "#C1# deb yoziladi", isCorrect: false },
        { text: "LOCK(C1) funksiyasi qo'shiladi", isCorrect: false }
      ]
    }
  },
  {
    id: 7,
    title: "Vizual Tahlil: Oddiy va Qulay Diagrammalar",
    duration: "15 daqiqa",
    module: "5-Modul: Vizualizatsiya",
    summary: "Gistogrammalar, chiziqli grafiklar va doiraviy diagrammalar yaratish hamda ma'lumotlarni tushunarli taqdim etish.",
    videoPlaceholder: "1 Daqiqada Chiroyli Diagramma Yaratish",
    content: `
      <h3>1. Qaysi holatda qaysi diagramma turi tanlanadi?</h3>
      
      <div class="content-cards-grid">
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-chart-column"></i> <strong>Ustunli (Column / Bar)</strong></div>
          <p>Oylar yoki xodimlar bo'yicha ko'rsatkichlarni bir-biri bilan taqqoslash uchun eng qulayi.</p>
        </div>
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-chart-line"></i> <strong>Chiziqli (Line)</strong></div>
          <p>Vaqt o'tishi bilan o'zgarishlar dinamikasi (masalan, yillik savdo grafigi) uchun mos.</p>
        </div>
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-chart-pie"></i> <strong>Doiraviy (Pie)</strong></div>
          <p>Umumiy 100% ichidagi ulushlarni (bozor ulushi, xarajatlar tarkibi) ko'rsatish uchun.</p>
        </div>
      </div>

      <div class="tip-box">
        <i class="fa-solid fa-magic"></i>
        <div>
          <strong>Super klaviatura siri:</strong> Jadvalni belgilang va <kbd>Alt</kbd> + <kbd>F1</kbd> tugmasini bosing — shu zahotiyoq tayyor diagramma sahifangizda paydo bo'ladi!
        </div>
      </div>
    `,
    quiz: {
      question: "Bozor ulushi yoki xarajatlar tarkibini (100% ichidagi bo'laklarni) ko'rsatish uchun qaysi diagramma eng mos keladi?",
      options: [
        { text: "Chiziqli grafik", isCorrect: false },
        { text: "Doiraviy (Pie) diagramma", isCorrect: true, feedback: "To'g'ri! Doiraviy diagramma umumiy butun narsaning ulushlarini ko'rsatish uchun eng yaxshisidir." },
        { text: "Radar diagrammasi", isCorrect: false },
        { text: "Scatter grafigi", isCorrect: false }
      ]
    }
  },
  {
    id: 8,
    title: "Faylni Saqlash va Chop Etishga (Print) Tayyorlash",
    duration: "10 daqiqa",
    module: "6-Modul: Yakunlash",
    summary: "Jadvalni A4 varag'iga sig'dirish, sahifa yo'nalishi (Landscape/Portrait) va PDF formatda eksport qilish.",
    videoPlaceholder: "Jadvalni A4 Formatga 100% Sig'dirish",
    content: `
      <h3>1. Jadval qog'ozga sig'may qolish muammosini hal qilish</h3>
      <p>Katta jadvallarni chop etganda, 1-2 ustun boshqa varaqqa o'tib ketib xunuk bo'lib qolmasligi uchun <em>Разметка страницы (Page Layout)</em> menyusidan foydalanamiz.</p>

      <div class="content-cards-grid">
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-compress"></i> <strong>Sig'dirish (Fit to 1 Page)</strong></div>
          <p>Kenglikni (Width) <code>1 страница</code> ga o'rnatsangiz, barcha ustunlar 1 ta A4 varaqqa chiroyli sig'adi.</p>
        </div>
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-file-pdf"></i> <strong>PDF Eksport</strong></div>
          <p><kbd>F12</kbd> (Сохранить как) bosib, fayl turini <code>PDF (*.pdf)</code> qilsangiz, hech qachon shriftlari buzilmaydi.</p>
        </div>
      </div>

      <div class="tip-box">
        <i class="fa-solid fa-check-double"></i>
        <div>
          <strong>Tabriklaymiz!</strong> Siz 0-darajaning barcha nazariy darslarini muvaffaqiyatli yakunladingiz. Endi o'rganganlaringizni <strong>Formula Trenajori Checkpoint</strong> simulyatorida amalda isbotlang!
        </div>
      </div>
    `,
    quiz: {
      question: "Keng jadvalni chop etganda barcha ustunlar bitta varaq eniga sig'ishi uchun qaysi sozlama tanlanadi?",
      options: [
        { text: "Barcha qatorlarni o'chirib tashlash", isCorrect: false },
        { text: "Kenglikni (Width) 1 sahifaga moslash (Fit to 1 page)", isCorrect: true, feedback: "Ofarin! 'Fit Sheet on One Page' yoki Width: 1 Page barcha ustunlarni bitta varaqqa sig'diradi." },
        { text: "Shrift o'lchamini 2 ga tushirish", isCorrect: false },
        { text: "Faqat A ustunni qoldirish", isCorrect: false }
      ]
    }
  }
];

export const TRAINER_TASKS = [
  {
    id: 1,
    title: "1-Vazifa: Jami Maoshlar Yig'indisi",
    targetCell: "B7",
    instruction: "Kompaniya xodimlarining umumiy maosh miqdorini toping. <strong>B7</strong> katakka <strong>B2 dan B6 gacha</strong> bo'lgan sonlar yig'indisini hisoblovchi formulani yozing.",
    hint: "=СУММ(B2:B6) yoki =SUM(B2:B6)",
    gridData: {
      headers: ["A", "B", "C"],
      rows: [
        { row: 1, cells: { A: "Xodim Ismi", B: "Oylik Maosh ($)", C: "Bo'lim" } },
        { row: 2, cells: { A: "Jasur Aliyev", B: 1200, C: "IT" } },
        { row: 3, cells: { A: "Nilufar Rahimova", B: 950, C: "Marketing" } },
        { row: 4, cells: { A: "Bekzod Umarov", B: 1500, C: "Moliya" } },
        { row: 5, cells: { A: "Shahnoza Karimova", B: 800, C: "HR" } },
        { row: 6, cells: { A: "Rustam Soliyev", B: 1100, C: "Savdo" } },
        { row: 7, cells: { A: "JAMI MAOSH:", B: "", C: "" } }
      ]
    },
    expectedFunction: ["SUM", "СУММ"],
    expectedResult: 5550,
    allowedFormulas: [
      "=СУММ(B2:B6)",
      "=SUM(B2:B6)",
      "=СУММ(B2;B3;B4;B5;B6)",
      "=SUM(B2,B3,B4,B5,B6)",
      "=B2+B3+B4+B5+B6"
    ]
  },
  {
    id: 2,
    title: "2-Vazifa: O'rtacha Savdo Ko'rsatkichi",
    targetCell: "B8",
    instruction: "Hafta kunlari bo'yicha o'rtacha savdo tushumini aniqlang. <strong>B8</strong> katakka <strong>B2 dan B7 gacha</strong> bo'lgan qiymatlarning o'rtachasini topuvchi formulani kiriting.",
    hint: "=СРЗНАЧ(B2:B7) yoki =AVERAGE(B2:B7)",
    gridData: {
      headers: ["A", "B", "C"],
      rows: [
        { row: 1, cells: { A: "Kun", B: "Sotuv ($)", C: "Cheklar" } },
        { row: 2, cells: { A: "Dushanba", B: 4000, C: 45 } },
        { row: 3, cells: { A: "Seshanba", B: 3500, C: 38 } },
        { row: 4, cells: { A: "Chorshanba", B: 5200, C: 60 } },
        { row: 5, cells: { A: "Payshanba", B: 4800, C: 52 } },
        { row: 6, cells: { A: "Juma", B: 6500, C: 75 } },
        { row: 7, cells: { A: "Shanba", B: 6000, C: 70 } },
        { row: 8, cells: { A: "O'RTACHA SAVDO:", B: "", C: "" } }
      ]
    },
    expectedFunction: ["AVERAGE", "СРЗНАЧ"],
    expectedResult: 5000,
    allowedFormulas: [
      "=СРЗНАЧ(B2:B7)",
      "=AVERAGE(B2:B7)",
      "=СУММ(B2:B7)/6",
      "=SUM(B2:B7)/6"
    ]
  },
  {
    id: 3,
    title: "3-Vazifa: Mijozlar Soni (Sanash)",
    targetCell: "B8",
    instruction: "Ro'yxatda jami nechta faol buyurtma borligini sanang. <strong>B8</strong> katakka <strong>B2 dan B7 gacha</strong> bo'lgan sonli ID raqamlarini sanash formulasini yozing.",
    hint: "=СЧЁТ(B2:B7) yoki =COUNT(B2:B7)",
    gridData: {
      headers: ["A", "B", "C"],
      rows: [
        { row: 1, cells: { A: "Mijoz", B: "Buyurtma ID", C: "Holat" } },
        { row: 2, cells: { A: "Akmal", B: 101, C: "Yetkazildi" } },
        { row: 3, cells: { A: "Dilnoza", B: 102, C: "Yetkazildi" } },
        { row: 4, cells: { A: "Otabek", B: 103, C: "Jarayonda" } },
        { row: 5, cells: { A: "Zulfiya", B: 104, C: "Yetkazildi" } },
        { row: 6, cells: { A: "Sardor", B: 105, C: "Yetkazildi" } },
        { row: 7, cells: { A: "Nodira", B: 106, C: "Jarayonda" } },
        { row: 8, cells: { A: "BUYURTMALAR SONI:", B: "", C: "" } }
      ]
    },
    expectedFunction: ["COUNT", "СЧЁТ", "COUNTA", "СЧЁТЗ"],
    expectedResult: 6,
    allowedFormulas: [
      "=СЧЁТ(B2:B7)",
      "=COUNT(B2:B7)",
      "=СЧЁТЗ(B2:B7)",
      "=COUNTA(B2:B7)"
    ]
  },
  {
    id: 4,
    title: "4-Vazifa: Eng Katta Savdo Hajmi (MAX)",
    targetCell: "B7",
    instruction: "Filiallar orasida qayd etilgan eng yuqori (maksimal) savdo tushumini toping. <strong>B7</strong> katakka <strong>B2 dan B6 gacha</strong> bo'lgan diapazondan maksimal sonni topuvchi formulani kiriting.",
    hint: "=МАКС(B2:B6) yoki =MAX(B2:B6)",
    gridData: {
      headers: ["A", "B", "C"],
      rows: [
        { row: 1, cells: { A: "Filial", B: "Savdo ($)", C: "Menejer" } },
        { row: 2, cells: { A: "Chilonzor", B: 18500, C: "Sherzod" } },
        { row: 3, cells: { A: "Yunusobod", B: 24200, C: "Madina" } },
        { row: 4, cells: { A: "Mirzo Ulug'bek", B: 19800, C: "Anvar" } },
        { row: 5, cells: { A: "Mirobod", B: 31500, C: "Kamola" } },
        { row: 6, cells: { A: "Sergeli", B: 14700, C: "Farrux" } },
        { row: 7, cells: { A: "ENG YUQORI NATIJA:", B: "", C: "" } }
      ]
    },
    expectedFunction: ["MAX", "МАКС"],
    expectedResult: 31500,
    allowedFormulas: [
      "=МАКС(B2:B6)",
      "=MAX(B2:B6)"
    ]
  },
  {
    id: 5,
    title: "5-Vazifa: Eng Kichik Xarajat (MIN)",
    targetCell: "B7",
    instruction: "Oylik xarajatlar ichida eng kichik (minimal) summani aniqlang. <strong>B7</strong> katakka <strong>B2 dan B6 gacha</strong> bo'lgan xarajatlarning eng kichigini hisoblovchi formulani yozing.",
    hint: "=МИН(B2:B6) yoki =MIN(B2:B6)",
    gridData: {
      headers: ["A", "B", "C"],
      rows: [
        { row: 1, cells: { A: "Xarajat turi", B: "Summa ($)", C: "To'lov turi" } },
        { row: 2, cells: { A: "Ofis ijarasi", B: 2500, C: "Bank o'tkazma" } },
        { row: 3, cells: { A: "Internet va aloqa", B: 180, C: "Karta" } },
        { row: 4, cells: { A: "Kantselyariya", B: 95, C: "Naqd" } },
        { row: 5, cells: { A: "Reklama", B: 1200, C: "Karta" } },
        { row: 6, cells: { A: "Kommunal xizmatlar", B: 340, C: "Bank o'tkazma" } },
        { row: 7, cells: { A: "ENG KAM XARAJAT:", B: "", C: "" } }
      ]
    },
    expectedFunction: ["MIN", "МИН"],
    expectedResult: 95,
    allowedFormulas: [
      "=МИН(B2:B6)",
      "=MIN(B2:B6)"
    ]
  },
  {
    id: 6,
    title: "6-Vazifa: Qat'iy Qulflash bilan Hisoblash ($)",
    targetCell: "C2",
    instruction: "Mahsulotning dollar narxini <strong>D1</strong> katakdagi qat'iy kursga (12800) ko'paytirib so'mdagi qiymatini toping. <strong>C2</strong> katakka <strong>B2</strong> ni <strong>$D$1</strong> ga ko'paytiruvchi formulani yozing.",
    hint: "=B2*$D$1 yoki =B2*D1",
    gridData: {
      headers: ["A", "B", "C", "D"],
      rows: [
        { row: 1, cells: { A: "Mahsulot", B: "Narx ($)", C: "Narx (So'm)", D: 12800 } },
        { row: 2, cells: { A: "Noutbuk Pro", B: 850, C: "", D: "<- Kurs ($D$1)" } },
        { row: 3, cells: { A: "Smartfon X", B: 420, C: "", D: "" } },
        { row: 4, cells: { A: "Monitor 27\"", B: 210, C: "", D: "" } },
        { row: 5, cells: { A: "Klaviatura", B: 45, C: "", D: "" } }
      ]
    },
    expectedFunction: ["MULTIPLY", "*"],
    expectedResult: 10880000,
    allowedFormulas: [
      "=B2*$D$1",
      "=B2*D1",
      "=$D$1*B2",
      "=D1*B2"
    ]
  },
  {
    id: 7,
    title: "7-Vazifa: Mantiqiy Shart (IF / ЕСЛИ)",
    targetCell: "C2",
    instruction: "Savdo miqdori 5000 $ dan yuqori bo'lsa 'Premium', aks holda 'Standard' darajasini aniqlang. <strong>C2</strong> katakka <strong>B2 > 5000</strong> shartini tekshiruvchi formulani yozing.",
    hint: "=ЕСЛИ(B2>5000; \"Premium\"; \"Standard\") yoki =IF(B2>5000, \"Premium\", \"Standard\")",
    gridData: {
      headers: ["A", "B", "C"],
      rows: [
        { row: 1, cells: { A: "Menejer", B: "Savdo ($)", C: "Status" } },
        { row: 2, cells: { A: "Anvar Karimov", B: 6500, C: "" } },
        { row: 3, cells: { A: "Sevara Aliyeva", B: 3200, C: "" } },
        { row: 4, cells: { A: "Jasur Rahimov", B: 8100, C: "" } },
        { row: 5, cells: { A: "Malika Soliyeva", B: 4900, C: "" } }
      ]
    },
    expectedFunction: ["IF", "ЕСЛИ"],
    expectedResult: "Premium",
    allowedFormulas: [
      "=ЕСЛИ(B2>5000; \"Premium\"; \"Standard\")",
      "=IF(B2>5000, \"Premium\", \"Standard\")",
      "=IF(B2>5000,\"Premium\",\"Standard\")"
    ]
  },
  {
    id: 8,
    title: "8-Vazifa: Shartli Sanash (COUNTIF / СЧЁТЕСЛИ)",
    targetCell: "B7",
    instruction: "B2:B6 diapazonida savdosi 5000 $ dan yuqori bo'lgan filiallar sonini toping. <strong>B7</strong> katakka <strong>COUNTIF</strong> formulasini kiriting.",
    hint: "=СЧЁТЕСЛИ(B2:B6; \">5000\") yoki =COUNTIF(B2:B6, \">5000\")",
    gridData: {
      headers: ["A", "B", "C"],
      rows: [
        { row: 1, cells: { A: "Filial", B: "Savdo ($)", C: "Kategoriya" } },
        { row: 2, cells: { A: "Markaz", B: 7200, C: "A" } },
        { row: 3, cells: { A: "Shimol", B: 4100, C: "B" } },
        { row: 4, cells: { A: "Janub", B: 8900, C: "A" } },
        { row: 5, cells: { A: "Sharq", B: 3500, C: "B" } },
        { row: 6, cells: { A: "G'arb", B: 6300, C: "A" } },
        { row: 7, cells: { A: "5000+ FILIALLAR SONI:", B: "", C: "" } }
      ]
    },
    expectedFunction: ["COUNTIF", "СЧЁТЕСЛИ"],
    expectedResult: 3,
    allowedFormulas: [
      "=СЧЁТЕСЛИ(B2:B6; \">5000\")",
      "=COUNTIF(B2:B6, \">5000\")",
      "=COUNTIF(B2:B6,\">5000\")"
    ]
  }
];
