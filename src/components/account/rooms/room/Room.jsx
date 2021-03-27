import React, { useContext } from 'react';
import s from './Room.module.scss'
import { StoreContext } from '../../../../contexts/StoreProvider';

const Room = ({avatarUrl, name, setAsActiveRoom, roomId, activeRoom, members, myId, userId, isTyping, lastMessage}) => {

    console.log(`ROOM ${roomId} lastMessage = `, lastMessage)

    const isPublicChat = members.length !== 2 ? true : false

    const getAvatar = () => {
        if (isPublicChat) {
            return avatarUrl ? avatarUrl : ""
        } else {
            const anotherMan = members.filter(m => m.id != userId)[0]
            return anotherMan.avatar_url
        }
    }
    
    const getRoomName = () => {
        if (isPublicChat) {
            return name ? name : "Общий чат"
        } else {
            const anotherMan = members.filter(m => m.id != userId)[0]
            return anotherMan.name
        }
    }

    if (!!isPublicChat) {
        const avatar = avatarUrl ? avatarUrl : ""
        const roomName = name ? name : "Общий чат"
    } else {
        const anotherMan = members.filter(m => m.id != userId)[0]
        const avatar = anotherMan.avatar_url
        const roomName = anotherMan.name
    }

    return (
        <div className={Number(activeRoom) === Number(roomId) ? `${s.chat} ${s.chatActive}` : s.chat} onClick={(e) => setAsActiveRoom(Number(e.target.dataset.id))} data-id={roomId}>
            <img className={s.avatar} src={getAvatar()} />
            <div className={s.info}>
                <div>{getRoomName()}</div>
                <div className={s.additional}>
                    {isTyping ? <img className={s.typing} src="/typing.gif" alt="typing"/> : <span className={s.lastMessage}>{lastMessage}</span>}
                </div>
            </div>
        </div>
    );
}

export default Room;
