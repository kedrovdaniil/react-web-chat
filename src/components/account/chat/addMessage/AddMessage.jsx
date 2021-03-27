import React, { useContext } from 'react';
import s from './AddMessage.module.scss'
import { useState } from 'react';
import { ChatAPI } from './../../../../api/api';
import { StoreContext } from '../../../../contexts/StoreProvider';

const AddMessage = ({chatId, addNewMessage, isTyping, typingUsers}) => {

    // context
    const {state} = useContext(StoreContext);

    // state
    const [message, setMessage] = useState('')

    const messageHandler = (e) => {
        e.preventDefault()
        setMessage(e.target.value)
        window.Echo.private(`messenger`).whisper('typing', {
            chat_id: chatId,
            user_id: state.user_id,
            user_name: state.name
        })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        // console.log('Submit', message)
        const status = await ChatAPI.newMessage(chatId, message)
        if (status === 200) {
            addNewMessage(message)
            setMessage("")
        }
        // console.log('Response status', status)
    }

    console.log('typingUsers', typingUsers)

    return (
        <div className={s.addMessage}>
            <form onSubmit={submitHandler}>
                <div className={s.typing}>
                    {isTyping && typingUsers.map((typingUser, i) => <span key={i}>{typingUser.name} is typing message...</span>)}
                </div>
                <div className={s.inputWrapper}>
                    <input type="text" className={s.input} placeholder="Enter the message" value={message} onChange={messageHandler} />
                    <button type="submit" className={s.btn}>Send</button>
                </div>
            </form>
        </div>
    );
}

export default AddMessage;
