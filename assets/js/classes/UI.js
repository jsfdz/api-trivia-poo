export default class UI {
    static renderMessage(messages) {
        const
            { className, message } = messages,
            root = document.querySelector('body'),
            div = document.createElement('div')

        div.classList.add('alert', `alert-${className}`, 'alert-dismissible', 'fade', 'show')
        div.setAttribute('role', 'alert')
        div.innerHTML = message
        div.innerHTML += `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`
        root.insertAdjacentElement('afterbegin', div)
    }

    static renderCategories(categories) {
        const
            category = document.getElementById('categories')

        let
            html = ''

        for (const category of categories.trivia_categories) html += `<option value="${category.id}">${category.name}</option>`

        category.innerHTML += html
    }

    static renderHighScore(highScores) {
        const
            highScoresList = document.getElementById('highScoresList')

        let
            html = ''

        highScores.map(score => {
            html += `<li class="high-score list-group-item d-flex justify-content-between align-items-center">`
            html += `${score.userName}`
            html += `<span class="badge bg-info rounded-pill">`
            html += `${score.score}`
            html += `</span>`
            html += `</li>`
        })

        highScoresList.innerHTML = html
    }

    static renderProgressBar(progress) {
        const
            progressBar = document.querySelector('.progress .progress-bar')

        progressBar.setAttribute('aria-valuenow', progress)
        progressBar.style.width = `${progress}%`
    }

    static renderProgressText(progress) {
        const
            progressText = document.querySelector('.progress-text'),
            { questionCounter, maxQuestions } = progress

        progressText.innerHTML = `Question ${questionCounter} of ${maxQuestions}`
    }

    static renderQuestions(currentQuestion) {
        const
            quiz = document.getElementById('quiz'),
            category = document.querySelector('.category')

        let
            html = '',
            answers = []

        category.innerHTML = currentQuestion.category

        html += `<h2 class="question">`
        html += `${currentQuestion.question}`
        html += `</h2>`

        currentQuestion.incorrect_answers.forEach(answer => answers.push(answer))
        answers.push(currentQuestion.correct_answer)
        answers.sort(() => Math.random() - 0.5)

        html += `<div class="answers text-start">`
        answers.forEach((answer, i) => {
            html += `<div class="form-check">`
            html += `<input class="form-check-input" id="answer${i}" type="checkbox" value="${answer}">`
            html += `<label class="form-check-label" for="answer${i}">`
            html += `${answer}`
            html += `</label>`
            html += `</div>`
        })
        html += `</div>`

        quiz.innerHTML = html
    }

    static renderScore(score) {
        const
            setScore = document.querySelector('.score span'),
            imgScore = document.querySelector('.img-score')

        if (score !== 0) {
            imgScore.setAttribute('src', 'https://i.pinimg.com/originals/69/e0/6a/69e06a096ec5e14eefa1b7ff72fddf7f.gif')
            imgScore.setAttribute('alt', 'winner')
        }

        setScore.innerHTML = score
    }

    static renderMostRecentScore(mostRecentScore) {
        const
            recentScore = document.querySelector('.mostRecentScore span'),
            userName = document.getElementById('userName'),
            btnSaveScore = document.getElementById('btnSaveScore')

        recentScore.innerHTML = mostRecentScore

        userName.addEventListener('keyup', () => btnSaveScore.disabled = !userName.value)
    }
}