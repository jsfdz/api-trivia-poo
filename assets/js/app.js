import Request from "./classes/Request.js"
import UI from "./classes/UI.js"

const
    app = () => {

        let
            currentQuestion = {},
            acceptingAnswer = true,
            score = 0,
            questionCounter = 0,
            availableQuestions = [],
            maxQuestions = 0

        const
            START = document.getElementById('start'),
            GAME = document.getElementById('app'),
            END = document.getElementById('end'),
            SCORE_POINTS = 100,
            MAX_HIGH_SCORES = 10,
            BASE_API = 'https://opentdb.com/',

            highScores = JSON.parse(localStorage.getItem('highScores')) || []

        UI.renderHighScore(highScores)

        const
            getQuestions = (values) => {
                const
                    { amout, categories, difficulty, type } = values

                Request.ajax({
                    url: `${BASE_API}/api.php?amount=${amout}&category=${categories}&difficulty=${difficulty}&type=${type}`,
                    cbSuccess: (questions) => {
                        startGame(questions)
                    },
                    errorMessage: '🤔 insufficient questions for that selection, please try again'
                })
                maxQuestions = amout
            },

            getCategories = () => {
                Request.ajax({
                    url: `${BASE_API}/api_category.php`,
                    cbSuccess: (category) => {
                        UI.renderCategories(category)
                    }
                })
            },

            startGame = (questions) => {
                questionCounter = 0
                score = 0
                availableQuestions = [...questions.results]
                getNewQuestion()

                START.classList.add('animate__animated', 'animate__fadeOut')
                setTimeout(() => {
                    START.classList.add('d-none')
                    START.classList.remove('animate__animated', 'animate__fadeOut')
                }, 400)
                GAME.classList.add('animate__animated', 'animate__fadeIn')
                setTimeout(() => {
                    GAME.classList.remove('d-none')
                    GAME.classList.remove('animate__animated', 'animate__fadeIn')
                }, 600)
            },

            getNewQuestion = () => {
                if (availableQuestions.length === 0) {
                    localStorage.setItem('mostRecentScore', score)
                    endGame()
                    return
                }

                questionCounter++

                const
                    PROGRESS = (questionCounter / maxQuestions) * 100,
                    PROGRESS_TEXT = {
                        questionCounter,
                        maxQuestions
                    }

                UI.renderProgressBar(PROGRESS)
                UI.renderProgressText(PROGRESS_TEXT)

                const
                    questionsIndex = availableQuestions.length - 1

                currentQuestion = availableQuestions[questionsIndex]
                UI.renderQuestions(currentQuestion)

                availableQuestions.splice(questionsIndex, 1)
                acceptingAnswer = true
            },

            incrementScore = (num) => {
                score += num
                UI.renderScore(score)
            },

            endGame = () => {
                const
                    mostRecentScore = localStorage.getItem('mostRecentScore')

                UI.renderMostRecentScore(mostRecentScore)

                GAME.classList.add('animate__animated', 'animate__fadeOut')
                setTimeout(() => {
                    GAME.classList.add('d-none')
                    GAME.classList.remove('animate__animated', 'animate__fadeOut')
                }, 200)
                END.classList.add('animate__animated', 'animate__fadeIn')
                setTimeout(() => {
                    END.classList.remove('d-none')
                    END.classList.remove('animate__animated', 'animate__fadeIn')
                }, 200)
            },

            saveHighScore = (score) => {
                highScores.push(score)
                highScores.sort((a, b) => b.score - a.score)
                highScores.splice(MAX_HIGH_SCORES)
                localStorage.setItem('highScores', JSON.stringify(highScores))
            }

        getCategories()

        document.addEventListener('click', (e) => {
            if (e.target.matches('#btnStart')) {
                const
                    amout = document.getElementById('amout').value,
                    categories = document.getElementById('categories').value,
                    difficulty = document.getElementById('difficulty').value,
                    type = document.getElementById('type').value,
                    values = {
                        amout,
                        categories,
                        difficulty,
                        type
                    }

                getQuestions(values)
            }

            if (e.target.closest('.form-check input')) {
                if (!acceptingAnswer) return

                acceptingAnswer = false

                const
                    selectInput = e.target,
                    selectAnswer = selectInput.value,
                    el = document.createElement("div")

                el.innerHTML = el.textContent = currentQuestion.correct_answer

                const
                    correctAnswer = el.innerHTML,
                    classToApply = selectAnswer === correctAnswer ? 'correct' : 'incorrect'

                if (classToApply === 'correct') incrementScore(SCORE_POINTS)

                selectInput.parentElement.classList.add(classToApply)

                setTimeout(() => {
                    selectInput.parentElement.classList.remove(classToApply)
                    getNewQuestion()
                }, 1000)
            }

            if (e.target.matches('#btnSaveScore')) {
                const
                    mostRecentScore = localStorage.getItem('mostRecentScore'),
                    userName = document.getElementById('userName'),
                    score = {
                        userName: userName.value,
                        score: mostRecentScore
                    }

                saveHighScore(score)
                UI.renderHighScore(highScores)
                userName.value = ''
            }
            if (e.target.matches('#btnBackToHome')) {
                END.classList.add('animate__animated', 'animate__fadeOut')
                setTimeout(() => {
                    END.classList.add('d-none')
                    END.classList.remove('animate__animated', 'animate__fadeOut')
                }, 400)
                START.classList.add('animate__animated', 'animate__fadeIn')
                setTimeout(() => {
                    START.classList.remove('d-none')
                    START.classList.remove('animate__animated', 'animate__fadeIn')
                }, 400)
            }
        })
    }

export default app