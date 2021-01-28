import s from "./RegistrationForm.module.scss"
import React, { useState } from "react"

const RegistrationForm = ({onSubmitHandler}) => {
    
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const changeLogin = (e) => {
		e.preventDefault()
		setLogin(e.target.value)
	}
	const changePassword = (e) => {
		e.preventDefault()
		setPassword(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const [l, p] = [login, password]
        onSubmitHandler(l, p)
    }

	return (
		<div className={s.wrapper}>
			<span>Join for free!</span>
			<form onSubmit={onSubmit}>
				<label htmlFor='email'>
					
					<input type='text' name='email' value={login} onChange={changeLogin} placeholder="Email" />
				</label>
                <label htmlFor='password'>
                    
					<input type='password' name='password' value={password} onChange={changePassword} placeholder="Password" />
				</label>
                <button type="submit">Join</button>
			</form>
		</div>
	)
}

export default RegistrationForm
