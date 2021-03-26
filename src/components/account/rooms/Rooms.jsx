import React from 'react';
import s from './Rooms.module.scss'
import Room from './room/Room';
import { ChatsContext } from '../../../contexts/ChatsProvider';
import { useContext } from 'react';

const Rooms = ({ activeRoom, rooms, setActiveRoom }) => {

    const { chatsState } = useContext(ChatsContext)

    return (
        <div className={s.rooms}>
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
                />
            )) : <div>Loading...</div>}
        </div>
    )

}

export default Rooms;
