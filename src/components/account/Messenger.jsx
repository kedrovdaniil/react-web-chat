import s from "./Messenger.module.scss"
import React, { useEffect, useState, useContext } from "react"
import Room from "./rooms/room/Room"
import Rooms from "./rooms/Rooms"
import { Link, useHistory } from "react-router-dom"
import { AuthAPI, ChatsAPI } from "../../api/api"
import Loader from '../loader/Loader';
import Chat from './chat/Chat';
import { StoreContext } from './../../store/store';
import ChatC from './chat/ChatC';

const Messenger = ({ avatarUrl, name, auth }) => {
	let h = useHistory()
	const { state, setState } = useContext(StoreContext)

	useEffect(() => {
		// check auth and redirect if not auth
		const fetchAuth = async () => {
			const r = await AuthAPI.user()
			if (r.status === 401) {
				setState(state => ({
					...state, appInitialized: true, auth: false
				}))
				h.push('/')
			} else if (r.status === 500) {
				console.warn('Кажется, с сервером сейчас какие-то неполадки. Пожалуйста, попробуйте зайти позже.')
				setState(state => ({
					...state, appInitialized: true, auth: false, appError: r.data.error, modalType: 'error', modalTitle: 'Error', modalAllowForClose: false, isModalOpen: true
				}))
			} else {
				setState(state => ({
					...state,
					appInitialized: true,
					user_id: r.id,
					auth: true,
					name: r.name,
					avatarUrl: r.avatar_url,
				}))
			}
		}
		fetchAuth()

		// receive data
		const receiveChats = async () => {
			const c = await ChatsAPI.chats()
			if (c) {
				setRooms(c.data)
			}
		}
		receiveChats()
	}, [setState])

	const [rooms, setRooms] = useState([])
	const [activeRoomId, setActiveIdRoom] = useState(null)

	const setActiveRoom = (id) => {
		setActiveIdRoom(id)
	}
	
	return (
		<StoreContext.Consumer>{({ state }) => (
			<>
				{ state.appInitialized && auth ?

					<div className={s.messengerWrapper}>
						<div className={s.head}>
							<div className={s.accountWrapper}>
								{avatarUrl ? (
									<img src={avatarUrl} alt={name + " avatar"} />
								) : (
										<div className={s.noAvatar}></div>
									)}
								<span className={s.account}>Account: {name}</span>
							</div>
							<div>
								<Link to="/" className={s.backBtn}>Back</Link>
							</div>
						</div>
						<div className={s.rooms}>
							<Rooms activeRoom={activeRoomId} rooms={rooms} setActiveRoom={setActiveRoom} />
						</div>
						<div className={s.chat}>
							{activeRoomId ?
								<ChatC chatId={Number(activeRoomId)} rooms={rooms} />
								: <div className={s.textCenter}>Выберите диалог</div>}
						</div>
					</div>

					: <Loader />}
			</>)}
		</StoreContext.Consumer>
	)
}

export default Messenger
