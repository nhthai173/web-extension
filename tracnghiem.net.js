const items = []; // For print as PDF
const DATA = {}; // For export data

const completeExam = () => {
    const questions = document.querySelectorAll('.exam-content ul li');
    questions.forEach((question) => {
        const ins = question.querySelectorAll('.question-answer-detail input')
        if (ins.length === 0) return

        // Click correct answer
        const answerIndex = parseInt(ins[ 0 ].value)
        ins[ answerIndex ].click()
        
        // Remove Correct badge
        const $correctBadge = question.querySelector('.question-result .badge.correct')
        if ($correctBadge) $correctBadge.remove()
        
        // ------ //
        const question_number = question.querySelector('h4').innerText
        const question_question = question.querySelector('p').innerText
        const answers = [ ...question.querySelectorAll('.question-answer-detail .radio-control label') ].map((label) => label.innerText)

        DATA[ question_number ] = {
            question: question_question,
            answers: Object.assign([], answers),
            correct: answerIndex - 1,
        }
        
        answers[ answerIndex - 1 ] = `<b>${answers[ answerIndex - 1 ]}</b>`
        const question_detail = `<div class="question-item">
            <p class="question">${question_number} ${question_question}</p>
            <p class="answer">${answers.join('</p><p class="answer">')}</p>
        </div>`
        items.push(question_detail)
    })

    console.log(DATA)
};


const print = () => {
    const html = `<html><head><title>Trắc nghiệm</title><style>body{font-family: Arial, Helvetica, sans-serif;} p{margin: 0;} .question-item{margin-bottom: 20px;} .question{font-weight: bold; font-size: 18px; margin-bottom: 10px;} .answer{font-size: 16px;}</style></head><body>${items.join('')}</body></html>`
    const myWindow = window.open('', 'myWindow', 'width=800,height=600');
    myWindow.document.write(html);
    myWindow.document.close();
    myWindow.focus();
    myWindow.print();
    myWindow.close();
}

const exportCSV = () => {
    if (!DATA || Object.keys(DATA).length === 0) return alert('Không có dữ liệu')
    let csvString = ''

    // CSV header
    const ansLen = DATA[ Object.keys(DATA)[ 0 ] ].answers.length
    csvString += '"question",'
    for (let i = 0; i < ansLen; i++) {
        csvString += `"answer_${i + 1}",`
    }
    csvString += '"correct"\n'

    // CSV body
    for (const questionNumber in DATA) {
        const question = DATA[ questionNumber ]
        csvString += `"${question.question}",`
        question.answers.forEach(a => {
            if (a) a = a.replace(/^[A-Z]\.\s*/g, '').replace(/\.$\s*/g, '')
            csvString += `"${a || ''}",`
        })
        csvString += `"${question.correct + 1}"\n`
    }
    
    // Download
    const filename = (document.body.title || 'data') + '.csv'
    saveCSV(filename, csvString)
}

const saveCSV = (filename, data) => {
    const blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

const isExamPage = () => {
    return Boolean(document.querySelector('.exam-content ul li .question-answer-detail input'))
}

// setTimeout(completeExam, 2000);
// setTimeout(print, 3000);

setTimeout(() => {
    const container = document.querySelector('.common-test-detail');
    if (!container) return
    if (!isExamPage()) return
    const div = document.createElement('div');
    div.style.display = 'absolute';
    div.style.top = '0';
    div.style.right = '0';
    div.style.zIndex = '9999';
    div.style.marginBottom = '20px';
    div.innerHTML = `<div id="nhtContainer" style="display: flex; justify-content: center;">
        <button id="completeExam" class="btn orange bigsize f16b h51">Hiện đáp án</button>
        <button id="printExam" style="margin-left: 20px;" class="btn orange bigsize f16b h51">In đề thi kèm đáp án</button>
        <button id="exportCSV" style="margin-left: 20px;" class="btn orange bigsize f16b h51">Xuất CSV</button>
    </div>`
    container.prepend(div)
    document.querySelector('#completeExam').addEventListener('click', () => {
        completeExam();
    });
    document.querySelector('#printExam').addEventListener('click', () => {
        completeExam();
        print();
    });
    document.querySelector('#exportCSV').addEventListener('click', () => {
        completeExam();
        exportCSV();
    });

    /* Data */
    const $data = document.createElement('textarea')
    dcsv.style.display = 'none'
    dcsv.id = 'nhtData'
    document.body.appendChild($data)

}, 500);


/* Remove ads */
setInterval(() => {
    const ads = [
        ...document.querySelectorAll('.adsbygoogle'),
        ...document.querySelectorAll('.adsense'),
        ...document.querySelectorAll('.aanetwork-ads'),
        ...document.querySelectorAll('.aanetwork-ads-box'),
        ...document.querySelectorAll('.sbAdv'),
        ...document.querySelectorAll('.sbAdv1'),
    ];
    ads.forEach((ad) => ad.remove());
}, 500);