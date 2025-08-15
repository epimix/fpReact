import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    sessions: [],
    loading: false,
    error: null
};

export const addSession = createAsyncThunk(
    'sessions/addSession',
    async (sessionData) => {
        const newSession = {
            id: Date.now().toString(),
            ...sessionData,
            createdAt: new Date().toISOString()
        };
        return newSession;
    }
);

export const removeSession = createAsyncThunk(
    'sessions/removeSession',
    async (sessionId) => {
        return sessionId;
    }
);

const sessionsSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        clearAllSessions: (state) => {
            state.sessions = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSession.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions.push(action.payload);
            })
            .addCase(addSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeSession.fulfilled, (state, action) => {
                state.sessions = state.sessions.filter(
                    session => session.id !== action.payload
                );
            });
    }
});

export const { clearAllSessions } = sessionsSlice.actions;
export default sessionsSlice.reducer;
