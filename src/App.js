import s from "./App.module.scss"
import Messenger from "./components/account/Messenger"
import RegistrationForm from "./components/main/registration/RegistrationForm"
import { BrowserRouter as Router, Switch, Route, useHistory, useLocation } from "react-router-dom"
import Main from "./components/main/Main"
import StoreProvider from "./contexts/StoreProvider"
import Modal from "./components/modal/Modal"
import ChatsProvider from "./contexts/ChatsProvider"
import WebSocketHOC from "./components/websocket/WebSocketHOC"
import AuthHOC from "./components/auth/AuthHOC"

function App() {
	// // history
	// let h = useHistory()
	// console.log('h', h)

	// // check auth and set init
	// useEffect(() => {
	// 	// check auth and redirect if not auth
	// 	const fetchAuth = async () => {
	// 		const r = await AuthAPI.user()
	// 		if (r.status === 401) {
	// 			setState((state) => ({
	// 				...state,
	// 				appInitialized: true,
	// 				auth: false,
	// 			}))
	// 			// redirect
	// 			window.location.assign("/")
	// 		} else if (r.status === 500) {
	// 			console.warn(
	// 				"Кажется, с сервером сейчас какие-то неполадки. Пожалуйста, попробуйте зайти позже."
	// 			)
	// 			setState((state) => ({
	// 				...state,
	// 				appInitialized: true,
	// 				auth: false,
	// 				appError: r.data.error,
	// 				modalType: "error",
	// 				modalTitle: "Error",
	// 				modalAllowForClose: false,
	// 				isModalOpen: true,
	// 			}))
	// 		} else {
	// 			setState((state) => ({
	// 				...state,
	// 				appInitialized: true,
	// 				user_id: r.id,
	// 				auth: true,
	// 				name: r.name,
	// 				avatarUrl: r.avatar_url,
	// 			}))
	// 		}
	// 	}
	// 	fetchAuth()

	// 	// receive data
	// 	const receiveChats = async () => {
	// 		const c = await ChatsAPI.chats()
	// 		if (c) {
	// 			// setRooms(c.data)
	// 			// console.log('STATE', state, "|", { ...state, rooms: c.data })
	// 			setChatsState((chatsState) => ({ ...chatsState, isSet: true, rooms: c.data }))
	// 		}
	// 	}
	// 	receiveChats()
	// }, [setState, setChatsState])

	return (
		<>
			<StoreProvider>
				<ChatsProvider>
					<AuthHOC>
						<WebSocketHOC>
							<Router>
								<Switch>
									<Route path='/' exact>
										<Main />
									</Route>
									<Route path='/chats' exact>
										<Messenger />
									</Route>
								</Switch>
							</Router>

							{/* {state.isModalOpen && (
								<Modal
									// type={state.modalType}
									// title={state.modalTitle}
									// message={state.appError}
									// modalAllowForClose={state.modalAllowForClose}
								/>
							)} */}
						</WebSocketHOC>
					</AuthHOC>
				</ChatsProvider>
			</StoreProvider>
		</>
	)
}

export default App

// for example with pusher
// window.Echo = new Echo({
// 	broadcaster: "pusher",
// 	key: "local",
// 	cluster: "local",
// 	wsHost: window.location.hostname,
// 	wsPort: 6001,
// 	disableStats: true,
// 	encrypted: false,
// 	forceTLS: false,
// 	// authEndpoint: function() {
// 	// 	async function csrf() {
// 	// 		await AuthAPI.getCSRF()
// 	// 	}
// 	// 	csrf()
// 	// 	return 'http://localhost:8000/api/broadcasting/auth'
// 	// }()
// 	authEndpoint: "http://localhost:8000/api/broadcasting/auth",
// 	auth: {
// 		headers: {
// 			"X-XSRF-TOKEN": setCsrfToken(),
// 			"Accept": "application/json",
// 			"Cookies": document.cookie
// 		},
// 	},
// })
