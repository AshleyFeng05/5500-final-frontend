import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type CustomerType = {
    "id": string
    "firstName": string
    "lastName": string
    "email": string
    "password": string
    "phone": string
    "address": string
    "paymentInfo": PaymentInfoType[]
}

export type PaymentInfoType = {
    "cardNumber": string
    "cardHolderName": string
    "expirationDate": string
    "cvv": string
}

export type CustomerSigninType = {
    "email": string
    "password": string
}

export type CustomerSignupType = {
    "firstName": string
    "lastName": string
    "email": string
    "password": string
    "phone": string
}

const BASE_API = process.env.REACT_APP_BASE_API || "http://localhost:8080";

export const customerApi = createApi({
    reducerPath: "customerApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_API}/customers` }),
    endpoints: (builder) => ({

        login: builder.mutation<Partial<CustomerType>, CustomerSigninType>({
            query: (credential) => ({
                url: "/login",
                method: "POST",
                body: credential,
            }),
        }),

        signup: builder.mutation<Partial<CustomerType>, CustomerSignupType>({
            query: (credential) => ({
                url: "/signup",
                method: "POST",
                body: credential,
            }),
        }),

        updateInfo: builder.mutation<Partial<CustomerType>, { customerId: string, customer: Partial<CustomerType> }>({
            query: ({ customerId, customer }) => ({
                url: `/updateAccount/${customerId}`,
                method: "PUT",
                body: customer,
            })
        }),

        addPaymentInfo: builder.mutation<Partial<CustomerType>, { customerId: string, paymentInfo: PaymentInfoType }>({
            query: ({ customerId, paymentInfo }) => ({
                url: `/payments/${customerId}`,
                method: "POST",
                body: paymentInfo,
            }),
        }),
        deletePaymentInfo: builder.mutation<Partial<CustomerType>, { customerId: string, paymentInfo: PaymentInfoType }>({
            query: ({ customerId, paymentInfo }) => ({
                url: `/payments/${customerId}`,
                method: "DELETE",
                body: paymentInfo,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useUpdateInfoMutation,
    useAddPaymentInfoMutation,
    useDeletePaymentInfoMutation,
} = customerApi;