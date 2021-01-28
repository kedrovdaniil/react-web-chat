import s from './Message.module.scss'
import React from 'react';

const Message = ({message, isMy}) => {
    return (
        <div className={isMy ? s.myMessage : s.message}>
            {message}
        </div>
    );
}

export default Message;
