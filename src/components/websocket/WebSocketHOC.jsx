
import { ChatsContext } from '../../contexts/ChatsProvider';
import { useContext, useEffect, memo, useCallback } from 'react';
import Echo from "laravel-echo";
import io from 'socket.io-client'
import { StoreContext } from '../../contexts/StoreProvider';

const WebSocketHOC = memo(({ children }) => {

	const { chatsState, setNewMessage, setTyping } = useContext(ChatsContext)
	const { state } = useContext(StoreContext)
	// console.log('chatsState room 1', chatsState.rooms[0].messages.data)

	useEffect(() => {

		// connect to broadcast channel
		window.io = io

		// connect to socket with auth
		window.Echo = new Echo({
			broadcaster: 'socket.io',
			host: window.location.hostname + ':6001', // this is laravel-echo-server host
			// authEndpoint: "/broadcasting/auth",
		});

		window.Echo.private(`messenger`)
		// window.Echo.channel(`messenger`)
		// window.Echo.join(`messenger`)
			// .here(users => console.log('ECHO | users', users))
			// .joining(user => console.log('ECHO | joining user', user))
			// .leaving(user => console.log('ECHO | leaving user', user))
			.listen('.NewMessage', (e) => {
				// console.log('WebSocketHOC.jsx | event', e)
				// console.log('WebSocketHOC.jsx | NewMessage', e.message)
				// console.log('WebSocketHOC.jsx | Message Example', chatsState.rooms.find(r => r.id = 1).messages.data[0])
				// console.log('WebSocketHOC.jsx | ON MOUNT: 1.messages.data', chatsState.rooms.find(r => r.id = e.message.chat_id).messages.data)
				// console.log('websocket event', e, state.user_id !== e.senderId)


				setNewMessage(e.message, e.chatId, state.user_id !== e.senderId)

				////// example websocket message
				// {
				// chat_id: 1
				// content: "чё не отвечаешь?"
				// created_at: "2021-01-28T11:03:16.000000Z"
				// id: 211
				// updated_at: "2021-01-28T11:03:16.000000Z"
				// user_id: 1
				// }

			})
			// .whisper('typing', {
			// 	chat_id: chatsState.activeChatId,
			// 	user_id: state.user_id,
			// 	user_name: state.name
			// })
			.listenForWhisper('typing', (e) => {
				console.log('TYPING EVENT')
				setTyping(e.chat_id, e.user_id, e.user_name)
				// console.log('whisper', e.chat_id, e.user_id, e.user_name);
			})

		return () => {
			window.Echo.leave(`messenger`)
			// console.log('chat leaved')
		}
	}, [])

	return (
		<>
			{children}
		</>
	);
})

export default WebSocketHOC;