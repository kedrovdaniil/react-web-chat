import React, { useContext } from 'react';
import s from './Room.module.scss'
import { StoreContext } from '../../../../contexts/StoreProvider';

const Room = ({ avatarUrl, name, setAsActiveRoom, roomId, activeRoom, members, myId, userId, isTyping, lastMessage }) => {

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
            return name ? name : "Public chat"
        } else {
            const anotherMan = members.filter(m => m.id != userId)[0]
            return name ? name : anotherMan.name
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
            <div className={s.image}>
                <img className={s.avatar} src={getAvatar()} />
            </div>
            <div className={s.info}>
                <span className={s.name}>{getRoomName()}</span>
                <div className={s.additional}>
                    {isTyping ? <img className={s.typing} src="/typing.gif" alt="typing" /> : <span className={s.lastMessage}>{lastMessage}</span>}
                </div>
            </div>
        </div>
    );
}

export default Room;
