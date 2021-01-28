import s from "./App.module.scss"
import Echo from "laravel-echo"
import { useEffect, useState } from "react"
import { AuthAPI } from "./api/api"
import Messenger from "./components/account/Messenger"
import RegistrationForm from "./components/main/registration/RegistrationForm"
import LoginForm from "./components/main/login/LoginForm"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Main from "./components/main/Main"
import { StoreContext } from "./store/store"
import Modal from "./components/modal/Modal"
import { getCookie } from "./helpers/helpers"

// window.io = require("socket.io-client")

// export var echo_instance = new Echo({
// 	broadcaster: "socket.io",
// 	host: process.env.VUE_APP_BACKEND_APP + ":6001",
// 	auth: {
// 		headers: {
// 			/** I'm using access tokens to access  **/
// 			Authorization: "Bearer " + Cookies.get("access_token"),
// 		},
// 	},
// })

// window.Echo = new Echo({
//     broadcaster: 'socket.io',
// 	host: window.location.hostname + ':6001', // this is laravel-echo-server host
// 	authEndpoint: "/api/broadcasting/auth"
// });

// console.log(window.Echo, window.io)

function App() {
	const [state, setState] = useState({
		appInitialized: false,
		appError: null,
		isModalOpen: false,
		modalType: "info", // 'info', 'warn', 'error'
		modalTitle: "",
		modalAllowForClose: true,

		user_id: null,
		auth: false,
		name: null,
		avatarUrl: null,

		messages: [],
	})

	useEffect(() => {
		// connect to broadcast channel
		window.io = require("socket.io-client")

		window.Echo = new Echo({
			broadcaster: 'socket.io',
			host: window.location.hostname + ':6001', // this is laravel-echo-server host
			authEndpoint: "/api/broadcasting/auth"
		});			
		
		window.Echo.channel(`chat.1`)
			.listen('.NewMessage', (e) => {
				console.log('NewMessage', e.message)
		})

		return () => { 
			window.Echo.leave(`chat.1`)
		}
	}, [])

	return (
		<>
			<StoreContext.Provider value={{ state, setState }}>
				<Router>
					<Switch>
						<Route path='/' exact>
							<Main isInit={state.appInitialized} />
						</Route>
						<Route path='/chats' exact>
							<Messenger
								isInit={state.appInitialized}
								name={state.name}
								auth={state.auth}
								avatarUrl={state.avatarUrl}
							/>
						</Route>
					</Switch>
				</Router>
				{state.isModalOpen && (
					<Modal
						type={state.modalType}
						title={state.modalTitle}
						message={state.appError}
						modalAllowForClose={state.modalAllowForClose}
					/>
				)}
			</StoreContext.Provider>
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
