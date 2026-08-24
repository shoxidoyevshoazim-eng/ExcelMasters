/**
 * Excel Masters MVP - Formula Engine & Evaluator
 * Excel formulalarini (СУММ, СРЗНАЧ, СЧЁТ, МАКС, МИН, ЕСЛИ va arifmetik amallar)
 * rus va ingliz tilidagi nomlar bilan tahlil qiluvchi, hisoblovchi va
 * PEDAGOGIK xato tushuntirishlarini beruvchi modul.
 *
 * GLOBAL QOIDA: Barcha interfeys xabarlarida funksiya nomi ruscha birinchi,
 * inglizcha qavs ichida ikkinchi keladi: СУММ (SUM)
 */

export class FormulaEngine {
  constructor() {
    // Funksiyalarning ruscha va inglizcha sinonimlari
    this.functionMap = {
      "СУММ": "SUM", "SUM": "SUM",
      "СРЗНАЧ": "AVERAGE", "AVERAGE": "AVERAGE",
      "СЧЁТ": "COUNT", "СЧЕТ": "COUNT", "COUNT": "COUNT",
      "СЧЁТЗ": "COUNTA", "СЧЕТЗ": "COUNTA", "COUNTA": "COUNTA",
      "МАКС": "MAX", "MAX": "MAX",
      "МИН": "MIN", "MIN": "MIN",
      "ЕСЛИ": "IF", "IF": "IF",
      "СЧЁТЕСЛИ": "COUNTIF", "СЧЕТЕСЛИ": "COUNTIF", "COUNTIF": "COUNTIF",
      "СУММЕСЛИ": "SUMIF", "SUMIF": "SUMIF",
      "ВПР": "VLOOKUP", "VLOOKUP": "VLOOKUP"
    };

    // Ruscha → inglizcha chiroyli juftlik (interfeys uchun)
    this.funcDisplayNames = {
      "SUM":      "СУММ (SUM)",
      "AVERAGE":  "СРЗНАЧ (AVERAGE)",
      "COUNT":    "СЧЁТ (COUNT)",
      "COUNTA":   "СЧЁТЗ (COUNTA)",
      "MAX":      "МАКС (MAX)",
      "MIN":      "МИН (MIN)",
      "IF":       "ЕСЛИ (IF)",
      "COUNTIF":  "СЧЁТЕСЛИ (COUNTIF)",
      "SUMIF":    "СУММЕСЛИ (SUMIF)",
      "VLOOKUP":  "ВПР (VLOOKUP)"
    };

    // Keng tarqalgan noto'g'ri funksiya nomlari va ularning to'g'ri muqobillari
    this.commonMisspellings = {
      "SUMM": "СУММ (SUM)", "СУММА": "СУММ (SUM)", "СУУМ": "СУММ (SUM)", "SUUM": "СУММ (SUM)",
      "AVG": "СРЗНАЧ (AVERAGE)", "СРЕДНЕЕ": "СРЗНАЧ (AVERAGE)", "СРЗНАЧЬ": "СРЗНАЧ (AVERAGE)",
      "МАКСИМУМ": "МАКС (MAX)", "МИНИМУМ": "МИН (MIN)",
      "СЧОТ": "СЧЁТ (COUNT)", "CЧЁТ": "СЧЁТ (COUNT)", "СOUNT": "СЧЁТ (COUNT)",
      "ЧИСЛО": "СЧЁТ (COUNT)", "KAUNT": "СЧЁТ (COUNT)",
      "SUMMA": "СУММ (SUM)", "СУММA": "СУММ (SUM)"
    };
  }

  /**
   * Foydalanuvchi kiritgan formula satrini tozalash
   */
  normalizeFormula(rawFormula) {
    if (!rawFormula || typeof rawFormula !== "string") return "";
    return rawFormula.trim();
  }

  /**
   * Katak koordinatasidan qiymatni olish (masalan 'B2', '$D$1')
   */
  getCellValue(cellRef, gridRows) {
    const cleanRef = cellRef.replace(/\$/g, "").toUpperCase();
    const match = cleanRef.match(/^([A-Z]+)(\d+)$/);
    if (!match) return 0;

    const col = match[1];
    const rowNum = parseInt(match[2], 10);

    const targetRow = gridRows.find(r => r.row === rowNum);
    if (!targetRow || !targetRow.cells || targetRow.cells[col] === undefined) return 0;

    const val = targetRow.cells[col];
    if (typeof val === "number") return val;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? val : parsed;
  }

  /**
   * Diapazondan barcha qiymatlarni massiv qilib olish
   */
  getRangeValues(rangeStr, gridRows) {
    const cleanRange = rangeStr.replace(/\$/g, "").toUpperCase();
    const parts = cleanRange.split(":");
    if (parts.length !== 2) {
      return [this.getCellValue(cleanRange, gridRows)];
    }

    const startMatch = parts[0].match(/^([A-Z]+)(\d+)$/);
    const endMatch = parts[1].match(/^([A-Z]+)(\d+)$/);
    if (!startMatch || !endMatch) return [];

    const startCol = startMatch[1].charCodeAt(0);
    const startRow = parseInt(startMatch[2], 10);
    const endCol = endMatch[1].charCodeAt(0);
    const endRow = parseInt(endMatch[2], 10);

    const values = [];
    for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
      for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
        values.push(this.getCellValue(`${String.fromCharCode(c)}${r}`, gridRows));
      }
    }
    return values;
  }

  // =========================================================================
  // PEDAGOGIK XATO DIAGNOSTIKASI — aniq, sabab-oqibatli tushuntirishlar
  // =========================================================================
  diagnoseFormulaError(rawInput) {
    const input = rawInput.trim();

    // 1. '=' belgisi yo'q
    if (!input.startsWith("=")) {
      return {
        errorType: "MISSING_EQUALS",
        message: `<strong>❌ "=" belgisi topilmadi.</strong><br>
          Excel'da har qanday formula doimo <code>=</code> (tenglik) belgisi bilan boshlanadi.<br>
          <em>Siz yozdingiz:</em> <code>${input}</code><br>
          <em>To'g'ri ko'rinish:</em> <code>=${input}</code>`
      };
    }

    const body = input.substring(1).trim();

    // 2. Bo'sh formula
    if (!body) {
      return {
        errorType: "EMPTY_FORMULA",
        message: `<strong>❌ Formula bo'sh qoldi.</strong><br>
          <code>=</code> belgisidan keyin funksiya nomi yoki hisob-kitob yozing.<br>
          <em>Namuna:</em> <code>=СУММ(B2:B6)</code>`
      };
    }

    // 3. Qavs tekshiruvi
    const openCount = (body.match(/\(/g) || []).length;
    const closeCount = (body.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      return {
        errorType: "UNCLOSED_PAREN",
        message: `<strong>❌ Yopilmagan qavs topildi.</strong><br>
          Formulada <strong>${openCount}</strong> ta ochilgan qavs bor, lekin faqat <strong>${closeCount}</strong> ta yopilgan.<br>
          <em>Siz yozdingiz:</em> <code>${input}</code><br>
          <em>Qavs yopilgan to'g'ri variant:</em> oxiriga <code>)</code> qo'shing.`
      };
    }
    if (closeCount > openCount) {
      return {
        errorType: "EXTRA_PAREN",
        message: `<strong>❌ Ortiqcha yopiluvchi qavs topildi.</strong><br>
          <strong>${closeCount}</strong> ta yopiluvchi qavs bor, lekin faqat <strong>${openCount}</strong> ta ochilgan.<br>
          <em>Ortiqcha <code>)</code> belgisini olib tashlang.</em>`
      };
    }

    // 4. Funksiya nomi tekshiruvi
    const funcMatch = body.match(/^([A-Za-zА-Яа-яЁё0-9_]+)\s*\(/);
    if (funcMatch) {
      const funcName = funcMatch[1].toUpperCase();
      const stdFunc = this.functionMap[funcName];

      if (!stdFunc) {
        // Noto'g'ri yozilgan nomi bormi?
        const suggestion = this.commonMisspellings[funcName];
        if (suggestion) {
          return {
            errorType: "MISSPELLED_FUNC",
            message: `<strong>❌ "${funcName}" — noto'g'ri yozilgan funksiya nomi.</strong><br>
              Ehtimol siz <strong>${suggestion}</strong> ni nazarda tutgansiz.<br>
              <em>To'g'ri yozing:</em> <code>=${suggestion.split(" ")[0]}(...)</code>`
          };
        }
        return {
          errorType: "UNKNOWN_FUNC",
          message: `<strong>❌ "${funcName}" nomli funksiya topilmadi.</strong><br>
            Mavjud funksiyalar: <code>СУММ</code>, <code>СРЗНАЧ</code>, <code>СЧЁТ</code>, <code>МАКС</code>, <code>МИН</code>.<br>
            <em>Namuna:</em> <code>=СУММ(B2:B6)</code>`
        };
      }

      // 5. Vergul vs ikki nuqta xatosi (Eng keng tarqalgan pedagogik xato!)
      const argsBody = body.match(/\(([^)]*)\)/);
      if (argsBody) {
        const args = argsBody[1];
        // Agar foydalanuvchi faqat 2 ta katak ko'rsatgan bo'lsa va vergul bilan ajratgan bo'lsa:
        // masalan СУММ(A2,A6) diapazon o'rniga
        const commaParts = args.split(",");
        const semicolonParts = args.split(";");
        const colonParts = args.split(":");

        if ((commaParts.length === 2 || semicolonParts.length === 2) && colonParts.length === 1) {
          const sep = commaParts.length === 2 ? "," : ";";
          const p = sep === "," ? commaParts : semicolonParts;
          const a = p[0].trim();
          const b = p[1].trim();
          // Ikkala qism ham oddiy katak koordinatasimi? (masalan A2 va A6)
          if (/^\$?[A-Z]\$?\d+$/i.test(a) && /^\$?[A-Z]\$?\d+$/i.test(b)) {
            const displayFunc = this.funcDisplayNames[stdFunc] || funcName;
            return {
              errorType: "COMMA_VS_COLON",
              message: `<strong>⚠️ Vergul ("${sep}") va ikki nuqta (":") farqi muhim!</strong><br>
                <code>${sep}</code> — faqat alohida katakchalarni sanaydi (masalan faqat ${a} va ${b} — 2 ta katak).<br>
                <code>:</code> — butun <strong>diapazon</strong>ni tanlaydi (${a} dan ${b} gacha barcha qatorlar).<br>
                <em>Siz yozdingiz:</em> <code>=${funcName}(${a}${sep}${b})</code> — bu faqat 2 ta katakni hisoblaydi!<br>
                <em>To'g'ri variant:</em> <code>=${funcName}(${a}:${b})</code> — bu butun diapazondagi barcha sonlarni hisoblaydi.`
            };
          }
        }

        // 6. Bo'sh argumentlar
        if (args.trim() === "") {
          const displayFunc = this.funcDisplayNames[stdFunc] || funcName;
          return {
            errorType: "EMPTY_ARGS",
            message: `<strong>❌ ${displayFunc} funksiyasiga argument berilmagan.</strong><br>
              Qavs ichida katakcha manzili yoki diapazon ko'rsating.<br>
              <em>Namuna:</em> <code>=${funcName}(B2:B6)</code>`
          };
        }
      }
    }

    // 7. Faqat raqam (= dan keyin)
    if (/^\d+$/.test(body)) {
      return {
        errorType: "JUST_NUMBER",
        message: `<strong>⚠️ Bu formula emas, oddiy raqam kiritildi.</strong><br>
          Formulalar funksiya yoki arifmetik amal orqali ishlaydi.<br>
          <em>Namuna:</em> <code>=СУММ(B2:B6)</code> yoki <code>=B2+B3+B4</code>`
      };
    }

    return null; // Aniq xato topilmadi
  }

  // =========================================================================
  // FORMULANI BAHOLASH VA HISOBLASH
  // =========================================================================
  evaluate(rawInput, gridRows) {
    const input = this.normalizeFormula(rawInput);

    // Avval pedagogik xato diagnostikasi
    const diagError = this.diagnoseFormulaError(input);
    if (diagError && ["MISSING_EQUALS", "EMPTY_FORMULA", "UNCLOSED_PAREN", "EXTRA_PAREN",
        "MISSPELLED_FUNC", "UNKNOWN_FUNC", "EMPTY_ARGS", "JUST_NUMBER"].includes(diagError.errorType)) {
      // Faqat tuzatib bo'lmaydigan xatolar uchun darhol qaytarish
      if (["MISSING_EQUALS", "EMPTY_FORMULA", "UNCLOSED_PAREN", "EXTRA_PAREN",
           "MISSPELLED_FUNC", "UNKNOWN_FUNC", "EMPTY_ARGS"].includes(diagError.errorType)) {
        return { isValid: false, result: null, error: diagError.message, errorType: diagError.errorType };
      }
    }

    if (!input.startsWith("=")) {
      return { isValid: false, result: null, error: diagError?.message || "Formula '=' bilan boshlanishi kerak." };
    }

    const formulaBody = input.substring(1).trim();

    // Funksiya chaqiruvi bormi: =FUNK(...)
    const funcRegex = /^([A-Za-zА-Яа-яЁё0-9_]+)\s*\((.*)\)$/;
    const funcMatch = formulaBody.match(funcRegex);

    if (funcMatch) {
      const funcName = funcMatch[1].toUpperCase();
      const rawArgs = funcMatch[2];
      const standardFunc = this.functionMap[funcName];

      if (!standardFunc) {
        const suggestion = this.commonMisspellings[funcName];
        return {
          isValid: false, result: null,
          error: suggestion
            ? `"${funcName}" noto'g'ri. To'g'ri nomi: <strong>${suggestion}</strong>`
            : `"${funcName}" funksiyasi topilmadi. СУММ, СРЗНАЧ, СЧЁТ, МАКС, МИН dan foydalaning.`
        };
      }

      // Argumentlarni ajratamiz (; yoki , orqali)
      const argTokens = rawArgs.split(/[,;]/).map(a => a.trim()).filter(a => a.length > 0);
      let extractedValues = [];

      for (const token of argTokens) {
        if (token.includes(":")) {
          extractedValues.push(...this.getRangeValues(token, gridRows));
        } else if (/^\$?[A-Z$]+\$?\d+$/i.test(token)) {
          extractedValues.push(this.getCellValue(token, gridRows));
        } else {
          const num = parseFloat(token);
          if (!isNaN(num)) extractedValues.push(num);
        }
      }

      switch (standardFunc) {
        case "SUM": {
          const numbers = extractedValues.filter(v => typeof v === "number" && !isNaN(v));
          return { isValid: true, result: numbers.reduce((a, b) => a + b, 0), standardFunc, extractedValues };
        }
        case "AVERAGE": {
          const numbers = extractedValues.filter(v => typeof v === "number" && !isNaN(v));
          if (numbers.length === 0) return { isValid: true, result: 0, standardFunc };
          return { isValid: true, result: Math.round((numbers.reduce((a, b) => a + b, 0) / numbers.length) * 100) / 100, standardFunc, extractedValues };
        }
        case "COUNT": {
          return { isValid: true, result: extractedValues.filter(v => typeof v === "number" && !isNaN(v)).length, standardFunc, extractedValues };
        }
        case "COUNTA": {
          return { isValid: true, result: extractedValues.filter(v => v !== "" && v !== null && v !== undefined).length, standardFunc, extractedValues };
        }
        case "MAX": {
          const numbers = extractedValues.filter(v => typeof v === "number" && !isNaN(v));
          return { isValid: true, result: numbers.length ? Math.max(...numbers) : 0, standardFunc, extractedValues };
        }
        case "MIN": {
          const numbers = extractedValues.filter(v => typeof v === "number" && !isNaN(v));
          return { isValid: true, result: numbers.length ? Math.min(...numbers) : 0, standardFunc, extractedValues };
        }
        case "COUNTIF": {
          // argTokens: [range, criteria]
          if (argTokens.length >= 2) {
            const rangeVals = this.getRangeValues(argTokens[0], gridRows);
            const criteriaRaw = argTokens[1].replace(/["']/g, "").trim();
            let count = 0;
            rangeVals.forEach(v => {
              if (criteriaRaw.startsWith(">")) {
                const target = parseFloat(criteriaRaw.substring(1));
                if (v > target) count++;
              } else if (criteriaRaw.startsWith("<")) {
                const target = parseFloat(criteriaRaw.substring(1));
                if (v < target) count++;
              } else {
                if (String(v).toLowerCase() === criteriaRaw.toLowerCase()) count++;
              }
            });
            return { isValid: true, result: count, standardFunc };
          }
          return { isValid: true, result: 0, standardFunc };
        }
        case "SUMIF": {
          // argTokens: [range, criteria, sum_range]
          if (argTokens.length >= 2) {
            const rangeVals = this.getRangeValues(argTokens[0], gridRows);
            const sumVals = argTokens[2] ? this.getRangeValues(argTokens[2], gridRows) : rangeVals;
            const criteriaRaw = argTokens[1].replace(/["']/g, "").trim();
            let sum = 0;
            rangeVals.forEach((v, idx) => {
              let match = false;
              if (criteriaRaw.startsWith(">")) {
                match = v > parseFloat(criteriaRaw.substring(1));
              } else if (criteriaRaw.startsWith("<")) {
                match = v < parseFloat(criteriaRaw.substring(1));
              } else {
                match = String(v).toLowerCase() === criteriaRaw.toLowerCase();
              }
              if (match && sumVals[idx] !== undefined) {
                const addVal = typeof sumVals[idx] === "number" ? sumVals[idx] : parseFloat(sumVals[idx]);
                if (!isNaN(addVal)) sum += addVal;
              }
            });
            return { isValid: true, result: Math.round(sum * 100) / 100, standardFunc };
          }
          return { isValid: true, result: 0, standardFunc };
        }
        case "IF": {
          // argTokens: [condition, val_if_true, val_if_false]
          if (argTokens.length >= 2) {
            const condStr = argTokens[0];
            let isTrue = false;
            if (condStr.includes(">")) {
              const [left, right] = condStr.split(">");
              isTrue = this.getCellValue(left.trim(), gridRows) > (parseFloat(right) || this.getCellValue(right.trim(), gridRows));
            } else if (condStr.includes("<")) {
              const [left, right] = condStr.split("<");
              isTrue = this.getCellValue(left.trim(), gridRows) < (parseFloat(right) || this.getCellValue(right.trim(), gridRows));
            } else if (condStr.includes("=")) {
              const [left, right] = condStr.split("=");
              isTrue = String(this.getCellValue(left.trim(), gridRows)) === String(right.replace(/["']/g, "").trim());
            }
            const resVal = isTrue ? argTokens[1] : (argTokens[2] || "0");
            const cleanRes = resVal.replace(/["']/g, "").trim();
            const numRes = parseFloat(cleanRes);
            return { isValid: true, result: isNaN(numRes) ? cleanRes : numRes, standardFunc };
          }
          return { isValid: true, result: 0, standardFunc };
        }
        case "VLOOKUP": {
          // argTokens: [lookup_val, table_range, col_index, approx]
          if (argTokens.length >= 3) {
            const lookupValRaw = argTokens[0].replace(/["']/g, "").trim();
            const lookupVal = /^\$?[A-Z]\$?\d+$/i.test(lookupValRaw) ? this.getCellValue(lookupValRaw, gridRows) : lookupValRaw;
            const colIdx = parseInt(argTokens[2], 10);
            
            // Extract table range
            const rangeStr = argTokens[1].replace(/\$/g, "").toUpperCase();
            const parts = rangeStr.split(":");
            if (parts.length === 2 && colIdx > 0) {
              const startMatch = parts[0].match(/^([A-Z]+)(\d+)$/);
              const endMatch = parts[1].match(/^([A-Z]+)(\d+)$/);
              if (startMatch && endMatch) {
                const startColChar = startMatch[1].charCodeAt(0);
                const startRow = parseInt(startMatch[2], 10);
                const endRow = parseInt(endMatch[2], 10);
                const targetColChar = startColChar + colIdx - 1;

                for (let r = startRow; r <= endRow; r++) {
                  const firstColVal = this.getCellValue(`${String.fromCharCode(startColChar)}${r}`, gridRows);
                  if (String(firstColVal).toLowerCase() === String(lookupVal).toLowerCase()) {
                    const resultVal = this.getCellValue(`${String.fromCharCode(targetColChar)}${r}`, gridRows);
                    const numRes = typeof resultVal === "number" ? resultVal : parseFloat(resultVal);
                    return { isValid: true, result: isNaN(numRes) ? resultVal : numRes, standardFunc };
                  }
                }
              }
            }
          }
          return { isValid: true, result: "N/A", standardFunc };
        }
      }
    }

    // Arifmetik amallar (=B2*$D$1, =B2+B3, =SUM(B2:B7)/6)
    try {
      let expression = formulaBody;

      // Nested funksiyalar
      expression = expression.replace(/([A-Za-zА-Яа-яЁё]+)\s*\(([^)]+)\)/g, (match, fName, fArgs) => {
        const stdF = this.functionMap[fName.toUpperCase()];
        if (stdF === "SUM") {
          const vals = this.getRangeValues(fArgs, gridRows).filter(v => typeof v === "number");
          return vals.reduce((a, b) => a + b, 0);
        }
        if (stdF === "AVERAGE") {
          const vals = this.getRangeValues(fArgs, gridRows).filter(v => typeof v === "number");
          return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        }
        return match;
      });

      // Katak nomlarini qiymatga almashtirish
      expression = expression.replace(/\$?[A-Za-z]+\$?\d+/g, (cellRef) => {
        const val = this.getCellValue(cellRef, gridRows);
        return typeof val === "number" ? val : `"${val}"`;
      });

      if (!/^[\d\s+\-*/().%]+$/.test(expression)) {
        return { isValid: false, result: null, error: "Formulada noto'g'ri belgilar mavjud. Faqat sonlar, kataklar va +, -, *, / amallari qo'llaniladi." };
      }

      expression = expression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
      const evalResult = new Function(`return (${expression})`)();
      return {
        isValid: true,
        result: typeof evalResult === "number" ? Math.round(evalResult * 100) / 100 : evalResult,
        standardFunc: "EXPRESSION"
      };
    } catch (err) {
      return { isValid: false, result: null, error: "Formulani hisoblashda xatolik. Sintaksisni tekshiring." };
    }
  }

  // =========================================================================
  // VAZIFANI TEKSHIRISH — batafsil pedagogik feedback bilan
  // =========================================================================
  validateTask(userFormula, task) {
    const evalOutput = this.evaluate(userFormula, task.gridData.rows);

    if (!evalOutput.isValid) {
      // Vergul vs ikki nuqta xatosi ham bo'lishi mumkin — alohida ko'rib chiqamiz
      const diagError = this.diagnoseFormulaError(userFormula.trim());
      if (diagError && diagError.errorType === "COMMA_VS_COLON") {
        return { isCorrect: false, userResult: null, message: diagError.message, errorType: "COMMA_VS_COLON" };
      }
      return { isCorrect: false, userResult: null, message: evalOutput.error, errorType: evalOutput.errorType || "EVAL_ERROR" };
    }

    const isResultMatch = Math.abs(evalOutput.result - task.expectedResult) < 0.01;

    const normalizedUserFormula = userFormula.replace(/\s+/g, "").toUpperCase();
    const isFormulaPatternMatch = task.allowedFormulas.some(f =>
      f.replace(/\s+/g, "").toUpperCase() === normalizedUserFormula
    );

    if (isResultMatch || isFormulaPatternMatch) {
      return {
        isCorrect: true,
        userResult: evalOutput.result,
        message: `<strong>✅ Barakalla!</strong> Natija: <strong>${evalOutput.result.toLocaleString()}</strong> — to'g'ri!`,
        errorType: null
      };
    } else {
      // Natija noto'g'ri — pedagogik tushuntirish
      const diagError = this.diagnoseFormulaError(userFormula.trim());
      let detailMsg = "";

      if (diagError) {
        detailMsg = diagError.message;
      } else {
        // Formula ishladi lekin natija boshqa — ehtimol noto'g'ri diapazon
        const funcUsed = evalOutput.standardFunc;
        const funcDisplay = this.funcDisplayNames[funcUsed] || funcUsed;
        detailMsg = `<strong>⚠️ Formula ishladi, lekin natija kutilgandan farqli.</strong><br>
          Sizning natijangiz: <strong>${evalOutput.result}</strong> | Kutilgan natija: <strong>${task.expectedResult}</strong><br>
          <em>Ehtimoliy sabab:</em> noto'g'ri diapazon tanlangan (masalan, B2:B5 o'rniga B2:B6 bo'lishi kerak) yoki formulada boshqa kataklar ko'rsatilgan.<br>
          <em>Maslahat:</em> <code>${task.hint}</code>`;
      }

      return {
        isCorrect: false,
        userResult: evalOutput.result,
        message: detailMsg,
        errorType: "WRONG_RESULT"
      };
    }
  }
}
