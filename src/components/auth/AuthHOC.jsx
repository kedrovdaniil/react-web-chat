import React from 'react';
import { StoreContext } from '../../contexts/StoreProvider';
import { ChatsContext } from './../../contexts/ChatsProvider';
import { useContext } from 'react';
import { useEffect } from 'react';
import { ChatsAPI } from '../../api/api';
import { AuthAPI } from './../../api/api';

const AuthHOC = ({children}) => {

    // context
    const {state, setState} = useContext(StoreContext)
    const {chatsState, setChatsData} = useContext(ChatsContext)

    // check auth and set init
	useEffect(() => {
		// check auth and redirect if not auth
		const fetchAuth = async () => {
			const r = await AuthAPI.user()
			if (r.status === 401) {
				setState((state) => ({
					...state,
					appInitialized: true,
					auth: false,
				}))
				// redirect
				if (window.location.pathname != "/") {
					window.location.assign("/")
				}
			} else if (r.status === 500) {
				console.warn(
					"Кажется, с сервером сейчас какие-то неполадки. Пожалуйста, попробуйте зайти позже."
				)
				setState((state) => ({
					...state,
					appInitialized: true,
					auth: false,
					appError: r.data.error,
					modalType: "error",
					modalTitle: "Error",
					modalAllowForClose: false,
					isModalOpen: true,
				}))
			} else {
				setState((state) => ({
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
				// setRooms(c.data)
				// console.log('STATE', state, "|", { ...state, rooms: c.data })
				// console.log('set')
				setChatsData(c.data)
			}
		}
		receiveChats()
	}, [])

    return (
        <>
            {children}
        </>
    );
}

export default AuthHOC;
