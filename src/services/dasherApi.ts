import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_API = process.env.REACT_APP_BASE_API || "http://localhost:8080";

export type DasherType = {
    "id": string
    "firstName": string
    "lastName": string
    "email": string
    "password": string
    "phone": string
    "licenseNumber": string
    "vehicleInfo": string
}

export type DasherSigninType = {
    "email": string
    "password": string
}

export type DasherSignupType = {
    "firstName": string
    "lastName": string
    "email": string
    "password": string
    "phone": string
    "licenseNumber": string
    "vehicleInfo": string
}


export const dasherApi = createApi({
    reducerPath: "dasherApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_API}/dashers` }),
    endpoints: (builder) => ({

        login: builder.mutation<Partial<DasherType>, DasherSigninType>({
            query: (credential) => ({
                url: "/login",
                method: "POST",
                body: credential,
            }),
        }),

        signup: builder.mutation<Partial<DasherType>, DasherSignupType>({
            query: (credential) => ({
                url: "/signup",
                method: "POST",
                body: credential,
            }),
        }),



    })
});

export const {
    useLoginMutation,
    useSignupMutation,
} = dasherApi;