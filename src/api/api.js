import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
})

export const AuthAPI = {
    getCSRF() {
        return instance.get('/sanctum/csrf-cookie')
    },
    login(email, password) {
        const postData = new FormData()
        postData.append('email', email)
        postData.append('password', password)

        return instance.get('/sanctum/csrf-cookie').then(response => {
            return instance.post('/login', postData).then(r => r.status)
        });
    },
    user() {
        return instance.get('/api/user').then(r => r.data).catch(e => {
            if (e.response) return {status: e.response.status, data: e.response.data}
            else if (e.message === "Network Error") return {status: 500, data: {error: "Server not respond. Please, try again later."}}
            else return {status: null, data: {error: e.message} }
        })
    },
    logout() {
        return instance.post('/logout').then(r => r.status)
    }
}

export const ChatsAPI = {
    chats() {
        return instance.get('api/allChats').then(r => r.data)
    },

    chat(chatId) {
        return instance.get(`api/chat/${chatId}/messages`).then(r => r.data)
    }
}

export const ChatAPI = {
    newMessage(chatId, message) {
        const postData = new FormData()
        postData.append('chat_id', chatId)
        postData.append('message', message)

        return instance.post(`api/chat/${chatId}/messages`, postData).then(r => r.status)
    },

    getPaginatedChunk(chatId, page) {
        // console.log("getPaginatedChunk params: ", {chatId, page})
        return instance.get(`api/chat/${chatId}/messages?page=${page}`).then(r => r.data)
    },

    getChat(chatId) {
        return instance.get(`api/chat/${chatId}/messages`).then(r => r.data)
    }
}