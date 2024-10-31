//import DOM
const questionTitle = document.querySelector('#questionTitle')
const answeredSumText = document.querySelectorAll('.answeredSumText')
const questionSumText = document.querySelector('#questionSumText')
const random = document.querySelector('#random')
const answerText = document.querySelector('#answerText')
const submitButton = document.querySelector('#submitButton')
const resultText = document.querySelector('#resultText')
const nextButton = document.querySelector('#nextButton')

function quizReset() {
    questionNum = 1; //問題数を初期状態にリセット

    //quizOrderArrayを[0,1,2,3, ... quizDataLength - 1]に
    for (let i = 0; i < quizDataLength; i++) {
        quizOrderArray[i] = i;
    }
}

// クイズを読み込む
function quizDOM() {
    id = quizOrderArray[questionNum -1] //読み込むべき問題のIDを取得

    answeredSumText[0].innerText = answeredSumText[1].innerText = questionNum.toString();
    questionSumText.innerText = quizDataLength.toString();
    document.title = '問題： ' + questionArray[id];
    questionTitle.innerText = questionArray[id];
    random.checked = isRandom;
    answerText.value = '';
    submitButton.disabled = '';
    resultText.style.display = "none";
    nextButton.style.display = "none";
}

async function fetchData() {
    //csvデータを読み込む
    const url = 'https://2s3wfjnsnup7qspt.public.blob.vercel-storage.com/data-quW8ABzgq7JnBkLDsafvIoo1WzPS0c.csv';
    const response = await fetch(url).then((responses) => responses.text().catch((err) => {console.log(err)}));
    quizData = csvToJson(response);
    
    quizDataLength = quizData.length;

    for (let i = 0; i < quizDataLength; i++) {
        questionArray[i] = String(quizData[i].question); //問題タイトルの配列作成
        correctAnswerArray[i] = String(quizData[i].correctAnswer);  //正解の配列の作成
        correctAnswer2Array[i] = String(quizData[i].correctAnswer2);  //正解2の配列の作成
    }
}

function csvToJson(csv) {
    //csvデータからjsonデータに変換
    let jsonArray = [];

    let RowArray = csv.split('\n');
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

function makeRandom(isRandom) {
    if (isRandom) {
        //quizOrderArray = [0,1,2,3, ... quizDataLength - 1] → [24,63,75, ...]のようにランダムに
        for (let i = quizDataLength; i > 0; i--) {
            let randNum = Math.floor(Math.random() * i);
            let quizOrderArray_ = quizOrderArray[--i];
            quizOrderArray[i] = quizOrderArray[randNum];
            quizOrderArray[randNum] = quizOrderArray_;
        }
    }
}

function checkAnswer() {
    submitButton.disabled = 'disabled';

    const correctAnswer = correctAnswerArray[id];
    const correctAnswer2 = correctAnswer2Array[id];
    let correctAnswerText; //不正解時に表示するテキスト
    
    const answerValue = answerText.value; //回答を取得

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

    resultText.style.display = 'block';
    nextButton.style.display = "block";
}

let questionNum; //経過問題数
let id; //問題ID
let questionArray = new Array(); //問題タイトルの配列
let correctAnswerArray = new Array(); //正解の配列
let correctAnswer2Array = new Array(); //正解2の配列(答えが複数ある時用)
let quizOrderArray = new Array(); //問題の配列を呼び出す順番の配列
let quizDataLength; //クイズデータの量を数値で代入
let isRandom = false; //ランダム機能の有効/無効


fetchData() //クイズデータを取ってくる
.then(() => {
    //データの取得完了後の処理
    quizReset()
    quizDOM();
})
.catch((err) => {console.err(err);})

//ランダム機能のチェックボックスの変更を検知
random.addEventListener('change', () => {
    isRandom = random.checked; //チェックの有無を確認
    quizReset();
    makeRandom(isRandom);
    quizDOM();
    }
)

submitButton.addEventListener('click', checkAnswer);

nextButton.addEventListener('click', () => {
    questionNum++;
    quizDOM();
});