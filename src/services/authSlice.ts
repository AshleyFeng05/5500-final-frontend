import { createSlice } from "@reduxjs/toolkit"
import { CustomerType } from "./customerApi";
import { RestaurantType } from "./restaurantApi";
import { set } from "date-fns";

interface AuthState {
    customerAuthenticated: boolean;
    customer: CustomerType | null;
    restaurantAuthenticated: boolean;
    restaurant: RestaurantType | null;
    dasherAuthenticated: boolean;
    dasher: any | null;
}

export const defaultAuthState: AuthState = {
    customerAuthenticated: false,
    customer: null,
    restaurantAuthenticated: false,
    restaurant: null,
    dasherAuthenticated: false,
    dasher: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState: defaultAuthState,
    reducers: {
        customerLogin: (state, action) => {
            state.customerAuthenticated = true;
            state.customer = action.payload;
        },
        customerLogout: (state) => {
            state.customerAuthenticated = false;
            state.customer = null;
            localStorage.removeItem("auth:customer");
        },
        setCustomer: (state, action) => {
            state.customer = action.payload;
        },
        restaurantLogin: (state, action) => {
            state.restaurantAuthenticated = true;
            state.restaurant = action.payload;
        },
        restaurantLogout: (state) => {
            state.restaurantAuthenticated = false;
            state.restaurant = null;
            localStorage.removeItem("auth:restaurant");
        },
        setRestaurant: (state, action) => {
            state.restaurant = action.payload;
        },
        dasherLogin: (state, action) => {
            state.dasherAuthenticated = true;
            state.dasher = action.payload;
        },
        dasherLogout: (state) => {
            state.dasherAuthenticated = false;
            state.dasher = null;
            localStorage.removeItem("auth:dasher");
        },
        setDasher: (state, action) => {
            state.dasher = action.payload;
        }
    }
});

export const {
    customerLogin,
    customerLogout,
    setCustomer,
    restaurantLogin,
    restaurantLogout,
    setRestaurant,
    dasherLogin,
    dasherLogout,
    setDasher
} = authSlice.actions;

export default authSlice.reducer;
