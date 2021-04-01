import s from "./Messenger.module.scss"
import React, { useEffect, useState, useContext } from "react"
import Room from "./rooms/room/Room"
import Rooms from "./rooms/Rooms"
import { Link, useHistory } from "react-router-dom"
import { AuthAPI, ChatsAPI } from "../../api/api"
import Loader from '../loader/Loader';
import Chat from './chat/Chat';
import { StoreContext } from '../../contexts/StoreProvider';
import ChatC from './chat/ChatC';
import { ChatsContext } from '../../contexts/ChatsProvider';

const Messenger = () => {

	// context
	const { state } = useContext(StoreContext)
	const { chatsState, setActiveChat } = useContext(ChatsContext)

	// active room
	const [activeRoomId, setActiveIdRoom] = useState(null)
	const setActiveRoom = (id) => {
		setActiveIdRoom(id)
		setActiveChat(id)
	}

	useEffect(() => {
		const cancel = (e) => e.keyCode === 27 ? setActiveIdRoom(null) : null
		document.addEventListener('keyup', cancel)
		return () => document.removeEventListener('keyup', cancel)
	})

	return (
		<>
			{ state.appInitialized && state.auth ?

				<div className={s.messengerWrapper}>
					<div className={s.head}>
						<div className={s.accountWrapper}>
							{state.avatarUrl ? (
								<img src={state.avatarUrl} alt={state.name + " avatar"} />
							) : (
									<div className={s.noAvatar}></div>
								)}
							<span className={s.account}>Account: {state.name}</span>
						</div>
						<div>
							<Link to="/" className={s.backBtn}>Back</Link>
						</div>
					</div>
					<div className={s.rooms}>
						<Rooms activeRoom={activeRoomId} rooms={chatsState.rooms} setActiveRoom={setActiveRoom} />
					</div>
					<div className={s.chat}>
						{activeRoomId ?
							<ChatC />
							: <div className={s.textCenter}>Выберите диалог</div>}
					</div>
				</div>

				: <Loader />}
		</>
	)
}

export default Messenger
