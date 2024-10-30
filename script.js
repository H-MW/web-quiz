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
    questionSumText.innerText = quizDataLength;
    document.title = '問題： ' + questionObj[id];
    questionTitle.innerText = questionObj[id];
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
        questionObj[i] = quizData[i].question.toString();
        correctAnswerObj[i] = quizData[i].correctAnswer.toString();
        correctAnswer2Obj[i] = quizData[i].correctAnswer2.toString();
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
    let correctAnswer = correctAnswerObj[id];
    let correctAnswer2 = correctAnswer2Obj[id];

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
    id++;
    questionNum++;
    loadQuizTexts();
}

let id = 0;
let questionObj = new Object();
let correctAnswerObj = new Object();
let correctAnswer2Obj = new Object();
let questionNum = 1;
let quizDataLength;
let isRandom = false;
let correctAnswerText;

fetchData()
.then(() => {
    loadQuizTexts();
})
.catch((err) => {console.log(err);})

random.addEventListener('change', () => {
    isRandom = random.checked;
    id = 0;
    questionNum = 1;
    loadQuizTexts();
});
submitButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', nextQuestion);


// function questionSum() {
//     $handler = fopen(__DIR__.'/data.csv', 'r');
//     for( $count = 0; fgets( $handler ); $count++ );

//     return $count-1;
// }

// function fetchByID($id) {
//     // ファイルを開く
//     $handler = fopen(__DIR__.'/data.csv', 'r');

//     // データを取得
//     $question = [];
//     while ($row = fgetcsv($handler)) {
//         if (isDataRow($row)) {
//             if ($row[0] === $id) {
//                 $question = $row;
//                 break;
//             }
//         }
//     }

//     // ファイルを閉じる
//     fclose($handler);

//     // データを返す
//     return $question;
// }

// function isDataRow(array $row)
// {
//     // データの項目数が足りているか判定
//     if (count($row) !== 4) {
//         return false;
//     }

//     // データの項目の中身がすべて埋まっているか確認する
//     foreach ($row as $value) {
//         // 項目の値が空か判定
//         if (empty($value)) {
//             return false;
//         }
//     }

//     // idの項目が数字ではない場合は無視する
//     if (!is_numeric($row[0])) {
//         return false;
//     }

//     // すべてチェックが問題なければtrue
//     return true;
// }

// function generateFormattedData($data)
// {
//     // 構造化した配列を作成する
//     $formattedData = [
//         'id' => ($data[0]),
//         'question' => ($data[1]),
//         'correctAnswer' => ($data[2]),
//         'correctAnswer2' => ($data[3]),
//     ];

//     return $formattedData;
// }