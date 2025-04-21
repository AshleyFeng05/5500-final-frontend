import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PaymentInfoType } from './customerApi';


const BASE_API = process.env.REACT_APP_BASE_API || "http://localhost:8080";

export type OrderStatus =
    | 'PLACED'
    | 'PREPARING'
    | 'READY'
    | 'ON_THE_WAY'
    | 'DELIVERED'
    | 'CANCELLED';

export type RestaurantAllowedOrderStatus =
    | 'PREPARING'
    | 'READY'
    | 'CANCELLED';

export type OrderItemType = {
    dishId: string;
    dishName: string;
    quantity: number;
}

export type OrderType = {
    id: string;
    customerId: string;
    deliveryAddress: string;

    restaurantId: string;
    restaurantName: string;
    restaurantAddress: string;

    dasherId?: string;
    dasherName?: string;

    orderTime: Date;
    status: OrderStatus;
    totalPrice: number;
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

        getOrderById: builder.query<OrderType, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Orders", id }],
        }),

        getCustomerOrders: builder.query<OrderType[], string>({
            query: (customerId) => ({
                url: `/customer/${customerId}`,
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),

        getRestaurantActiveOrders: builder.query<OrderType[], string>({
            query: (restaurantId) => ({
                url: `/restaurant/${restaurantId}/active`,
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),

        getRestaurantCompletedOrders: builder.query<OrderType[], string>({
            query: (restaurantId) => ({
                url: `/restaurant/${restaurantId}/completed`,
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),

        restaurantUpdateOrderStatus: builder.mutation<OrderType, { orderId: string; status: OrderStatus; restaurantId: string }>({
            query: ({ orderId, status, restaurantId }) => ({
                url: `/status/restaurant/${orderId}`,
                method: 'PUT',
                body: { status, restaurantId },
            }),
            invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
        }),

    }))
})

export const {
    useCreateOrderMutation,
    useGetOrderByIdQuery,
    useGetCustomerOrdersQuery,
    useGetRestaurantActiveOrdersQuery,
    useGetRestaurantCompletedOrdersQuery,
    useRestaurantUpdateOrderStatusMutation,
} = orderApi;