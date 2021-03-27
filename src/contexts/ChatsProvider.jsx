import { createContext, useState } from "react";
import { ChatAPI } from "../api/api";
import { useLocalStorage } from './../utils/useLocalStorage';

export const ChatsContext = createContext()

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

	// set data
	const setChatsData = (data) => {
		// console.log('allChats set', {
		// 	...chatsState,
		// 	isSet: true,
		// 	rooms: data.map(room => {
		// 		console.log('room.id', room.id); return ({
		// 			...room,
		// 			messages: {
		// 				data: data.find(r => r.id === room.id).messages.data,
		// 				currentChunk: 1,
		// 				isLoaderActive: false,
		// 				pages: data.find(r => r.id === room.id).messages.pages
		// 			}
		// 		})
		// 	})
		// })
		setChatsState(chatsState => ({
			...chatsState,
			isSet: true,
			rooms: data.map(room => ({
				...room,
				messages: {
					data: data.find(r => r.id === room.id).messages.data,
					currentChunk: 1,
					isLoaderActive: false,
					pages: data.find(r => r.id === room.id).messages.pages,
					isTyping: false,
					typingUsers: [],
				}
			}))
		}))
	}

	// set typing
	const [typingTimer, setTypingTimer] = useState(false)
	const setTyping = (chatId, userId, userName) => {


		// const setIsTyping = (chatsState, isTyping) => {

		// 	console.log('NEXT STATE WILL BE:', {
		// 		...chatsState,
		// 		rooms: [
		// 			...chatsState.rooms.map(room => {
		// 				// const copyRoom = Object.assign(room)
		// 				if (room.id === chatId) {
		// 					// console.log('from room', room.id, chatId, isTyping)
		// 					room.messages.isTyping = isTyping

		// 					if (isTyping) {
		// 						// console.log('isTyping true, add user:', {
		// 						// 	id: userId,
		// 						// 	name: userName
		// 						// })
		// 						console.log('condition', !room.messages.typingUsers.filter(u => u.id === userId).length)
		// 						if (!room.messages.typingUsers.filter(u => u.id === userId).length) {
		// 							room.messages.typingUsers = [
		// 								// ...room.messages.typingUsers,
		// 								{
		// 									id: userId,
		// 									name: userName
		// 								}
		// 							]
		// 						}
		// 					} else {
		// 						room.messages.typingUsers = [
		// 							...room.messages.typingUsers.filter(u => u.id !== userId)
		// 						]
		// 					}
		// 				}

		// 				console.log('exit room', room)

		// 				return room
		// 			})
		// 		]
		// 	})

		// 	return ({
		// 		...chatsState,
		// 		rooms: chatsState.rooms.map(room => {
		// 			if (room.id === chatId) {
		// 				// console.log('from room', room.id, chatId, isTyping)
		// 				room.messages.isTyping = isTyping

		// 				if (isTyping) {
		// 					// console.log('isTyping true, add user:', {
		// 					// 	id: userId,
		// 					// 	name: userName
		// 					// })
		// 					console.log('condition', !room.messages.typingUsers.filter(u => u.id === userId).length)
		// 					if (!room.messages.typingUsers.filter(u => u.id === userId).length) {
		// 						room.messages.typingUsers = [
		// 							// ...room.messages.typingUsers,
		// 							{
		// 								id: userId,
		// 								name: userName
		// 							}
		// 						]
		// 					}
		// 				} else {
		// 					room.messages.typingUsers = [
		// 						...room.messages.typingUsers.filter(u => u.id !== userId)
		// 					]
		// 				}
		// 			}

		// 			return room
		// 		})
		// 	})
		// }

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

		// console.log('newMessage', newMessage)

		// console.log('WebSocketHOC.jsx | updateMessages() | chatsState before', chatsState)

		if (isAddable) {
			const newChatsState = (chatsState) => ({
				...chatsState,
				rooms: [
					{
						...chatsState.rooms.find(r => r.id === chatId),
						messages: {
							...chatsState.rooms.find(r => r.id === chatId).messages,
							pages: Math.ceil(chatsState.rooms.find(r => r.id === chatId).messages.messagesCount / 25),
							data: [
								newMessage,
								...chatsState.rooms.find(r => r.id === chatId).messages.data, // {data: [{..}, {..}]
							],
							typingUsers: [
								...chatsState.rooms.find(r => r.id === chatId).messages.typingUsers.filter(u => u.id !== newMessage.user_id)
							]
						}
					},
					...chatsState.rooms.filter(r => r.id !== chatId), // [{...}, {...}]
				]
			})

			setChatsState(chatsState => newChatsState(chatsState))
		}



		// if (isMyMessage) {
		// 	const newChatsState = (chatsState) => ({
		// 		...chatsState,
		// 		rooms: [
		// 			{
		// 				...chatsState.rooms.find(r => r.id === chatId),
		// 				messages: {
		// 					...chatsState.rooms.find(r => r.id === chatId).messages,
		// 					data: [
		// 						newMessage,
		// 						...chatsState.rooms.find(r => r.id === chatId).messages.data, // {data: [{..}, {..}]
		// 					]
		// 				}
		// 			},
		// 			...chatsState.rooms.filter(r => r.id !== chatId), // [{...}, {...}]
		// 		]
		// 	})

		// 	setChatsState(chatsState => newChatsState(chatsState))
		// 	console.log('WebSocketHOC.jsx | updateMessages() | newChatsState after', newChatsState)
		// } else {
		// 	const newChatsState = (chatsState) => ({
		// 		...chatsState,
		// 		rooms: [
		// 			{
		// 				...chatsState.rooms.find(r => r.id)
		// 			}
		// 		]
		// 	})

		// 	setChatsState(chatsState => newChatsState)
		// }

	}

	// set active chat id
	const setActiveChat = async (chatId) => {
		// set chat
		// console.log('set active chat = ', chatId)
		setChatsState(chatsState => ({ ...chatsState, activeChatId: chatId }))

		// get pagination links and meta data
		// const chatData = await ChatAPI.getChat(chatId)
		// console.log('chatData', chatData)
		// setChatsState(chatsState => ({...chatsState, rooms: [
		// 	{
		// 		...chatsState.rooms.find(r => r.id === chatId),
		// 		messages: {
		// 			...chatsState.rooms.find(r => r.id === chatId).messages,
		// 			data: [
		// 				chatData,
		// 				...chatsState.rooms.find(r => r.id === chatId).messages.data, // {data: [{..}, {..}]
		// 			]
		// 		}
		// 	},
		// 	...chatsState.rooms.filter(r => r.id !== chatId), // [{...}, {...}]
		// ]}))
	}

	// pagination on scroll
	let inLoad = false
	const onScrollToTop = async (e) => {

		// offset for top which will be start load if scroll to him
		const offset = 2

		// console.log('next on scroll state', ({
		// 	...chatsState, rooms: [
		// 		...chatsState.rooms.filter(room => room.id !== chatsState.activeChatId),
		// 		{
		// 			...chatsState.rooms.find(room => room.id === chatsState.activeChatId),
		// 			messages: { ...chatsState.rooms.find(room => room.id === chatsState.activeChatId).messages, isLoaderActive: true }
		// 		}
		// 	]
		// }))

		// // set isLoaderActive as true
		// const stateCopy = Object.assign(chatsState)
		// const rooms = [
		// 	...stateCopy.rooms.map(room => {
		// 		// if it target chat
		// 		if (room.id === stateCopy.activeChatId) {
		// 			room.messages.isLoaderActive = true
		// 		}

		// 		return room
		// 	})
		// ]
		// setChatsState(chatsState => ({
		// 	...chatsState, rooms
		// }))

		// check
		const currentChat = chatsState.rooms.find(room => room.id === chatsState.activeChatId)
		// console.log('currentChat', currentChat)
		const currentChunk = currentChat.messages.currentChunk
		// console.log('currentChunk', currentChunk)
		const pages = currentChat.messages.pages
		// console.log('pages', pages)
		// const isLoaderActive = chatsState.rooms.find(room => room.id === chatsState.activeChatId).messages.isLoaderActive
		// console.log('isLoaderActive', isLoaderActive)
		const isShouldToLoadNextChunk = e.target.scrollHeight - e.target.clientHeight - offset <= Math.abs(e.target.scrollTop) && !inLoad && (currentChunk < pages)

		// load next chunk
		if (isShouldToLoadNextChunk) {

			inLoad = true

			// set isLoaderActive as true
			const stateCopy = Object.assign(chatsState)
			const rooms = [
				...stateCopy.rooms.map(room => {
					// if it target chat
					if (room.id === stateCopy.activeChatId) {
						room.messages.isLoaderActive = true
					}

					return room
				})
			]
			setChatsState(chatsState => ({
				...chatsState, rooms
			}))

			// const url = chatsState.rooms.find(room => room.id === chatsState.activeChatId)
			// console.log('url', url)
			// console.log('chatsState.activeChatId', chatsState.activeChatId)
			const chatId = chatsState.activeChatId
			const page = chatsState.rooms.find(room => room.id === chatId).messages.currentChunk + 1

			// console.log('page', page)
			const nextMessages = await ChatAPI.getPaginatedChunk(chatId, page)
			// console.log('nextMessages', nextMessages)
			const stateCopy2 = Object.assign(chatsState)
			const rooms2 = [
				...stateCopy.rooms.map(room => {
					// if it target chat
					if (room.id === stateCopy2.activeChatId) {
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

		// const nextMessages = await 
		// console.log('chatsState.activeChatId', chatsState.activeChatId)
		// chatsState.find()

		// console.log({
		// 	scrollHeight: e.target.scrollHeight,
		// 	clientHeight: e.target.clientHeight,
		// 	scrollTop: e.target.scrollTop
		// })
		// console.log('onScrollToTop function | result =', e.target.scrollHeight - e.target.clientHeight - offset <= Math.abs(e.target.scrollTop))
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