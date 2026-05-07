/** Моторина Лиза 25ВП1 ЛР4 Вариант 18 */

/** * Правильные ответы для вопросов * @type Object */
const ANSWERS = {
    q1: "Юпитер",
    q2: "Венера",
    q3: ["Юпитер", "Сатурн", "Уран"],
    q4: ["Земля", "Марс"],
    q5: "Солнце",
    q6: "Млечный Путь",
    q7: "8",
    q8: "Сатурн"
};

/** * Краткие описания вопросов для таблицы * @type Array */
const QUESTIONS = [
    "Самая большая планета", "Самая горячая планета", "Планеты-гиганты", 
    "Твердая поверхность", "Центральный объект", "Наша Галактика", 
    "Количество планет", "Планета с кольцами"
];

/** * Текущее оставшееся время в секундах (изначально 10 минут)
 * @type Number 
*/
let timeLeft = 600; 

/** * Идентификатор интервала для управления таймером * @type Number */
let timerId;

/** * Начальное количество баллов * @type Number */
const ZERO = 0;

/** * Количество секунд в одной минуте * @type Number */
const SECOND = 60;

/** * Число для сравнения при форматировании нулей * @type Number */
const MATCH = 10;

/** * Интервал обновления (1 секунда) * @type Number */
const TICK_RATE = 1000;

/** * Общее количество вопросов в тесте * @type Number */
const QUIZ_SIZE = Object.keys(ANSWERS).length;

/** * Индексы вопросов Checkbox * @type Array */
const CHECKBOX_IDS = [3, 4];

/** * Индексы вопросов Text Box * @type Array */
const TEXTBOX_IDS = [7, 8];

/** 
 * Запускает тест: скрывает приветствие,
 *отображает вопросы и включает таймер 
*/
function startQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    timerId = setInterval(() => {
        timeLeft--;
        let mins = Math.floor(timeLeft / SECOND);
        let secs = timeLeft % SECOND;
        document.getElementById('timer').innerText = 
                `${mins}:${secs < MATCH ? '0' : ''}${secs}`;

        if (timeLeft <= 0) finishQuiz();
    }, TICK_RATE);
}


/** 
 * Управляет переключением экранов и запускает процесс 
*/
function finishQuiz() {
    clearInterval(timerId);
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-area').style.display = 'block';

    let form = document.getElementById('quiz-form');
    let formData = new FormData(form);
    let totalPoints = ZERO;
    let resultsData = [];

    for (let i = 1; i <= QUIZ_SIZE; i++) {
        let evaluation = checkUserAnswer(i, formData);
        if (evaluation.isCorrect) totalPoints++;
        resultsData.push(evaluation);
    }

    fillResultTable(resultsData);
    document.getElementById('total-score').innerText =
            `Итого: ${totalPoints} из ${QUIZ_SIZE}`;
}

/** * Проверяет правильность ответа
 * @param {number} index - Порядковый номер вопроса (от 1 до QUIZ_SIZE).
 * @param {FormData} formData - Объект данных формы, содержащий
 * ответы пользователя.
 * @returns {Object} Объект с данными проверки: номер, текст вопроса,
 * ответы и статус верности.
 * Возвращает объект с данными проверки 
 */
function checkUserAnswer(index, formData) {
    let key = `q${index}`;
    let userAns = "";
    let isCorrect = false;

    if (CHECKBOX_IDS.includes(index)) {
        let checked = formData.getAll(key);
        userAns = checked.join(", ");
        isCorrect = JSON.stringify(checked.sort()) ===
                JSON.stringify(ANSWERS[key].sort());
    } 
    else if (TEXTBOX_IDS.includes(index)) {
        userAns = (formData.get(key) || "").trim();
        isCorrect = userAns.toLowerCase() === ANSWERS[key].toLowerCase();
    } 
    else {
        userAns = formData.get(key);
        isCorrect = userAns === ANSWERS[key];
    }

    return {
        number: index,
        question: QUESTIONS[index - 1],
        answer: userAns || "Нет ответа",
        correct: Array.isArray(ANSWERS[key]) ? ANSWERS[key].join(", ") : ANSWERS[key],
        isCorrect: isCorrect
    };
}

/**
 * Заполняет таблицу данными из массива
 * @param {Array} results - Массив объектов, полученных из функции
 * checkUserAnswer.
*/
function fillResultTable(results) {
    let tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ""; 

    results.forEach(item => {
        let row = tableBody.insertRow();
        row.className = item.isCorrect ? 'correct' : 'incorrect';
        
        row.innerHTML = `
            <td>${item.number}</td>
            <td>${item.question}</td>
            <td>${item.answer}</td>
            <td>${item.correct}</td>
            <td>${item.isCorrect ? 1 : 0}</td>
        `;
    });
}

/** * Назначение обработчиков клика кнопкам управления */
document.getElementById('start-btn').onclick = startQuiz;
document.getElementById('submit-btn').onclick = finishQuiz;
