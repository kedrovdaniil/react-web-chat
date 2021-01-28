import React, { createRef, useCallback, useContext, useMemo, useRef } from 'react';
import s from './Chat.module.scss'
import Message from './message/Message';
import { useState, useEffect, memo } from 'react';
import { ChatsAPI } from '../../../api/api';
import AddMessage from './addMessage/AddMessage';
import { StoreContext } from './../../../store/store';
import Echo from "laravel-echo"

const Chat = memo(({ chatName, messages, isDownloading, chatId, setNewMessage, userId}) => {

    // scroll to bottom effect
    const m = useRef(null)
    // useEffect(() => {
    //     if (!!m.current) {
    //         const el = m.current
    //         setTimeout(() => {
    //             const top = el.scrollHeight - el.clientHeight
    //             el.scroll({ top: top }) // behavior: "smooth"
    //         }, 1)
    //     }
    // }, [messages])


    return (
        <div className={s.chat}>
            <>
                <div className={s.head}>
                    <div className={s.chatName}><span>{chatName}</span></div>
                </div>
                <div className={s.messages} ref={m}>
                    {console.log('on set считываем | ', 'messages:', messages)}
                    {messages && !isDownloading ? messages.map(message => (
                        <Message message={message.content} isMy={userId === message.user_id} createdAt={message.created_at} key={message.id} />
                    )) : <div className={s.textCenter}>
                            <img src="/donut.gif" alt="Loading" className={s.donut} />
                        Loading...
                        </div>}
                </div>
                <AddMessage chatId={chatId} setNewMessage={setNewMessage} />
            </>
        </div>
    );
})

export default Chat;
