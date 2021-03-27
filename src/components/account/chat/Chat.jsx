import React, { createRef, useCallback, useContext, useMemo, useRef } from 'react';
import s from './Chat.module.scss'
import Message from './message/Message';
import { useState, useEffect, memo } from 'react';
import { ChatsAPI } from '../../../api/api';
import AddMessage from './addMessage/AddMessage';
import { StoreContext } from '../../../contexts/StoreProvider';
import Echo from "laravel-echo"
import { ChatsContext } from '../../../contexts/ChatsProvider';

const Chat = memo(({ 
    isPublic,
    chatName, 
    messages, 
    isLoadingActive, 
    chatId, 
    addNewMessage, 
    userId, 
    onScrollToTop, 
    isTyping, 
    typingUsers 
}) => {
    // console.log('isLoadingActive', isLoadingActive)

    // context

    // ref
    const messagesContainer = useRef()

    useEffect(() => {
        messagesContainer.current.addEventListener('scroll', onScrollToTop)
        return () => messagesContainer.current.removeEventListener('scroll', onScrollToTop)
    }, [])

    return (
        <div className={s.chat}>
            <>
                <div className={s.head}>
                    {isLoadingActive && <div className={s.loader}>
                        <img src="/loader.gif" alt="Loading" />
                    </div>}
                    <div className={s.chatName}>
                        <span>{chatName}</span>
                    </div>
                </div>
                <div className={s.messages} ref={messagesContainer}>
                    <div className={s.messagesDiv}>

                        {messages ? messages.map((message, i) => (
                            <Message message={message.content} isMy={userId === message.user_id} createdAt={message.created_at} key={i} />
                        )) : <div className={s.textCenter}>
                            <img src="/donut.gif" alt="Loading" className={s.donut} />
                        Loading...
                        </div>}
                    </div>
                </div>
                <AddMessage chatId={chatId} addNewMessage={addNewMessage} isTyping={isTyping} typingUsers={typingUsers} />
            </>
        </div>
    );
})

export default Chat;
