import { configureStore } from '@reduxjs/toolkit'
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice.ts'
import userReducer from './userSlice.ts'

const userPersistConfig = {
    key: 'ton-market',
    version: 1,
    storage,
    blacklist: ['id', 'name']
}

const userPersistedReducer = persistReducer(userPersistConfig, userReducer)

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userPersistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER
                ]
            }
        })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
export const persistor = persistStore(store)
