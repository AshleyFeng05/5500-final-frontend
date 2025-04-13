import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";

import { customerApi } from "./customerApi";
import { restaurantApi } from "./restaurantApi";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        [customerApi.reducerPath]: customerApi.reducer,
        [restaurantApi.reducerPath]: restaurantApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(customerApi.middleware)
            .concat(restaurantApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch