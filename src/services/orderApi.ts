import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PaymentInfoType } from './customerApi';


const BASE_API = process.env.REACT_APP_BASE_API || "http://localhost:8080";

export type OrderStatus =
    | 'PLACED'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'READY'
    | 'ON_THE_WAY'
    | 'DELIVERED'
    | 'CANCELLED';

export type OrderItemType = {
    dishId: string;
    quantity: number;
}

export type OrderType = {
    id: string;
    customerId: string;
    restaurantId: string;
    deliveryAdress: string;
    restaurantAddress: string;
    dasherId?: string;
    orderTime: Date;
    status: OrderStatus;
    items: OrderItemType[];
    payment: PaymentInfoType;
}

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_API}/orders` }),
    tagTypes: ['Orders'],
    endpoints: (builder => ({
        createOrder: builder.mutation<OrderType, Partial<OrderType>>({
            query: (order) => ({
                url: "",
                method: "POST",
                body: order,
            }),
            invalidatesTags: ['Orders'],
        }),

    }))
})