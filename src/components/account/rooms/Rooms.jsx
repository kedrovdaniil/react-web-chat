import React from 'react';
import s from './Rooms.module.scss'
import Room from './room/Room';
import { ChatsContext } from '../../../contexts/ChatsProvider';
import { useContext } from 'react';
import { StoreContext } from '../../../contexts/StoreProvider';

const Rooms = ({ activeRoom, rooms, setActiveRoom }) => {

    // context
    const { state } = useContext(StoreContext)
    const { chatsState } = useContext(ChatsContext)

    // messages
    const messages = (roomId) => chatsState.rooms.find(r => r.id === roomId).messages
    // console.log('messages', messages(1))

    // is typing
    const isTyping = (roomId) => messages(roomId).isTyping

    // last message
    const lastMessage = (roomId) => messages(roomId).data[0].content

    return (
        <div className={s.rooms}>
            <div>
                {chatsState.isSet ? chatsState.rooms.map(room => (
                    <Room
                        roomId={room.id}
                        activeRoom={activeRoom}
                        avatarUrl={room.avatar_url}
                        name={room.name}
                        members={room.members}
                        setAsActiveRoom={setActiveRoom}
                        myId={chatsState.user_id}
                        key={room.id}
                        userId={state.user_id}
                        isTyping={isTyping(room.id)}
                        lastMessage={lastMessage(room.id)}
                    />
                )) : <div>Loading...</div>}
            </div>
            <div className={s.addRoom}>
                Add a new one
            </div>
        </div>
    )

}

export default Rooms;
