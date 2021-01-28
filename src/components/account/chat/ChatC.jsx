import React from 'react';
import { useContext, useState, useEffect, memo } from 'react';
import { StoreContext } from './../../../store/store';
import Echo from 'laravel-echo';
import { ChatsAPI } from '../../../api/api';
import Chat from './Chat';

const ChatC = memo(({ chatId, rooms }) => {

    const { state, setState } = useContext(StoreContext)

    const [isDownloading, setisDownloading] = useState(false)
    const [messages, setMessages] = useState(null)

    // // connect to broadcast channel
    // window.io = require("socket.io-client")

    // window.Echo = new Echo({
    //     broadcaster: 'socket.io',
    //     host: window.location.hostname + ':6001', // this is laravel-echo-server host
    //     authEndpoint: "/api/broadcasting/auth"
    // });

    useEffect(() => {
        // receive data
        const receiveMessages = async () => {
            setisDownloading(true)
            const r = await ChatsAPI.chat(chatId)
            if (r) {
                setMessages(r.data)
                // setState({ ...state, messages: r.data })
                // console.log('state', state)
                setisDownloading(false)
            }
        }
        if (chatId) receiveMessages()
    }, [])

    useEffect(() => {
        // // connect to sockets    
        if (chatId) {
            // window.Echo.channel(`chat.${chatId}`)
            //     .listen('.NewMessage', (e) => {
            //         console.log('NewMessage Event', e, e.message)
            //         console.log('current messages', messages)
            //         // console.log('NewSetState before spreas:', [...state.messages])
            //         // const newMessagesState = [e.message, ...messages]
            //         // console.log('NewSetState after:', newMessagesState)
            //         setMessages(messages => [e.message, ...messages])
            //         // setState({ ...state, messages: newMessagesState })

            //     })
            // console.log(`Новое подключение к каналу ${chatId}`)
        }

        return () => {
            window.Echo.leave(`chat.${chatId}`)
            // console.log(`Отключение от канала ${chatId}`)
        }
    }, [chatId, setMessages])

    // add new message
    const setNewMessage = (message) => {
        const newMessage = {
            id: Date.now(),
            chat_id: chatId,
            user_id: state.user_id,
            content: message,
            created_at: Date.now(),
            updated_at: Date.now(),
        }
        console.log('messages on set |', 'messages:',messages, '[...messages, newMessage]:', [...messages, newMessage])
        setMessages(messages => ([newMessage, ...messages]))
    }

    // chat name
    const room = rooms.filter(r => r.id === chatId)[0]
    const roomName = room.name
    const chatName = roomName ? roomName : room.countOfMembers === 2 ? `Чат с ${room.members.filter(m => m.id != state.user_id)[0].name}` : "Чат без названия"


    return (
        <>
            <Chat chatName={chatName} messages={messages} isDownloading={isDownloading} chatId={chatId} setNewMessage={setNewMessage} userId={state.user_id} />
        </>
    );
})

export default ChatC;
