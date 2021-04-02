import React, { useState } from 'react';
import s from './Rooms.module.scss'
import Room from './room/Room';
import { ChatsContext } from '../../../contexts/ChatsProvider';
import { useContext } from 'react';
import { StoreContext } from '../../../contexts/StoreProvider';
import AddRoom from './addRoom/AddRoom';
import PlusSVG from '../../icons/PlusSVG';
import Loader from '../../loader/Loader';

const Rooms = ({ activeRoom, rooms, setActiveRoom }) => {

    // context
    const { state } = useContext(StoreContext)
    const { chatsState } = useContext(ChatsContext)

    // state
    const [isAddFormOpen, setIsAddFormOpen] = useState(false)

    // open & close an add from
    const openCloseForm = () => setIsAddFormOpen(!isAddFormOpen)

    // messages
    const messages = (roomId) => chatsState.rooms.find(r => r.id === roomId).messages
    // console.log('messages', messages(1))

    // is typing
    const isTyping = (roomId) => messages(roomId).isTyping

    // last message
    const lastMessage = (roomId) => messages(roomId).data.length > 0 ? messages(roomId).data[0].content : null

    return (
        <div className={s.rooms}>
            {!isAddFormOpen ? <div className={s.addRoom} onClick={openCloseForm}>
                <PlusSVG />
                <span>Add a new one</span>
            </div>
                : <AddRoom openCloseForm={openCloseForm} />}
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
                )) : <img src='/loader.gif' />}
            </div>
        </div>
    )

}

export default Rooms;
