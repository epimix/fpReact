import { createContext, useState } from "react";

const initialState = {
    value: 0,
    setState: () => {}
};

export const likeContext = createContext(initialState);

export const likeContextProvider = ({ children }) => {
    const [state, setState] = useState(initialState.value);

    return (
        <likeContext.Provider value={{ state, setState }}>
            {children}
        </likeContext.Provider>
    );
};