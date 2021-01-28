import React, { useContext } from 'react';
import s from './Room.module.scss'
import { StoreContext } from './../../../../store/store';

const Room = ({avatarUrl, name, setAsActiveRoom, roomId, activeRoom, members, myId}) => {
    
    const {state} = useContext(StoreContext)

    const userId = state.user_id
    const isPublicChat = members.length !== 2 ? true : false

    // const avatar = undefined
    // const roomName = undefined

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
    // console.log("avatar", avatar)
    // console.log("roomName", roomName)
    // console.log("member", members)
    // console.log('member',members.filter(m => m.id != userId)[0].name)

    return (
        <div className={Number(activeRoom) === Number(roomId) ? `${s.chat} ${s.chatActive}` : s.chat} onClick={(e) => setAsActiveRoom(e.target.dataset.id)} data-id={roomId}>
            <img src={getAvatar()} />
            <span>{getRoomName()}</span>
        </div>
    );
}

export default Room;
