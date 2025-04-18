import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DishType } from "./dishApi";

export type CartItemType = {
    dish: DishType;
    quantity: number;
}

export type CartState = {
    restaurantId: string | null;
    items: CartItemType[];
}

export const initialCartState: CartState = {
    restaurantId: null,
    items: [],
}

const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ dish: DishType; quantity: number }>) => {
            const { dish, quantity } = action.payload;

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
        },
    }
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartTotalItems = (state: { cart: CartState }) => {
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};
export const selectCartTotalPrice = (state: { cart: CartState }) => {
    state.cart.items.reduce((total, item) => total + item.dish.price * item.quantity, 0);
}


export default cartSlice.reducer;