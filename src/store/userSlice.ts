import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
    id: string | null
    name: string | null
    address: string | null
}

const initialState: UserState = {
    id: null,
    name: null,
    address: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (
            state,
            action: PayloadAction<{ id: string; name: string; address: string }>
        ) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.address = action.payload.address
        },
        clearUser: (state) => {
            state.id = null
            state.name = null
            state.address = null
        }
    }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
