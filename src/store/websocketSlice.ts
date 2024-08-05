import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebSocketState {
    isConnected: boolean;
    data: unknown | null;
}

const initialState: WebSocketState = {
    isConnected: false,
    data: null,
};

const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        connect(state) {
            state.isConnected = true;
        },
        disconnect(state) {
            state.isConnected = false;
        },
        updateData(state, action: PayloadAction<unknown>) {
            state.data = action.payload;
        },
    },
});

export const { connect, disconnect, updateData } = websocketSlice.actions;
export default websocketSlice.reducer;
