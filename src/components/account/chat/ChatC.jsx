import React from 'react';
import { useContext, useState, useEffect, memo, useCallback } from 'react';
import { StoreContext } from '../../../contexts/StoreProvider';
import Echo from 'laravel-echo';
import { ChatsAPI } from '../../../api/api';
import Chat from './Chat';
import { ChatsContext } from '../../../contexts/ChatsProvider';

const ChatC = () => {

    // context
    const { state } = useContext(StoreContext)
    const { chatsState, setNewMessage, onScrollToTop } = useContext(ChatsContext)
    console.log('chatsState', chatsState)

    // chat id
    const chatId = chatsState.activeChatId

    // chat messages
    const messages = chatsState.rooms.find(room => room.id === chatId)?.messages?.data ?? []

    // add new message
    const addNewMessage = (message) => {

        // console.log('message', message)

        const newMessage = {
            id: Date.now(),
            chat_id: chatId,
            user_id: state.user_id,
            content: message,
            created_at: Date.now(),
            updated_at: Date.now(),
        }

        setNewMessage(newMessage, chatId, true)
    }

    // chat name
    const room = chatsState.rooms.find(r => r.id === chatId)
    const roomName = room.name
    const chatName = roomName ? roomName : room.countOfMembers === 2 ? `Чат с ${room.members.filter(m => m.id != state.user_id)[0].name}` : "Чат без названия"

    // is public
    const isPublic = room.countOfMembers > 2

    // is loading
    // console.log('isLoadingActive room.messages', room.messages)
    const isLoadingActive = room.messages.isLoaderActive

    // is typing
    const isTyping = room.messages.isTyping
    const typingUsers = room.messages.typingUsers

    return (
        <>
            <Chat isPublic={isPublic} chatName={chatName} messages={messages} isLoadingActive={isLoadingActive} chatId={chatId} addNewMessage={addNewMessage} userId={state.user_id} onScrollToTop={onScrollToTop} isTyping={isTyping} typingUsers={typingUsers} />
        </>
    );
}

export default ChatC;
