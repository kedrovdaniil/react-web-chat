import React from 'react';
import s from './AddMessage.module.scss'
import { useState } from 'react';
import { ChatAPI } from './../../../../api/api';

const AddMessage = ({chatId, setNewMessage}) => {

    const [message, setMessage] = useState('')

    const messageHandler = (e) => {
        e.preventDefault()
        setMessage(e.target.value)
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        console.log('Submit', message)
        const status = await ChatAPI.newMessage(chatId, message)
        if (status === 200) {
            setNewMessage(message)
            setMessage("")
        }
        console.log('Response status', status)
    }

    // console.log(message)

    return (
        <div className={s.addMessage}>
            <form onSubmit={submitHandler}>
                <input type="text" className={s.input} placeholder="Enter the message" value={message} onChange={messageHandler} />
                <button type="submit" className={s.btn}>Send</button>
            </form>
        </div>
    );
}

export default AddMessage;
