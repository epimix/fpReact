import { configureStore } from '@reduxjs/toolkit';
import sessionsReducer from './sessionsSlice';

export const store = configureStore({
    reducer: {
        sessions: sessionsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST']
            }
        })
});
