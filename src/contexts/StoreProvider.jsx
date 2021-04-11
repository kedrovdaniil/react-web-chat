import { createContext, useState } from "react";
import { useLocalStorage } from './../utils/useLocalStorage';

export const StoreContext = createContext({
	state: null,
    setState: () => {}
})

const StoreProvider = ({children}) => {
	const [state, setState] = useLocalStorage('store', {
		// app
		appInitialized: false,
		appError: null,
		isModalOpen: false,
		modalType: "info", // 'info', 'warn', 'error'
		modalTitle: "",
		modalAllowForClose: true,
		isRegistrationComplete: false,

		// user auth
		user_id: null,
		auth: false,
		name: null,
		avatarUrl: null,
	})
    // const [state, setState] = useState({
	// 	// app
	// 	appInitialized: false,
	// 	appError: null,
	// 	isModalOpen: false,
	// 	modalType: "info", // 'info', 'warn', 'error'
	// 	modalTitle: "",
	// 	modalAllowForClose: true,

	// 	// user auth
	// 	user_id: null,
	// 	auth: false,
	// 	name: null,
	// 	avatarUrl: null,
    // })

	// set registration is completed successfully
	const setRegistrationIsComplete = () => {
		setState(state => ({...state, isRegistrationComplete: true}))
	}
    
    return (
        <StoreContext.Provider value={{state, setState, setRegistrationIsComplete}}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreProvider