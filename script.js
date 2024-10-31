const questionTitle = document.querySelector('#questionTitle')
const answeredSumText = document.querySelectorAll('.answeredSumText')
const questionSumText = document.querySelector('#questionSumText')
const random = document.querySelector('#random')
const answerText = document.querySelector('#answerText')
const submitButton = document.querySelector('#submitButton')
const resultText = document.querySelector('#resultText')
const nextButton = document.querySelector('#nextButton')

function loadQuizTexts() {
    answeredSumText[0].innerText = questionNum.toString();
    answeredSumText[1].innerText = questionNum.toString();
    questionSumText.innerText = quizDataLength.toString();
    document.title = '問題： ' + questionArray[numArray[id]];
    questionTitle.innerText = questionArray[numArray[id]];
    random.checked = isRandom;
    answerText.value = '';
    submitButton.disabled = '';
    resultText.style.display = "none";
    nextButton.style.display = "none";
}

async function fetchData() {
    //csvデータを読み込む
    const url = 'https://2s3wfjnsnup7qspt.public.blob.vercel-storage.com/data-quW8ABzgq7JnBkLDsafvIoo1WzPS0c.csv';
    const response = await fetch(url).then((responses) => responses.text());
    quizData = await csvToJson(response);
    
    quizDataLength = quizData.length;

    for (let i = 0; i < quizDataLength; i++) {
        questionArray[i] = String(quizData[i].question);
        correctAnswerArray[i] = String(quizData[i].correctAnswer);
        correctAnswer2Array[i] = String(quizData[i].correctAnswer2);
    }
}

function csvToJson(data) {
    //csvデータからjsonデータに変換
    let jsonArray = [];

    let RowArray = data.split('\n');
    let items = RowArray[0].split(',');
    for(let i = 1; i < RowArray.length; i++){
        let cellArray = RowArray[i].split(',');
        let line = new Object();
        for(let j = 0; j < items.length; j++){
            line[items[j]] = cellArray[j];
        }
        jsonArray.push(line);
    }
    return jsonArray;
}

function checkAnswer() {
    let correctAnswer = correctAnswerArray[numArray[id]];
    let correctAnswer2 = correctAnswer2Array[numArray[id]];

    answerValue = answerText.value;

    result = answerValue === correctAnswer || answerValue === correctAnswer2;
    
    if (correctAnswer2 !== 'nothing') {
        correctAnswerText = correctAnswer + ', ' + correctAnswer2;
    }else {
        correctAnswerText = correctAnswer;
    }

    if (result) {
        resultText.textContent = "正解です！";
        resultText.className = "result correct";
    }else {
        resultText.textContent = "不正解。答えは " + correctAnswerText + " です。";
        resultText.className = "result incorrect";
    }

    submitButton.disabled = 'disabled';
    resultText.style.display = 'block';
    nextButton.style.display = "block";
}

function nextQuestion() {
    questionNum++;
    id = numArray[questionNum - 1];
    loadQuizTexts();
}

let id = 0;
let questionArray = new Array();
let correctAnswerArray = new Array();
let correctAnswer2Array = new Array();
let numArray = new Array();
let quizDataLength;
let questionNum = 1;
let isRandom = false;
let correctAnswerText;

fetchData()
.then(() => {
    for (let i = 0; i < quizDataLength; i++) {
        numArray[i] = i;
    }
    loadQuizTexts();
})
.catch((err) => {console.err(err);})

random.addEventListener('change', () => {
    isRandom = random.checked;
    id = 0;
    questionNum = 1;
    
    for (let i = 0; i < quizDataLength; i++) {
        numArray[i] = i;
    }

    if (isRandom) {
        for (let i = quizDataLength; i > 0; i--) {
            let randNum = Math.floor(Math.random() * i);
            let numArray_ = numArray[--i];
            numArray[i] = numArray[randNum];
            numArray[randNum] = numArray_;
        }
        loadQuizTexts();
    }else {
        loadQuizTexts();
    }
    }
)

submitButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', nextQuestion);