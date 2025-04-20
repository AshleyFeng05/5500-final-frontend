import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DishType } from "./dishApi";
import { RootState } from "./store";

export type CartItemType = {
    dish: DishType;
    quantity: number;
}

export type CartState = {
    restaurantId: string | null;
    items: CartItemType[];
    cartConflict: {
        show: boolean;
        newDish: DishType | null;
        newQuantity: number;
    }
}

export const initialCartState: CartState = {
    restaurantId: null,
    items: [],
    cartConflict: {
        show: false,
        newDish: null,
        newQuantity: 0
    }
}

const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ dish: DishType; quantity: number }>) => {
            const { dish, quantity } = action.payload;

            if (state.restaurantId && state.restaurantId !== dish.restaurantId) {
                state.cartConflict = {
                    show: true,
                    newDish: dish,
                    newQuantity: quantity
                };
                return;
            }

            if (!state.restaurantId) {
                state.restaurantId = dish.restaurantId;
            }
            const existingItemIndex = state.items.findIndex(
                (item) => item.dish.id === dish.id
            );
            if (existingItemIndex !== -1) {
                state.items[existingItemIndex].quantity += quantity;
            } else {
                state.items.push({ dish, quantity });
            }
        },

        replaceCartWithNewDish: (state) => {
            if (state.cartConflict.newDish && state.cartConflict.newQuantity > 0) {
                state.items = [{
                    dish: state.cartConflict.newDish,
                    quantity: state.cartConflict.newQuantity
                }];
                state.restaurantId = state.cartConflict.newDish.restaurantId;
                state.cartConflict = {
                    show: false,
                    newDish: null,
                    newQuantity: 0
                };
            }
        },

        cancelCartConflict: (state) => {
            state.cartConflict = {
                show: false,
                newDish: null,
                newQuantity: 0
            };
        },

        updateQuantity: (state, action: PayloadAction<{ dishId: string; quantity: number }>) => {
            const { dishId, quantity } = action.payload;
            const itemIndex = state.items.findIndex((item) => item.dish.id === dishId);

            if (itemIndex !== -1) {
                if (quantity > 0) {
                    state.items[itemIndex].quantity = quantity;
                } else {
                    state.items.splice(itemIndex, 1);
                }
            }

            if (state.items.length === 0) {
                state.restaurantId = null;
            }
        },

        removeFromCart: (state, action: PayloadAction<{ dishId: string; quantity: number }>) => {
            const { dishId, quantity } = action.payload;
            const itemIndex = state.items.findIndex((item) => item.dish.id === dishId);

            if (itemIndex !== -1) {
                if (quantity >= state.items[itemIndex].quantity) {
                    state.items.splice(itemIndex, 1);
                } else {
                    state.items[itemIndex].quantity -= quantity;
                }
            }

            if (state.items.length === 0) {
                state.restaurantId = null;
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.restaurantId = null;
            state.cartConflict = {
                show: false,
                newDish: null,
                newQuantity: 0
            };
        },

    }
});

export const {
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    replaceCartWithNewDish,
    cancelCartConflict
} = cartSlice.actions;

export const selectCartTotalItems = (state: RootState) => {
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

export const selectCartTotalPrice = (state: RootState) => {
    return state.cart.items.reduce((total, item) => total + item.dish.price * item.quantity, 0);
};

export const selectCartConflict = (state: RootState) => {
    return state.cart.cartConflict;
}
export default cartSlice.reducer;