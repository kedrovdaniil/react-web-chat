import s from './Message.module.scss'
import React from 'react';
import DateTime from 'luxon/src/datetime.js'

const Message = ({ message, isMy, createdAt }) => {

    const date = DateTime.fromISO(createdAt).toLocaleString(DateTime.TIME_SIMPLE)

    return (
        <div className={isMy ? s.myWrapper : s.wrapper}>
            <div className={isMy ? s.myMessage : s.message}>
                <span>{message}</span>
            </div>
            <span className={s.time}>{date}</span>
        </div>
    );
}

export default Message;
