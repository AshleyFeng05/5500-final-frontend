import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_API = process.env.REACT_APP_BASE_API || "http://localhost:8080";


export type RestaurantSignupType = {
    name: string;
    address: string;
    email: string;
    phone: string;
    password: string;
}
export type DishType = {
    dishId: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}
export type RestaurantType = {
    id: string;
    name: string;
    address: string;
    dishes: DishType[];
    imageUrl: string;
    email: string;
    phone: string;
    password: string;
}
export type RestaurantSigninType = {
    email: string
    password: string
}

export const restaurantApi = createApi({
    reducerPath: "restaurantApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_API}/restaurants` }),
    endpoints: (builder) => ({
        login: builder.mutation<Partial<RestaurantType>, RestaurantSigninType>({
            query: (credential) => ({
                url: "/login",
                method: "POST",
                body: credential,
            }),
        }),
        signup: builder.mutation<Partial<RestaurantType>, RestaurantSignupType>({
            query: (credential) => ({
                url: "/signup",
                method: "POST",
                body: credential,
            }),
        }),
        updateRestaurantAccount: builder.mutation<Partial<RestaurantType>, Partial<RestaurantType> & { id: string }>({
            query: ({ id, ...updatedRestaurant }) => ({
                url: `/${id}`,
                method: "PUT",
                body: updatedRestaurant,
            })
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useUpdateRestaurantAccountMutation,
} = restaurantApi;