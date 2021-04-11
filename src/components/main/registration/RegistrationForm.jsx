import s from "./RegistrationForm.module.scss"
import React, { useRef, useState } from "react"
import { AuthAPI } from "../../../api/api";
import SuccessSVG from "./../../icons/SuccessSVG"

const RegistrationForm = ({ isRegistrationComplete, setRegistrationIsComplete, onSubmitHandler }) => {

	// state
	const [name, setName] = useState('');
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const changeName = (e) => {
		e.preventDefault()
		setName(e.target.value)
	}
	const changeLogin = (e) => {
		e.preventDefault()
		setLogin(e.target.value)
	}
	const changePassword = (e) => {
		e.preventDefault()
		setPassword(e.target.value)
	}

	// refs
	const nameInput = useRef()
	const emailInput = useRef()
	const passwordInput = useRef()

	// submit handler
	const onSubmit = async (e) => {
		e.preventDefault()
		// console.log('values', emailInput.current.value, ' - ', passwordInput.current.value)
		// alert()
		const [name, email, password] = [nameInput.current.value, emailInput.current.value, passwordInput.current.value]
		console.log('name', name)
		console.log('email', email)
		console.log('password', password)
		const responseStatus = await AuthAPI.register(name, email, password)
		console.log('responseStatus', responseStatus)
		if (responseStatus === 201) {
			// const response = await AuthAPI.
			console.log('Successful')
			setRegistrationIsComplete()
		} else {
			// error handling...
		}
	}


	return (
		<>
			<div className={s.wrapper}>
				{!isRegistrationComplete ? <div className={s.form}>
					<h2 className={s.header}>Join for free!</h2>
					<form onSubmit={onSubmit}>
						<label htmlFor='name'>
							<input type='text' name='name' value={name} onChange={changeName} placeholder="Name" ref={nameInput} />
						</label>
						<label htmlFor='email'>
							<input type='text' name='email' value={login} onChange={changeLogin} placeholder="Email" ref={emailInput} />
						</label>
						<label htmlFor='password'>

							<input type='password' name='password' value={password} onChange={changePassword} placeholder="Password" ref={passwordInput} />
						</label>
						<button type="submit">Join</button>
					</form>
				</div>
					:
					<div className={s.successRegistration}>
						<div className={s.center}>
							<SuccessSVG />
							<h2>Registration completed successfully. Please, log in.</h2>
						</div>
					</div>}
			</div>
		</>
	)
}

export default RegistrationForm
