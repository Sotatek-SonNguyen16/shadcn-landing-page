import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.ts';
import userReducer from './userSlice.ts';
import socketReducer from './websocketSlice.ts';

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        socket: socketReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
