import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_API = process.env.REACT_APP_BASE_API || "http://localhost:8080";


export type CreateDishType = {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    restaurantId: string;
}
export type DishType = CreateDishType & { id: String; }


export const dishApi = createApi({
    reducerPath: "dishApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_API}/dishes` }),
    tagTypes: ["Dishes"],
    endpoints: (builder) => ({

        getDishesByRestaurantId: builder.query<DishType[], string>({
            query: (restaurantId) => `restaurant/${restaurantId}`,
            providesTags: ["Dishes"],
        }),

        createDish: builder.mutation<DishType, CreateDishType>({
            query: (dish) => ({
                url: "",
                method: "POST",
                body: dish,
            }),
            invalidatesTags: ["Dishes"],
        }),

        updateDish: builder.mutation<DishType, DishType>({
            query: (dish) => ({
                url: `/${dish.id}`,
                method: "PUT",
                body: dish,
            }),
            invalidatesTags: ["Dishes"],
        }),

        deleteDish: builder.mutation<void, string>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Dishes"],
        })

    })
});

export const {
    useGetDishesByRestaurantIdQuery,
    useCreateDishMutation,
    useUpdateDishMutation,
    useDeleteDishMutation,
} = dishApi;