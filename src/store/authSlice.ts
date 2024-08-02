import {createSlice} from '@reduxjs/toolkit';
import Storage from '@/lib/storage.ts'

interface AuthState {
    accessToken: string | null;
}

const initialState: AuthState = {
    accessToken: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken
            Storage.setAccessToken(action.payload.accessToken)
        },
    },
});

export const {setAccessToken} = authSlice.actions;
export default authSlice.reducer;
