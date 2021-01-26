import UI from './UI.js'

export default class Message {
    constructor(className = 'info', message = '') {
        this.className = className
        this.message = message
        this.showMessage()
    }


    static showMessage(className = this.className, message = this.message) {
        const
            messages = {
                className,
                message
            }

        console.log(messages);

        UI.renderMessage(messages)
    }
}