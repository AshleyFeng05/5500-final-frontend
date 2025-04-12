import { createSlice } from "@reduxjs/toolkit"


const authSlice = createSlice({
    name: "auth",
    initialState: {
        customerAuthenticated: false,
        customer: null,
        restaurantAuthenticated: false,
        restaurant: null,
        dasherAuthenticated: false,
        dasher: null,
    },
    reducers: {
        customerLogin: (state, action) => {
            state.customerAuthenticated = true;
            state.customer = action.payload;
        },
        customerLogout: (state) => {
            state.customerAuthenticated = false;
            state.customer = null;
        },
        restaurantLogin: (state, action) => {
            state.restaurantAuthenticated = true;
            state.restaurant = action.payload;
        },
        restaurantLogout: (state) => {
            state.restaurantAuthenticated = false;
            state.restaurant = null;
        },
        dasherLogin: (state, action) => {
            state.dasherAuthenticated = true;
            state.dasher = action.payload;
        },
        dasherLogout: (state) => {
            state.dasherAuthenticated = false;
            state.dasher = null;
        }
    }
});

export const {
    customerLogin,
    customerLogout,
    restaurantLogin,
    restaurantLogout,
    dasherLogin,
    dasherLogout
} = authSlice.actions;

export default authSlice.reducer;
