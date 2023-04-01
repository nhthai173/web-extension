const items = [];

const completeExam = () => {
    const questions = document.querySelectorAll('.exam-content ul li');
    questions.forEach((question) => {
        const ins = question.querySelectorAll('.question-answer-detail input')
        const answerIndex = parseInt(ins[ 0 ].value)
        ins[ answerIndex ].click()
        // Remove Correct badge
        question.querySelector('.question-result .badge.correct').remove()
        // ------ //
        const answers = [ ...question.querySelectorAll('.question-answer-detail .radio-control label') ].map((label) => label.innerText)
        answers[ answerIndex - 1 ] = `<b>${answers[ answerIndex - 1 ]}</b>`
        const question_detail = `<div class="question-item"><p class="question">${question.querySelector('h4').innerText} ${question.querySelector('p').innerText}</p><p class="answer">${answers.join('</p><p class="answer">')}</p></div>`
        console.log(question_detail)
        items.push(question_detail)
    })
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
    div.innerHTML = `<button id="printExam" class="btn orange bigsize f16b h51">In đề thi kèm đáp án</button>`
    container.prepend(div)
    document.querySelector('#printExam').addEventListener('click', () => {
        completeExam();
        print();
    })
}, 500);