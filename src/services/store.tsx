import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

import { customerApi } from "./customerApi";
import { restaurantApi } from "./restaurantApi";
import { dishApi } from "./dishApi";
import { defaultAuthState } from "./authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { orderApi } from "./orderApi";

const loadAuth = () => {
    try {
        return {
            customer: JSON.parse(localStorage.getItem("auth:customer") ?? "{}").customer ?? null,
            customerAuthenticated: JSON.parse(localStorage.getItem("auth:customer") ?? "{}").customerAuthenticated ?? false,
            restaurant: JSON.parse(localStorage.getItem("auth:restaurant") ?? "{}").restaurant ?? null,
            restaurantAuthenticated: JSON.parse(localStorage.getItem("auth:restaurant") ?? "{}").restaurantAuthenticated ?? false,
            dasher: JSON.parse(localStorage.getItem("auth:dasher") ?? "{}").dasher ?? null,
            dasherAuthenticated: JSON.parse(localStorage.getItem("auth:dasher") ?? "{}").dasherAuthenticated ?? false,
        };
    } catch {
        return defaultAuthState;
    }
};


export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        [customerApi.reducerPath]: customerApi.reducer,
        [restaurantApi.reducerPath]: restaurantApi.reducer,
        [dishApi.reducerPath]: dishApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
    },
    preloadedState: {
        auth: loadAuth(),
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(customerApi.middleware)
            .concat(restaurantApi.middleware)
            .concat(dishApi.middleware)
            .concat(orderApi.middleware),
});
setupListeners(store.dispatch);

store.subscribe(() => {
    const auth = store.getState().auth;

    // Update localStorage with current state (but don't store when logged out)
    if (auth.customerAuthenticated) {
        localStorage.setItem("auth:customer", JSON.stringify({
            customer: auth.customer,
            customerAuthenticated: auth.customerAuthenticated,
        }));
    }

    if (auth.restaurantAuthenticated) {
        localStorage.setItem("auth:restaurant", JSON.stringify({
            restaurant: auth.restaurant,
            restaurantAuthenticated: auth.restaurantAuthenticated,
        }));
    }

    if (auth.dasherAuthenticated) {
        localStorage.setItem("auth:dasher", JSON.stringify({
            dasher: auth.dasher,
            dasherAuthenticated: auth.dasherAuthenticated,
        }));
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch