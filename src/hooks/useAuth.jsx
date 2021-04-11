import { useContext, useEffect } from "react"
import { Router } from "react-router";
import { StoreContext } from '../contexts/StoreProvider';

export const useAuth = () => {
    const {state} = useContext(StoreContext)

    useEffect(() => {
        if (!state.auth) {
            Router.push('/')
        }
    }, [])
}