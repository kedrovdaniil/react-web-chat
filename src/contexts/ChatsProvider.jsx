import { createContext, useState } from "react";
import { ChatAPI } from "../api/api";
import { useLocalStorage } from './../utils/useLocalStorage';

export const ChatsContext = createContext()

let activeChatIdVariable = null

const ChatsProvider = ({ children }) => {
	// chats state
	const [chatsState, setChatsState] = useLocalStorage('messenger', {
		isSet: false,
		activeChatId: null,
		rooms: [
			{
				avatar_url: null,
				countOfMembers: null,
				created_at: null,
				created_by_user_id: null,
				deleted_at: null,
				id: null,
				members: [
					{
						avatar_url: null,
						created_at: null,
						email: null,
						email_verified_at: null,
						id: null,
						name: null,
						pivot: {
							chat_id: null,
							user_id: null,
						},
						updated_at: null,
					},
				],
				name: null,
				updated_at: null,
				messages: {
					data: [ // messages
						{
							id: null,
							chat_id: null,
							user_id: null,
							content: null,
						},
					],
					currentChunk: 1, // page
					isLoaderActive: false,
					messagesCount: null,
					pages: null,
					isTyping: false,
					typingUsers: []
				},
			},
		],
	})
	// console.log('chatsState', chatsState)

	// extra state
	if (!activeChatIdVariable) {
		activeChatIdVariable = chatsState.activeChatId
	}
	// console.log('CURRENT : activeChatIdVariable ==', activeChatIdVariable)


	// set data
	const setChatsData = (data) => {
		// console.log('CALL ==> setChatsData')
		setChatsState(chatsState => {
			const room = (roomId) => data.find(r => r.id === roomId)
			return ({
				...chatsState,
				isSet: true,
				rooms: data.map(r => ({
					...r,
					messages: {
						data: room(r.id).messages.data,
						currentChunk: 1,
						isLoaderActive: false,
						pages: room(r.id).messages.pages,
						isTyping: false,
						typingUsers: [],
					}
				}))
			})
		})
	}

	// set typing
	const [typingTimer, setTypingTimer] = useState(false)
	const setTyping = (chatId, userId, userName) => {
		// console.log('CALL ==> setTyping')

		// init timer
		// let typingTimer = false

		// clear timer if it already exist
		if (typingTimer) {
			setTypingTimer(clearTimeout(typingTimer))
		}

		// set isTyping & update state
		setChatsState(chatsState => ({
			...chatsState,
			rooms: chatsState.rooms.map(room => {
				if (room.id === chatId) {
					// console.log('from room', room.id, chatId, isTyping)
					room.messages.isTyping = true


					// console.log('condition', !room.messages.typingUsers.filter(u => u.id === userId).length)
					if (!room.messages.typingUsers.filter(u => u.id === userId).length) {
						room.messages.typingUsers = [
							...room.messages.typingUsers,
							{
								id: userId,
								name: userName
							}
						]
					}
				}

				return room
			})
		}))

		// setChatsState(chatsState => setIsTyping(chatsState, true))

		// set timer
		setTypingTimer(setTimeout(() => {
			setChatsState(chatsState => ({
				...chatsState,
				rooms: chatsState.rooms.map(room => {
					if (room.id === chatId) {
						// console.log('from room', room.id, chatId, isTyping)
						room.messages.isTyping = false

						room.messages.typingUsers = [
							...room.messages.typingUsers.filter(u => u.id !== userId)
						]
					}

					return room
				})
			}))
		}, 2000))
	}

	// add new message
	const setNewMessage = (newMessage, chatId, isAddable) => {
		// console.log('CALL ==> setNewMessage')

		// console.log('newMessage', newMessage)

		// console.log('WebSocketHOC.jsx | updateMessages() | chatsState before', chatsState)

		if (isAddable) {
			const newChatsState = (chatsState) => {
				const chat = chatsState.rooms.find(r => r.id === chatId)
				return ({
					...chatsState,
					rooms: [
						{
							...chat,
							messages: {
								...chat.messages,
								messagesCount: chat.messages.messagesCount + 1,
								pages: Math.ceil((chat.messages.messagesCount + 1) / 25),
								data: [
									newMessage,
									...chat.messages.data, // {data: [{..}, {..}]
								],
								typingUsers: [
									...chat.messages.typingUsers.filter(u => u.id !== newMessage.user_id)
								]
							}
						},
						...chatsState.rooms.filter(r => r.id !== chatId), // [{...}, {...}]
					]
				})
			}

			setChatsState(chatsState => newChatsState(chatsState))
		}
	}

	// set active chat id
	const setActiveChat = async (chatId) => {
		// console.log('CALL ==> setActiveChat')

		// set chat
		// console.log('set active chat = ', chatId)
		activeChatIdVariable = chatId
		setChatsState(chatsState => ({ ...chatsState, activeChatId: chatId }))
	}

	// pagination on scroll
	let inLoad = false
	const onScrollToTop = async (e) => {
		// console.log('_______________________')
		// console.log('CALL ==> onScrollToTop')

		// offset for top which will be start load if scroll to him
		const offset = 1

		// check
		const currentChat = chatsState.rooms.find(room => room.id === activeChatIdVariable)
		// console.log('activeChatIdVariable', activeChatIdVariable)
		// console.log('currentChat', currentChat, '|', chatsState.rooms.find(room => room.id === activeChatIdVariable))
		const currentChunk = currentChat.messages.currentChunk
		const pages = currentChat.messages.pages
		// console.log('activeChat', currentChat.id, ' | currentChunk', currentChunk, ' < ', 'pages', pages, ' = ', currentChunk < pages)


		const isShouldToLoadNextChunk = e.target.scrollHeight - e.target.clientHeight - offset <= Math.abs(Math.ceil(e.target.scrollTop)) && !inLoad && (currentChunk < pages)
		// console.log("isShouldToLoadNextChunk", isShouldToLoadNextChunk)

		// load next chunk
		if (isShouldToLoadNextChunk) {

			// block loading for secondary function call
			console.log('Заблокировал загрузку | should be == true', inLoad)
			inLoad = true

			// set isLoaderActive as true
			const stateCopy = Object.assign(chatsState)
			const rooms = [
				...stateCopy.rooms.map(room => {
					// if it target chat
					if (room.id === activeChatIdVariable) {
						room.messages.isLoaderActive = true
					}

					return room
				})
			]
			setChatsState(chatsState => ({
				...chatsState, rooms
			}))

			// iterate the current chunk for get a next chunk
			const page = currentChat.messages.currentChunk + 1

			// get a next chunk and set new messages
			const nextMessages = await ChatAPI.getPaginatedChunk(activeChatIdVariable, page)
			const stateCopy2 = Object.assign(chatsState)
			const rooms2 = [
				...stateCopy2.rooms.map(room => {
					// if it target chat
					if (room.id === activeChatIdVariable) {
						room.messages.currentChunk = room.messages.currentChunk + 1
						room.messages.data.push(...nextMessages.data)
						room.messages.isLoaderActive = false
					}

					return room
				})
			]
			setChatsState(chatsState => ({
				...chatsState,
				rooms: rooms2
			}))
			// console.log('nextMessages', nextMessages)
		}

		inLoad = false

	}

	return (
		<ChatsContext.Provider value={{ chatsState, setNewMessage, setChatsData, setActiveChat, onScrollToTop, setTyping }}>
			{children}
		</ChatsContext.Provider>
	)
}

export default ChatsProvider







						// current_page: null,
						// first_page_url: null,
						// from: null,
						// last_page: null,
						// last_page_url: null,
						// links: [
						// 	{
						// 		url: null,
						// 		label: null,
						// 		active: null,
						// 	},
						// ],
						// next_page_url: null,
						// path: null,
						// per_page: null,
						// prev_page_url: null,
						// to: null,
						// total: null,