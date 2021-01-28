import { createContext } from "react";

export const StoreContext = createContext({
	state: null,
    setState: () => {}
})