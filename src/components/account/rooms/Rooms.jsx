import React from 'react';
import s from './Rooms.module.scss'
import Room from './room/Room';
import { StoreContext } from './../../../store/store';

const Rooms = ({ activeRoom, rooms, setActiveRoom }) => {
    return (
        <StoreContext.Consumer>
            {({state}) => (
                <div className={s.rooms}>
                    {rooms ? rooms.map(room => (
                            <Room
                                roomId={room.id}
                                activeRoom={activeRoom}
                                avatarUrl={room.avatar_url}
                                name={room.name}
                                members={room.members}
                                setAsActiveRoom={setActiveRoom}
                                myId={state.user_id}
                                key={room.id}
                            />
                    )) : <div>Loading...</div>}
                </div>)}
        </StoreContext.Consumer>
    );
}

export default Rooms;
