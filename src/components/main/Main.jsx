import s from "./Main.module.scss"
import React, { useContext, useEffect, useState } from "react"
import { AuthAPI } from "../../api/api"
import RegistrationForm from "./registration/RegistrationForm"
import LoginForm from "./login/LoginForm"
import { useHistory } from "react-router-dom"
import Loader from '../loader/Loader';
import { StoreContext } from '../../contexts/StoreProvider';

const Main = () => {
	const { state, setState } = useContext(StoreContext)

	useEffect(() => {
		const fetchAuth = async () => {
			const r = await AuthAPI.user()
			if (r.status === 401) {
				setState(state => ({
					...state, appInitialized: true, auth: false
				}))
			} else if (r.status === 500) {
				console.warn('Кажется, с сервером сейчас какие-то неполадки. Пожалуйста, попробуйте зайти позже.')
				setState(state => ({
					...state, appInitialized: true, auth: false, appError: r.data.error, modalType: 'error', modalTitle: 'Error', modalAllowForClose: true, isModalOpen: true
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
	}, [setState])

	const onSubmitHandler = async (login, password) => {
		const status = await AuthAPI.login(login, password)
		if (status === 204) {
			const r = await AuthAPI.user()
			setState((state) => ({ ...state, auth: true, name: r.name, avatarUrl: r.avatar_url }))
		}
	}
	const logoutHandler = async () => {
		const status = await AuthAPI.logout()
		if (status === 204) {
			setState((state) => ({ ...state, auth: false, name: "", avatarUrl: "" }))
		}
	}
	let history = useHistory()
	const enterHandler = () => {
		history.push("/chats")
	}

	return (
		<StoreContext.Consumer>{({ state }) => (

			state.appInitialized ? (
				<main className={s.main} >
					<style>
						font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
					</style>

					<span className={s.welcome}>
						Welcome to <span className={s.green}>Web</span>Chat
						<span className={s.green}>!</span>
					</span>
					{ state.auth ? (
						<div className={s.account}>
							<img src={state.avatarUrl} alt={state.name + " avatar"} />
							<span>Account: {state.name}</span>
							<button className={s.enter} onClick={enterHandler}>
								Enter
							</button>
							<button className={s.logOut} onClick={logoutHandler}>
								Log out
							</button>
						</div>
					) : (
							<div className={s.login}>
								<div className={s.row}>
									<RegistrationForm onSubmitHandler={onSubmitHandler} />
									<span>or login</span>
									<LoginForm onSubmitHandler={onSubmitHandler} />
								</div>
							</div>
						)
					}
					{/* <Account
				name={state.name}
				auth={state.auth}
				avatarUrl={state.avatarUrl}
				onSubmitHandler={onSubmitHandler}
			/> */}
				</main>
			) : (
					<Loader />
				)
		)}
		</StoreContext.Consumer >
	)
}

export default Main
