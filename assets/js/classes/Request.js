import Message from "./Message.js"

export default class Request {
    static ajax(props) {
        let
            { url, cbSuccess, errorMessage = 'Something went wrong' } = props

        fetch(url)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(json => !json.response_code && json.response_code !== 1 ? cbSuccess(json) : Message.showMessage('danger', errorMessage))
            .catch(err => console.error(err))
    }
}