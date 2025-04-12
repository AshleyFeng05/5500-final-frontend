import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";

import { customerApi } from "./customerApi";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        [customerApi.reducerPath]: customerApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(customerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch